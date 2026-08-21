import { NextResponse, type NextRequest } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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
