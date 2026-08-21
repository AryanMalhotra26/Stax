import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Suspense } from "react";
import { Enrichment } from "@/components/lead/Enrichment";
import { Render } from "@/components/ui/Render";
import { Eyebrow, ButtonLink } from "@/components/ui";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're on the list",
  robots: { index: false, follow: false },
};

/**
 * The thank-you page does the qualification work (§7.2). It is the highest
 * intent real estate on the site — the visitor has already said yes once, and
 * people who have committed once answer more, not less.
 */
export default function ThankYouPage() {
  return (
    <main id="main" className="min-h-dvh grid lg:grid-cols-[1fr_44%]">
      <div className="px-5 py-10 md:px-12 md:py-14 lg:py-20 max-w-2xl w-full mx-auto lg:mx-0 lg:ml-auto lg:pr-16">
        <Link href="/" className="inline-block" aria-label="Stax — home">
          <Logo className="h-7 w-auto text-ink" />
        </Link>

        <div className="mt-14 md:mt-20">
          <Eyebrow className="text-brick">Registered</Eyebrow>
          <h1 className="text-h1 mt-5 text-balance">
            You&rsquo;re on the list.
          </h1>
          <p className="text-lead text-ink-soft mt-5 max-w-lg">
            The floor plan pack is on its way to your inbox. Two quick questions
            so we send you the right ones — every answer saves as you tap it.
          </p>
        </div>

        <div className="mt-12">
          <Suspense fallback={null}>
            <Enrichment />
          </Suspense>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <p className="text-ink-soft">
            Nothing to answer right now?{" "}
            <Link href="/residences" className="text-ink underline underline-offset-4 hover:text-brick">
              Look at the floor plans
            </Link>{" "}
            or{" "}
            <Link href="/about" className="text-ink underline underline-offset-4 hover:text-brick">
              read about the building
            </Link>
            .
          </p>
          <p className="text-sm text-ink-faint mt-4">
            Questions? Email{" "}
            <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </div>

      {/* Image rail — desktop only. On mobile the questions come first and
          nothing competes with them. */}
      <div className="hidden lg:block relative bg-espresso">
        <Render
          media={media("exterior-evening")}
          sizes="44vw"
          className="absolute inset-0 block"
          imgClassName="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-espresso/85 via-espresso/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <p className="text-grey text-h3 max-w-sm text-balance">
            248 suites. 551 beds. Fifteen minutes from Brock.
          </p>
          {/* `secondary` is a hairline with no colour of its own — it takes
              `currentColor` for both its border and its label. Nothing on
              this panel set one, so it inherited ink from the document and
              rendered at 1.05 against espresso: a button you could not see.
              The panel's own grey is the right answer. */}
          <ButtonLink
            href="/residences"
            variant="secondary"
            className="mt-6 text-grey"
          >
            See the floor plans
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
