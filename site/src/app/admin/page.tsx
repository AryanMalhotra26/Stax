import type { Metadata } from "next";
import { headers } from "next/headers";
import { Logo } from "@/components/brand/Logo";
import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: "Leasing admin",
  robots: { index: false, follow: false },
};

/**
 * /admin — the authenticated shell.
 *
 * NOT THE PANEL. The panel's API and UI are specified in §4 and §5 of
 * `STAX-ADMIN-PANEL-SPEC.md`, which is not in this repo — so what is here is
 * the landing this route needs in order for the sign-in to be testable end
 * to end, and nothing more. It reads no lead data and queries no database.
 *
 * That is also the order the auth spec asks for: prove the door before
 * putting anything behind it. A mistake in this file exposes an email address
 * the viewer already owns.
 *
 * Reaching this page at all means middleware verified a session. The header
 * is read for display only — it is never an authorisation decision, and the
 * decision has already been made upstream.
 */
export default async function AdminPage() {
  const user = (await headers()).get(VERIFIED_USER_HEADER);

  return (
    <main className="min-h-dvh bg-espresso px-5 py-10 md:px-12 md:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-sand/15 pb-6">
          <Logo className="h-6 w-auto text-bone" />
          <div className="flex items-center gap-5">
            <span className="text-[0.9375rem] text-grey/75">{user}</span>
            <SignOutButton />
          </div>
        </header>

        <h1 className="mt-12 font-sans text-[1.75rem] font-medium tracking-[-0.015em] text-bone">
          You&rsquo;re signed in.
        </h1>
        <p className="mt-4 max-w-prose leading-relaxed text-grey/75">
          Sign-in works, and this page is proof of it — it is the only thing
          behind the door so far. The leads table, the filters and the CSV
          export are specified in the admin panel document, which has not been
          built yet.
        </p>

        <div className="mt-10 rounded-md border border-sand/15 bg-bark/40 p-6">
          <p className="font-sans text-eyebrow uppercase text-light-grey">
            What works now
          </p>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-grey/75">
            <li>Google sign-in, limited to the addresses on the allow-list.</li>
            <li>An eight-hour session, and sign-out.</li>
            <li>
              Removal from the allow-list takes effect on the next request, not
              when the session expires.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
