import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Google sign-in — the OAuth 2.0 authorization-code flow, with PKCE.
 *
 * Three protections, and it is worth being clear about which attack each one
 * stops, because they are routinely conflated:
 *
 *   `state`     — CSRF on the callback. Without it, an attacker can complete
 *                 a sign-in flow with THEIR code in YOUR browser and leave
 *                 you logged in as them; anything you then do to the lead
 *                 data happens in their account. Bound to a cookie so the
 *                 callback can prove the round trip started in this browser.
 *
 *   PKCE        — interception of the authorization code in transit. Belt and
 *                 braces for a confidential client like this one, which also
 *                 holds a client secret, but it is cheap and it is what
 *                 current guidance asks for.
 *
 *   `id_token`  — the identity itself, verified against Google's published
 *     verification   keys rather than trusted because it arrived over TLS.
 *                 Google's own docs permit skipping this for a server-side
 *                 code exchange; it is done anyway, because the difference
 *                 between "this channel is trusted" and "this assertion is
 *                 signed" is the difference the rest of this file exists to
 *                 maintain.
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

/**
 * Google issues `iss` as one of these two. Both are legitimate and which one
 * you get is not something to rely on, so both are accepted and neither is
 * assumed.
 */
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

/** Module scope: the key set is cached on a warm isolate and rotates itself. */
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function googleJWKS() {
  jwks ??= createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));
  return jwks;
}

export const OAUTH_STATE_COOKIE = "stax_admin_oauth";

export function clientId(): string | null {
  return process.env.GOOGLE_CLIENT_ID || null;
}

function clientSecret(): string | null {
  return process.env.GOOGLE_CLIENT_SECRET || null;
}

export function isConfigured(): boolean {
  return Boolean(clientId() && clientSecret());
}

/**
 * Where Google sends the browser back.
 *
 * Derived from the request's own origin so localhost and production both work
 * from one build. That is safe despite being request-derived, because Google
 * refuses any `redirect_uri` that is not on the registered list for the
 * client — the origin cannot be used to bounce the code somewhere else, it
 * can only fail to match.
 */
export function redirectUri(request: Request): string {
  return new URL("/api/admin/auth/callback", request.url).toString();
}

/* ------------------------------------------------------------------------ *
 * PKCE + state
 * ------------------------------------------------------------------------ */

function randomUrlSafe(bytes = 32): string {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  let s = "";
  for (const b of buf) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function s256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  let s = "";
  for (const b of new Uint8Array(digest)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type PendingAuth = { state: string; verifier: string };

export function newPendingAuth(): PendingAuth {
  return { state: randomUrlSafe(), verifier: randomUrlSafe(64) };
}

/**
 * `state` and the PKCE verifier, carried across the redirect in one cookie.
 *
 * Ten minutes, because that is how long a person takes to pick an account and
 * type a password, and anything longer is just a wider window for a stale
 * value to be replayed. `SameSite=Lax` so it survives the return trip from
 * Google; `HttpOnly` so script cannot read the verifier out of it.
 */
export function pendingAuthCookie(p: PendingAuth): string {
  return [
    `${OAUTH_STATE_COOKIE}=${p.state}.${p.verifier}`,
    "Path=/api/admin/auth",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");
}

export function clearedPendingAuthCookie(): string {
  return [
    `${OAUTH_STATE_COOKIE}=`,
    "Path=/api/admin/auth",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function parsePendingAuth(value: string | null): PendingAuth | null {
  if (!value) return null;
  const i = value.indexOf(".");
  if (i < 1) return null;
  return { state: value.slice(0, i), verifier: value.slice(i + 1) };
}

/** Constant-time string compare, for the `state` check. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------------------------------------------------------ *
 * The two legs of the flow
 * ------------------------------------------------------------------------ */

export async function authorizeUrl(
  request: Request,
  pending: PendingAuth,
): Promise<string | null> {
  const id = clientId();
  if (!id) return null;

  const params = new URLSearchParams({
    client_id: id,
    redirect_uri: redirectUri(request),
    response_type: "code",
    // Identity only. No Gmail, no Drive, no Calendar — this application wants
    // to know who you are and has no business asking for anything else, and a
    // consent screen that asks for less is one people actually read.
    scope: "openid email profile",
    state: pending.state,
    code_challenge: await s256(pending.verifier),
    code_challenge_method: "S256",
    // Always show the chooser. People have a work account and a personal one,
    // and silently reusing whichever they last signed into is how somebody
    // ends up staring at "not authorised" with no idea which identity was
    // sent.
    prompt: "select_account",
  });

  return `${GOOGLE_AUTH_URL}?${params}`;
}

export type GoogleIdentity = { email: string; name?: string };

/**
 * Exchange the code, then verify the identity token it comes back with.
 *
 * Returns null on every failure — bad code, wrong audience, unverified
 * address, network error. The caller turns that into one generic refusal.
 */
export async function exchangeCodeForIdentity(
  request: Request,
  code: string,
  verifier: string,
): Promise<GoogleIdentity | null> {
  const id = clientId();
  const secret = clientSecret();
  if (!id || !secret) return null;

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: id,
      client_secret: secret,
      redirect_uri: redirectUri(request),
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });

  if (!res.ok) return null;

  const body = (await res.json()) as { id_token?: string };
  if (!body.id_token) return null;

  try {
    const { payload } = await jwtVerify(body.id_token, googleJWKS(), {
      issuer: GOOGLE_ISSUERS,
      // Pins the token to THIS application. Without it, an identity token
      // minted for any other Google client would verify here.
      audience: id,
    });

    const email = payload.email;
    // `email_verified` is not a formality. A Google Workspace administrator
    // can create an account with an arbitrary address on a domain they do not
    // own; the verified flag is what separates a proven address from a typed
    // one, and the allow-list is matched on addresses.
    if (typeof email !== "string" || payload.email_verified !== true) {
      return null;
    }

    const name = typeof payload.name === "string" ? payload.name : undefined;
    return { email: email.toLowerCase(), name };
  } catch {
    return null;
  }
}
