/**
 * The parts of an OAuth round trip that are the same whoever you sign in with.
 *
 * Extracted when Microsoft was added beside Google. Two copies of a PKCE
 * implementation is two chances to get one of them subtly wrong, and the one
 * that is wrong is the one nobody tests — so `state`, the code verifier and
 * the cookie that carries them across the redirect live here once, and the
 * provider modules hold only what genuinely differs: endpoints, scopes, and
 * which claim carries the address.
 *
 * What each protection actually stops, because they get conflated:
 *
 *   `state` — CSRF on the callback. Without it an attacker completes a
 *             sign-in with THEIR code in YOUR browser and leaves you logged
 *             in as them; anything you then do to the lead data happens in
 *             their account. Bound to an HttpOnly cookie so the callback can
 *             prove the round trip started in this browser.
 *
 *   PKCE    — interception of the authorization code in transit. Belt and
 *             braces for a confidential client that also holds a secret, but
 *             it is cheap and it is what current guidance asks for.
 */

/** Which provider a pending round trip belongs to. */
export type Provider = "google" | "microsoft";

export const OAUTH_STATE_COOKIE = "stax_admin_oauth";
export const OAUTH_NEXT_COOKIE = "stax_admin_next";

/** Scoped to the auth routes: nothing else on the site has any use for it. */
const COOKIE_PATH = "/api/admin/auth";

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomUrlSafe(bytes = 32): string {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function s256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return b64url(new Uint8Array(digest));
}

export type PendingAuth = {
  provider: Provider;
  state: string;
  verifier: string;
};

export function newPendingAuth(provider: Provider): PendingAuth {
  return { provider, state: randomUrlSafe(), verifier: randomUrlSafe(64) };
}

/**
 * `provider.state.verifier`, in one short-lived HttpOnly cookie.
 *
 * The provider travels WITH the state rather than in the URL, and that is the
 * point of putting it here: a callback that took the provider from a query
 * parameter would let a caller claim a Google code was a Microsoft one. This
 * cookie is set by the route that started the flow and cannot be written by
 * script, so the pairing is as trustworthy as the state itself.
 *
 * Ten minutes, because that is how long a person takes to pick an account and
 * type a password, and anything longer is a wider window for a stale value to
 * be replayed. `SameSite=Lax` so it survives the return trip.
 */
export function pendingAuthCookie(p: PendingAuth): string {
  return [
    `${OAUTH_STATE_COOKIE}=${p.provider}.${p.state}.${p.verifier}`,
    `Path=${COOKIE_PATH}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");
}

export function clearedPendingAuthCookie(): string {
  return [
    `${OAUTH_STATE_COOKIE}=`,
    `Path=${COOKIE_PATH}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function parsePendingAuth(value: string | null): PendingAuth | null {
  if (!value) return null;
  const [provider, state, ...rest] = value.split(".");
  if (provider !== "google" && provider !== "microsoft") return null;
  if (!state || rest.length === 0) return null;
  return { provider, state, verifier: rest.join(".") };
}

/**
 * Where to land afterwards, carried through the round trip.
 *
 * Only ever a path on this site, and re-validated on the way out as well as
 * the way in. A `next` allowed to be an absolute URL turns the sign-in route
 * into an open redirect — and an open redirect on an authentication endpoint
 * is a phishing page wearing your own domain.
 */
export function safeNext(value: string | null | undefined): string {
  if (!value) return "/admin";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/admin";
}

export function nextCookie(path: string): string {
  return [
    `${OAUTH_NEXT_COOKIE}=${encodeURIComponent(path)}`,
    `Path=${COOKIE_PATH}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");
}

export function clearedNextCookie(): string {
  return [
    `${OAUTH_NEXT_COOKIE}=`,
    `Path=${COOKIE_PATH}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

/** Constant-time compare, for the `state` check. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** What a provider hands back once it has proved who somebody is. */
export type Identity = { email: string; name?: string };
