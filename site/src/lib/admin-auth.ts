import { SignJWT, jwtVerify } from "jose";

/**
 * Admin authentication — Google sign-in, plus our own session cookie.
 *
 * WHY NOT CLOUDFLARE ACCESS. That was the plan, and Zero Trust now wants a
 * card on file. WHY NOT OUR OWN PASSWORDS, which was the next idea: because
 * on a Worker it means PBKDF2 through WebCrypto (bcrypt and argon2 are native
 * modules and do not run here), a credentials table, a login throttle backed
 * by D1 because an in-memory one resets on every cold isolate, and a reset
 * flow. That is a lot of security-critical surface to own for two people, and
 * every bit of it is surface Google will hold for free.
 *
 * So Google verifies who somebody is, and this file decides whether that
 * person is allowed in and keeps them signed in for the working day.
 *
 * TWO CHECKS, AND THE SECOND ONE IS THE AUTHORISATION. A valid Google
 * identity proves an email address; it does not entitle anyone to lead data,
 * because anyone with a Google account has one of those. `ADMIN_ALLOWED_EMAILS`
 * is the guest list, and it is re-read on EVERY request rather than baked
 * into the session at sign-in — so removing an address locks that person out
 * on their next click instead of whenever their cookie happens to expire.
 */

const encoder = new TextEncoder();

/* ------------------------------------------------------------------------ *
 * The allow-list
 * ------------------------------------------------------------------------ */

/**
 * `ADMIN_ALLOWED_EMAILS`, comma-separated.
 *
 * An environment variable rather than a database table, and for two people
 * that is the right shape: no migration, no user-management UI, no
 * "who can add users" question, and — because it costs nothing to read — it
 * can be checked on every request from edge middleware, which is what makes
 * removal take effect immediately.
 *
 * Read per call, never captured at module load: the adapter populates
 * `process.env` per request, so a value read at import time comes back
 * undefined on the first request of a cold isolate.
 */
export function allowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Fails closed. An empty or missing list admits nobody.
 *
 * The tempting alternative — "no list configured, so let anyone in" — turns a
 * forgotten environment variable into a public lead database. The failure
 * mode you want is being locked out of your own panel, which you notice in
 * seconds.
 */
export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = allowedEmails();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}

/* ------------------------------------------------------------------------ *
 * Sessions
 * ------------------------------------------------------------------------ */

export const SESSION_COOKIE = "stax_admin_session";

/** Matches the 8 hours the Access design used. Long enough for a workday. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export type AdminSession = { email: string; name?: string };

/**
 * Returns null rather than throwing, so an unconfigured deploy denies every
 * admin request instead of answering with a stack trace that names the
 * missing variable. Fails closed, like `lib/gate.ts`.
 */
function sessionKey(): Uint8Array | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // A short secret is not a secret. 32 random bytes is ~43 base64 characters;
  // this refuses anything that could plausibly be a placeholder.
  if (!secret || secret.length < 32) return null;
  return encoder.encode(secret);
}

export async function createSessionToken(
  session: AdminSession,
): Promise<string | null> {
  const key = sessionKey();
  if (!key) return null;

  return new SignJWT({ name: session.name ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.email.toLowerCase())
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

/**
 * Verify our own session cookie: signature, expiry, and — separately — that
 * the subject is still on the guest list.
 *
 * The allow-list check is here rather than only at sign-in because a session
 * is eight hours long and a decision to remove somebody should not have to
 * wait that long to mean anything.
 */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;

  const key = sessionKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, {
      // Pinned. Without it a token nominates its own algorithm, and the
      // classic forgery is to nominate one the verifier treats as trusted.
      algorithms: ["HS256"],
    });

    const email = payload.sub;
    if (typeof email !== "string") return null;
    if (!isAllowed(email)) return null;

    const name = typeof payload.name === "string" ? payload.name : undefined;
    return { email, name };
  } catch {
    // Expired, forged, malformed and wrong-algorithm all look identical from
    // outside. Whoever is probing is not owed a diagnosis.
    return null;
  }
}

/**
 * The cookie, with every flag that matters.
 *
 * `HttpOnly` keeps it away from script, so an XSS bug on the panel cannot
 * read the session out. `Secure` keeps it off plaintext. `SameSite=Lax`
 * rather than `Strict`: the sign-in journey ends on a redirect back from
 * accounts.google.com, and `Strict` withholds the cookie on exactly that
 * cross-site navigation — you would sign in successfully and arrive logged
 * out. `Lax` still withholds it from cross-site POSTs, which is the CSRF
 * case that matters for a panel whose state-changing calls are all POSTs.
 */
export function sessionCookie(token: string): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join("; ");
}

export function clearedSessionCookie(): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

/**
 * The header middleware uses to hand a VERIFIED identity to a route.
 *
 * Middleware deletes any inbound copy before setting its own, so a caller
 * cannot supply it. Routes read this and never re-parse the cookie: identity
 * is established in exactly one place.
 */
export const VERIFIED_USER_HEADER = "x-stax-admin-user";
