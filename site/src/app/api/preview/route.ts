import { NextResponse } from "next/server";
import { setPreviewCookie } from "@/middleware";

/**
 * Exchanges the preview password for the unlock cookie.
 *
 * The password is compared here, on the server, against an environment
 * variable — it is never sent to the browser in any form. The client-side
 * version of this gate has to ship the password (or a trivially reversible
 * encoding of it) inside the bundle, where anyone can read it.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const offered = String(form.get("password") ?? "");
  const expected = process.env.PREVIEW_PASSWORD;

  const back = new URL(request.headers.get("referer") ?? "/", request.url);

  if (!expected || offered !== expected) {
    back.pathname = "/preview";
    back.searchParams.set("e", "1");
    return NextResponse.redirect(back, { status: 303 });
  }

  back.pathname = "/";
  back.search = "";
  const res = NextResponse.redirect(back, { status: 303 });
  setPreviewCookie(res);
  return res;
}
