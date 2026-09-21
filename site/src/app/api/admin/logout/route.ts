import { clearedSessionCookie } from "@/lib/admin-auth";

/**
 * POST /api/admin/logout — end the session.
 *
 * POST, not GET. A GET logout is triggerable by any image tag on any page,
 * which is a nuisance rather than a breach, but it also means a link
 * preview or a prefetch can sign somebody out mid-task.
 *
 * Sits BEHIND the session check, which is the obvious thing to get wrong in
 * the other direction: an unauthenticated logout endpoint is a free CSRF
 * target. There is nothing to clear if you were never signed in.
 *
 * This ends the session with Stax, not with Google. That is the honest
 * behaviour — this application has no business reaching into somebody's
 * Google account — and it means signing back in is one click. The sign-in
 * request asks for `prompt=select_account`, so the next sign-in still offers
 * the chooser rather than silently reusing the last identity.
 */
export const runtime = "nodejs";

export async function POST() {
  return new Response(null, {
    status: 204,
    headers: {
      "set-cookie": clearedSessionCookie(),
      "cache-control": "no-store",
    },
  });
}
