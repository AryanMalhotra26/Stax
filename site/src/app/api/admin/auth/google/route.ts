import {
  authorizeUrl,
  isConfigured,
  newPendingAuth,
  pendingAuthCookie,
} from "@/lib/google-oauth";

/**
 * GET /api/admin/auth/google — leg one of the sign-in.
 *
 * Mints a fresh `state` and PKCE verifier, parks them in a short-lived
 * HttpOnly cookie, and sends the browser to Google. Nothing is decided here;
 * the decision happens in the callback, which is the only place that can
 * prove the round trip started with this request.
 *
 * Public by design — it is in ADMIN_PUBLIC_PATHS, because a person who cannot
 * reach the sign-in route can never acquire the session that the rest of
 * /admin requires.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isConfigured()) {
    // A misconfiguration, not a refusal, and worth saying plainly: this is
    // reachable only by someone already at the sign-in screen, and "nothing
    // happens when I click the button" is a worse afternoon than being told
    // which variable is missing.
    return new Response(
      "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }

  const pending = newPendingAuth();
  const url = await authorizeUrl(request, pending);
  if (!url) return new Response("Not configured", { status: 503 });

  /**
   * Where to land afterwards, carried through the round trip.
   *
   * Only ever a path on this site, and re-validated in the callback. A
   * `next` that is allowed to be an absolute URL turns the sign-in route into
   * an open redirect — and an open redirect on an authentication endpoint is
   * a phishing page with your domain in the address bar.
   */
  const next = new URL(request.url).searchParams.get("next") ?? "/admin";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  const headers = new Headers({
    location: url,
    "cache-control": "no-store",
  });
  headers.append("set-cookie", pendingAuthCookie(pending));
  headers.append(
    "set-cookie",
    `stax_admin_next=${encodeURIComponent(safeNext)}; Path=/api/admin/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );

  return new Response(null, { status: 302, headers });
}
