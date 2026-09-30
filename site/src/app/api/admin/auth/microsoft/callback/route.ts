import {
  createSessionToken,
  isAllowed,
  readCookie,
  sessionCookie,
} from "@/lib/admin-auth";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  clearedNextCookie,
  clearedPendingAuthCookie,
  parsePendingAuth,
  safeEqual,
  safeNext,
} from "@/lib/oauth";
import { exchangeCodeForIdentity } from "@/lib/microsoft-oauth";

/**
 * GET /api/admin/auth/microsoft/callback — leg two.
 *
 * Four things must be true before a cookie is set, in this order. Each is
 * cheaper than the one after it, and the last is the only one about
 * authorisation rather than authentication:
 *
 *   1. `state` matches the cookie, AND the cookie says this flow was a
 *      Microsoft one — a Google code must not be redeemable here
 *   2. Entra accepts the code + PKCE verifier
 *   3. The id_token verifies: signature, issuer, audience, and `tid` against
 *      the pinned tenant
 *   4. The address is on ADMIN_ALLOWED_EMAILS
 *
 * Step 4 does the real work. Steps 1–3 establish only who somebody is, and
 * every employee in the tenant can satisfy them.
 */
export const runtime = "nodejs";

function fail(request: Request, reason: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("error", reason);
  const headers = new Headers({
    location: url.toString(),
    "cache-control": "no-store",
  });
  // Single-use whatever happens. Leaving a spent state and verifier in the
  // browser is the replay this design exists to prevent.
  headers.append("set-cookie", clearedPendingAuthCookie());
  headers.append("set-cookie", clearedNextCookie());
  return new Response(null, { status: 302, headers });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie");

  // Entra reports a declined consent or a misconfigured app here.
  if (url.searchParams.get("error")) return fail(request, "denied");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return fail(request, "invalid");

  const pending = parsePendingAuth(readCookie(cookies, OAUTH_STATE_COOKIE));
  if (
    !pending ||
    pending.provider !== "microsoft" ||
    !safeEqual(pending.state, state)
  ) {
    return fail(request, "expired");
  }

  const identity = await exchangeCodeForIdentity(
    request,
    code,
    pending.verifier,
  );
  if (!identity) return fail(request, "invalid");

  if (!isAllowed(identity.email)) return fail(request, "forbidden");

  const token = await createSessionToken({
    email: identity.email,
    name: identity.name,
  });
  // Null means ADMIN_SESSION_SECRET is missing or too short. Denying is the
  // only safe answer: the alternative is an unsigned session.
  if (!token) return fail(request, "unconfigured");

  const next = safeNext(
    decodeURIComponent(readCookie(cookies, OAUTH_NEXT_COOKIE) ?? "/admin"),
  );

  const headers = new Headers({
    location: new URL(next, request.url).toString(),
    "cache-control": "no-store",
  });
  headers.append("set-cookie", sessionCookie(token));
  headers.append("set-cookie", clearedPendingAuthCookie());
  headers.append("set-cookie", clearedNextCookie());

  return new Response(null, { status: 302, headers });
}
