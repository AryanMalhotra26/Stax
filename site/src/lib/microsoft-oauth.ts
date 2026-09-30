import { createRemoteJWKSet, jwtVerify } from "jose";
import { type Identity, type PendingAuth, s256 } from "./oauth";

/**
 * Microsoft sign-in — the Entra ID (Azure AD) side of the admin login.
 *
 * WHY IT EXISTS. Google was the whole login until the team's addresses turned
 * out not to be Google accounts: `spheredevelopments.ca` has its MX on
 * `mail.protection.outlook.com`, so Sphere runs Microsoft 365 and the Cloud
 * console refuses those addresses outright — "must be associated with an
 * active Google Account". Google remains for the gmail addresses; this is how
 * everybody with a work address gets in.
 *
 * SINGLE TENANT, PINNED, and that is the security decision in this file.
 *
 * Microsoft will happily issue tokens through the `common` endpoint for ANY
 * account in ANY tenant in the world, including one an attacker creates this
 * afternoon on a domain they control. An application that accepts `common`
 * and checks only the address is trivially bypassed, because the address in
 * a token is only as trustworthy as the directory that issued it.
 *
 * So `MICROSOFT_TENANT_ID` is required, the authority is built from it, the
 * issuer is checked against it and the `tid` claim is compared to it as well.
 * Three checks on the same fact, because the failure they prevent is somebody
 * else's directory vouching for an address in yours.
 *
 * NO `email_verified` HERE, unlike Google. Microsoft does not issue that
 * claim, and it does not need to: a pinned single tenant means the address
 * comes from Sphere's own directory, and Sphere's administrator controls what
 * is in it. The tenant pin IS the verification.
 */

export const OAUTH_ERROR_UNCONFIGURED = "unconfigured";

function tenant(): string | null {
  return process.env.MICROSOFT_TENANT_ID || null;
}

function clientId(): string | null {
  return process.env.MICROSOFT_CLIENT_ID || null;
}

function clientSecret(): string | null {
  return process.env.MICROSOFT_CLIENT_SECRET || null;
}

export function isConfigured(): boolean {
  return Boolean(tenant() && clientId() && clientSecret());
}

function authority(t: string): string {
  return `https://login.microsoftonline.com/${encodeURIComponent(t)}`;
}

/**
 * Module scope: the key set is cached on a warm isolate and refetches itself
 * when it meets a `kid` it does not know, which is what key rotation needs.
 */
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
let jwksFor = "";
function tenantJWKS(t: string) {
  if (!jwks || jwksFor !== t) {
    jwks = createRemoteJWKSet(
      new URL(`${authority(t)}/discovery/v2.0/keys`),
    );
    jwksFor = t;
  }
  return jwks;
}

/**
 * Where Microsoft sends the browser back.
 *
 * Its own path, separate from Google's. Two callbacks rather than one shared
 * route because each provider's console registers its own redirect URI, and
 * keeping them apart means adding Microsoft could not break a Google flow
 * that was already working in production.
 */
export function redirectUri(request: Request): string {
  return new URL("/api/admin/auth/microsoft/callback", request.url).toString();
}

export async function authorizeUrl(
  request: Request,
  pending: PendingAuth,
): Promise<string | null> {
  const t = tenant();
  const id = clientId();
  if (!t || !id) return null;

  const params = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: redirectUri(request),
    response_mode: "query",
    // Identity only. No Mail.Read, no Files, no Directory — this application
    // wants to know who you are and has no business asking for anything else,
    // and a consent screen that asks for less is one people actually read.
    scope: "openid profile email",
    state: pending.state,
    code_challenge: await s256(pending.verifier),
    code_challenge_method: "S256",
    // People have a work account and a personal one signed in at once, and
    // silently reusing whichever was last used is how somebody ends up
    // staring at "not authorised" with no idea which identity was sent.
    prompt: "select_account",
  });

  return `${authority(t)}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeCodeForIdentity(
  request: Request,
  code: string,
  verifier: string,
): Promise<Identity | null> {
  const t = tenant();
  const id = clientId();
  const secret = clientSecret();
  if (!t || !id || !secret) return null;

  const res = await fetch(`${authority(t)}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      code,
      redirect_uri: redirectUri(request),
      grant_type: "authorization_code",
      code_verifier: verifier,
      scope: "openid profile email",
    }),
  });

  if (!res.ok) return null;

  const body = (await res.json()) as { id_token?: string };
  if (!body.id_token) return null;

  try {
    const { payload } = await jwtVerify(body.id_token, tenantJWKS(t), {
      // v2.0 tokens carry the tenant GUID in the issuer. This is why
      // MICROSOFT_TENANT_ID must be the GUID rather than a domain name: the
      // domain form works for the authority URL but never appears here, so
      // the comparison would fail for a legitimate token.
      issuer: `https://login.microsoftonline.com/${t}/v2.0`,
      // Pins the token to THIS application. Without it, an id_token minted
      // for any other application in the tenant would verify here.
      audience: id,
    });

    // Belt and braces over the issuer check. They encode the same fact, and
    // an application that gets one of them wrong usually has both wrong.
    if (typeof payload.tid === "string" && payload.tid !== t) return null;

    /**
     * `email` when the directory has a mail attribute, `preferred_username`
     * otherwise — which for a work account is the UPN, and for Sphere is the
     * same `name@spheredevelopments.ca` that goes in the allow-list.
     *
     * Checked in that order rather than either-or: `preferred_username` is
     * the more reliably present of the two, `email` the more reliably an
     * actual mailbox.
     */
    const claimed =
      (typeof payload.email === "string" && payload.email) ||
      (typeof payload.preferred_username === "string" &&
        payload.preferred_username) ||
      null;
    if (!claimed) return null;

    const name = typeof payload.name === "string" ? payload.name : undefined;
    return { email: claimed.toLowerCase(), name };
  } catch {
    return null;
  }
}
