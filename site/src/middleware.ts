import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  VERIFIED_USER_HEADER,
  readCookie,
  verifySessionToken,
} from "@/lib/admin-auth";

/**
 * The pre-launch gate.
 *
 * The site is live on staxliving.ca while it is still being built, and this
 * keeps casual visitors out until launch without taking the domain down.
 *
 * IT RUNS ON THE SERVER, and that is the whole point. The obvious version of
 * this is a React component that covers the page once it mounts — which is
 * the only option on static hosting, and which is not a gate at all: the real
 * HTML has already been sent, the whole site sits in the JS bundle, and there
 * is a frame or two before the cover appears where the page is simply
 * readable. Moving to Workers made a real gate possible, so this is one.
 * Without the cookie the site's HTML is never generated and never sent.
 *
 * `middleware.ts`, not the `proxy.ts` it was renamed to in Next 16, and that
 * is a forced choice rather than an oversight. Next 16 pins Proxy to the Node
 * runtime and rejects any attempt to change it — "Route segment config is not
 * allowed in Proxy file… Proxy always runs on Node.js runtime" — while the
 * Cloudflare adapter only bundles an Edge one. Until OpenNext supports Node
 * proxies, the deprecated convention is the one that actually deploys.
 *
 * Everything here is reversed on launch day: delete this file, the two routes
 * under /preview, and restore robots + sitemap. See LAUNCH.md.
 */

/** Bump to force every device to re-enter the password. */
export const PREVIEW_COOKIE = "stax_preview_v1";

/**
 * Paths that must answer even while locked.
 *
 * `/api/lead` is on the list deliberately: the gate page carries the real
 * register form, so a prospective tenant who finds the domain early still
 * becomes a lead instead of a bounce. That is the one thing the gate must not
 * block.
 */
const OPEN_PATHS = [
  "/preview",
  "/api/lead",
  "/api/preview",
  "/robots.txt",
  "/favicon.ico",
];

/**
 * The admin panel and its API. Guarded by its own session, NOT by the
 * password gate below.
 */
const ADMIN_PATHS = ["/admin", "/api/admin"];

/**
 * The paths an admin must reach WITHOUT a session, or there is no way to get
 * one: the sign-in page, and the two legs of the Google round trip.
 *
 * Listed explicitly. A prefix rule over `/admin` is how `/admin/anything`
 * ends up public by accident, so the exceptions are named one at a time.
 */
const ADMIN_PUBLIC_PATHS = ["/admin/login", "/api/admin/auth"];

const matches = (pathname: string, paths: string[]) =>
  paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  /**
   * ---- The admin session ------------------------------------------------
   *
   * BEFORE the password gate, and that ordering is deliberate.
   *
   * The gate 401s everything, so leaving the admin paths behind it would mean
   * every admin request was already being refused for the wrong reason — and
   * a test like "forge the identity header, expect 401" would pass whether or
   * not the session is checked at all. A green test that cannot fail is worse
   * than no test. The gate also disappears entirely on launch day
   * (LAUNCH.md), so anything relying on it for protection is protected only
   * until the day the site goes public.
   *
   * So the admin surface takes its own control and answers on its own terms
   * from here on.
   */
  if (matches(pathname, ADMIN_PATHS)) {
    if (matches(pathname, ADMIN_PUBLIC_PATHS)) return NextResponse.next();

    // Verifies the signature, the expiry, AND that the address is still on
    // `ADMIN_ALLOWED_EMAILS` — which is why removing somebody from that list
    // locks them out on their next request rather than in eight hours.
    const session = await verifySessionToken(
      readCookie(request.headers.get("cookie"), SESSION_COOKIE),
    );
    if (!session) return denyAdmin(request, pathname);

    // Only now does a name get attached to the request. The inbound copy is
    // deleted first: without that line a caller could set the header itself
    // on any request that skips verification, which is the exact spoof the
    // signature check exists to prevent, reintroduced one layer down.
    const headers = new Headers(request.headers);
    headers.delete(VERIFIED_USER_HEADER);
    headers.set(VERIFIED_USER_HEADER, session.email);

    const res = NextResponse.next({ request: { headers } });
    // Lead data must never sit in a CDN or a browser cache.
    res.headers.set("cache-control", "no-store");
    res.headers.set("x-content-type-options", "nosniff");
    return res;
  }

  // `?lock` — drop the cookie so the gate can be tested from your own browser.
  if (searchParams.has("lock")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lock");
    const res = NextResponse.redirect(url);
    res.cookies.delete(PREVIEW_COOKIE);
    return res;
  }

  // `?preview=<password>` — the one-click share link. Unlocks and stays
  // unlocked on that device, so the contractor never has to type anything.
  const offered = searchParams.get("preview");
  if (offered !== null) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    if (offered === process.env.PREVIEW_PASSWORD) {
      const res = NextResponse.redirect(url);
      setPreviewCookie(res);
      return res;
    }
    return NextResponse.redirect(url);
  }

  if (request.cookies.get(PREVIEW_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  if (OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Rewrite rather than redirect: the visitor keeps the URL they typed, so a
  // shared deep link still lands where it was meant to once they unlock.
  const gate = request.nextUrl.clone();
  gate.pathname = "/preview";
  gate.search = "";
  return NextResponse.rewrite(gate, { status: 401 });
}

/**
 * One refusal for every way of failing.
 *
 * Expired, forged, signed-out, removed from the allow-list, and "nobody has
 * set ADMIN_SESSION_SECRET yet" all produce the same answer. The only person
 * who needs the real reason is whoever is reading the logs.
 */
function denyAdmin(request: NextRequest, pathname: string) {
  const headers = {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  };

  // The API answers JSON, because that is what its callers parse. A redirect
  // to an HTML login page would surface in the panel as a parse error rather
  // than as "your session ended".
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...headers, "content-type": "application/json" },
    });
  }

  // A browser gets sent to sign in, carrying where it was going so the round
  // trip ends where it started rather than dumping everyone on the index.
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  const res = NextResponse.redirect(url);
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

export function setPreviewCookie(res: NextResponse) {
  res.cookies.set(PREVIEW_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export const config = {
  /**
   * Everything except Next's own asset routes and the files the gate page
   * itself needs to render. Without this exclusion the gate would block its
   * own stylesheet and fonts and render as unstyled text.
   */
  matcher: [
    "/((?!_next/static|_next/image|renders/|team/|textures/|trail/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
