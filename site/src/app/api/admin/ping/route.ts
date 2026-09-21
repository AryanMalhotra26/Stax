import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";

/**
 * GET /api/admin/ping — the auth smoke test, and nothing else.
 *
 * It exists so the sign-in wiring can be proved BEFORE a single line of it
 * touches the leads table. Getting auth green against a route that returns
 * `{ ok: true }` means a mistake exposes the word "true"; getting it green
 * against a route that returns lead rows means a mistake exposes the lead
 * database. The order is the point, so this ships first and the real API is
 * written only once these pass.
 *
 * Against the deployed site:
 *
 *   1. curl -i https://staxliving.ca/api/admin/ping
 *      → 401. No cookie, no session.
 *
 *   2. curl -i -H "x-stax-admin-user: attacker@evil.com" \
 *           https://staxliving.ca/api/admin/ping
 *      → 401. THE IMPORTANT ONE. A 200 here means something trusts the
 *        header instead of the signed cookie, and the header is the one
 *        thing a caller can set freely.
 *
 *   3. Sign in through Google, then open the URL in that browser
 *      → 200, with your own address in `user`.
 *
 *   4. Remove your address from ADMIN_ALLOWED_EMAILS, then refresh
 *      → 401, immediately — not in eight hours when the cookie expires.
 *
 * DELETE THIS ROUTE once the real admin API exists. A permanently mounted
 * endpoint that confirms an email address is a small, needless disclosure,
 * and its only job is to be deleted.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  /**
   * Read the header the middleware set, never the cookie.
   *
   * Identity is established in exactly one place — src/middleware.ts, which
   * verifies the signature and the allow-list, then deletes any inbound copy
   * of this header before setting its own. A route that re-parsed the cookie
   * here would be a second implementation of the check, and the two would
   * drift.
   *
   * Absent means the middleware did not run, which should be impossible on a
   * path it matches. That is a 500 — a broken deploy, not a failed login, and
   * the two should not look alike.
   */
  const user = request.headers.get(VERIFIED_USER_HEADER);
  if (!user) {
    return Response.json(
      { error: "Identity middleware did not run" },
      { status: 500, headers: { "cache-control": "no-store" } },
    );
  }

  return Response.json(
    { ok: true, user },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}
