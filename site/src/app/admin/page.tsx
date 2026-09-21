import type { Metadata } from "next";
import { headers } from "next/headers";
import { Logo } from "@/components/brand/Logo";
import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";
import { SignOutButton } from "./SignOutButton";
import { LeadsPanel } from "./LeadsPanel";

export const metadata: Metadata = {
  title: "Leasing admin",
  robots: { index: false, follow: false },
};

/**
 * /admin — the leads panel.
 *
 * The page itself is a server component and deliberately thin: it renders the
 * chrome and hands off. Every byte of lead data arrives through
 * /api/admin/leads on the client, which keeps it out of the HTML entirely —
 * so nothing sensitive is in a document that could be cached, and the
 * "session expired" path is a 401 the table can act on rather than a
 * half-rendered page.
 *
 * Reaching this at all means middleware verified a session. The header is
 * read for display only; the decision was made upstream.
 */
export default async function AdminPage() {
  const user = (await headers()).get(VERIFIED_USER_HEADER);

  return (
    <main className="min-h-dvh bg-espresso px-5 py-10 md:px-10 md:py-12">
      <div className="mx-auto max-w-[90rem]">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-sand/15 pb-6">
          <div className="flex items-baseline gap-5">
            <Logo className="h-6 w-auto text-bone" />
            <span className="font-sans text-eyebrow uppercase text-light-grey">
              Leads
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[0.9375rem] text-grey/75">{user}</span>
            <SignOutButton />
          </div>
        </header>

        <div className="mt-8">
          <LeadsPanel />
        </div>
      </div>
    </main>
  );
}
