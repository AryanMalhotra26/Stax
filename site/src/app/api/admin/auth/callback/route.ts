import {
  createSessionToken,
  isAllowed,
  sessionCookie,
} from "@/lib/admin-auth";
import {
  OAUTH_STATE_COOKIE,
  clearedPendingAuthCookie,
  exchangeCodeForIdentity,
  parsePendingAuth,
  safeEqual,
} from "@/lib/google-oauth";
import { readCookie } from "@/lib/admin-auth";

/**
 * GET /api/admin/auth/callback — leg two, and the only place a session is
 * ever issued.
 *
 * Four things have to be true before a cookie is set, in this order. The
 * order matters: each step is cheaper than the one after it, and the last one
 * is the only one that is about authorisation rather than authentication.
 *
 *   1. `state` matches the cookie      — this browser started this flow
 *   2. Google accepts the code + PKCE  — the code is genuine and unintercepted
 *   3. The id_token verifies           — the identity is signed, for this client
 *   4. The address is on the list      — this particular person is allowed in
 *
 * Step 4 is the one that does the real work. Steps 1–3 establish *who*
 * somebody is, and anyone on earth with a Google account can satisfy them.
 */
export const runtime = "nodejs";

/** Everything that fails, fails the same way, at the same place. */
function fail(request: Request, reason: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", reason);
  const headers = new Headers({
    location: url.toString(),
    "cache-control": "no-store",
  });
  // The pending-auth cookie is single-use whatever happens. Leaving a spent
  // state and verifier in the browser is the replay this design prevents.
  headers.append("set-cookie", clearedPendingAuthCookie());
  return new Response(null, { status: 302, headers });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie");

  // Google reports a user who declined, or a misconfigured client, here.
  if (url.searchParams.get("error")) return fail(request, "denied");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return fail(request, "invalid");

  // 1. The round trip started in this browser.
  const pending = parsePendingAuth(readCookie(cookies, OAUTH_STATE_COOKIE));
  if (!pending || !safeEqual(pending.state, state)) {
    return fail(request, "expired");
  }

  // 2 + 3. Google vouches for the code, and the identity token verifies
  // against Google's published keys with this client as the audience.
  const identity = await exchangeCodeForIdentity(
    request,
    code,
    pending.verifier,
  );
  if (!identity) return fail(request, "invalid");

  // 4. Authorisation. A proven Google identity is not an entitlement.
  if (!isAllowed(identity.email)) return fail(request, "forbidden");

  const token = await createSessionToken({
    email: identity.email,
    name: identity.name,
  });
  // Null means ADMIN_SESSION_SECRET is missing or too short. Denying is the
  // only safe answer: the alternative is an unsigned session.
  if (!token) return fail(request, "unconfigured");

  const next = decodeURIComponent(
    readCookie(cookies, "stax_admin_next") ?? "/admin",
  );
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  const headers = new Headers({
    location: new URL(safeNext, request.url).toString(),
    "cache-control": "no-store",
  });
  headers.append("set-cookie", sessionCookie(token));
  headers.append("set-cookie", clearedPendingAuthCookie());
  headers.append(
    "set-cookie",
    "stax_admin_next=; Path=/api/admin/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  );

  return new Response(null, { status: 302, headers });
}
