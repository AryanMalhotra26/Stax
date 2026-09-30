import {
  newPendingAuth,
  nextCookie,
  pendingAuthCookie,
  safeNext,
} from "@/lib/oauth";
import { authorizeUrl, isConfigured } from "@/lib/microsoft-oauth";

/**
 * GET /api/admin/auth/microsoft — leg one of the Entra ID sign-in.
 *
 * Mirrors the Google route exactly. Nothing is decided here; the decision
 * happens in the callback, which is the only place that can prove the round
 * trip started with this request.
 *
 * Public by design — it sits under ADMIN_PUBLIC_PATHS, because anyone who
 * cannot reach the sign-in route can never acquire the session the rest of
 * /admin requires.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isConfigured()) {
    // Reachable only from the sign-in screen, so it says what is missing:
    // "nothing happens when I click the button" is a worse afternoon than
    // being told which variable has not been set.
    return new Response(
      "Microsoft sign-in is not configured. Set MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET.",
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }

  const pending = newPendingAuth("microsoft");
  const url = await authorizeUrl(request, pending);
  if (!url) return new Response("Not configured", { status: 503 });

  const next = safeNext(new URL(request.url).searchParams.get("next"));

  const headers = new Headers({ location: url, "cache-control": "no-store" });
  headers.append("set-cookie", pendingAuthCookie(pending));
  headers.append("set-cookie", nextCookie(next));

  return new Response(null, { status: 302, headers });
}
