import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/chrome/Footer";
import { Render } from "@/components/ui/Render";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { FaqSection } from "@/components/sections/Faq";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register your interest",
  description:
    "Join the Stax priority list for floor plans, pricing and lease dates — released to registrants before they go public. September 2027, near Brock University.",
  alternates: { canonical: "/register" },
};

/**
 * /register — the highest-intent page (§3.4, adapted).
 *
 * BUILD-PLAN specifies /tour with a Cal.com widget. There is nothing to tour:
 * the building completes September 2027, so the high-intent action available
 * now is joining the priority list — which is what the brand's own copy calls
 * for. When the sales centre opens, the Cal.com embed drops into this slot.
 *
 * Layout: one full-bleed render with the copy and the form card sitting on it,
 * both vertically centred. No split seam, and — the point of §3.4 — the entire
 * form is inside the first screen with nothing to scroll past. The section is
 * `h-dvh` with `overflow-clip` precisely so that stays true; the earlier
 * version used large top padding and pushed the submit button under the fold.
 */
export default function RegisterPage() {
  return (
    <>
      <main id="main">
        <section className="relative flex h-dvh min-h-[44rem] flex-col overflow-clip bg-espresso">
          <Render
            media={media("exterior-evening")}
            sizes="100vw"
            priority
            className="absolute inset-0 block"
            imgClassName="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-black/80 via-black/55 to-black/35"
            aria-hidden="true"
          />

          {/* Minimal nav — logo home only. Nothing competing with the form. */}
          <header className="relative shrink-0">
            <div className="container-stax flex h-18 items-center justify-between md:h-20">
              <Link href="/" aria-label="Stax — home">
                <Logo className="h-6 w-auto text-bone md:h-7" />
              </Link>
              <Link
                href="/residences"
                className="text-eyebrow uppercase text-grey/75 transition-colors hover:text-bone"
              >
                Floor plans
              </Link>
            </div>
          </header>

          <div className="container-stax relative flex flex-1 items-center py-6">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16 xl:grid-cols-[1fr_28rem]">
              {/* Copy — hidden on short viewports so the form always fits */}
              <div className="hidden sm:block">
                <p className="animate-rise stagger-1 mb-6 inline-flex w-fit items-center gap-2.5 bg-brick px-3.5 py-2 text-eyebrow uppercase whitespace-nowrap text-bone">
                  <span className="h-1.5 w-1.5 shrink-0 bg-bone" aria-hidden="true" />
                  Priority list · {SITE.facts.occupancyShort}
                </p>

                <h1 className="animate-rise stagger-2 text-h1 uppercase text-bone">
                  Get in
                  <br />
                  first.
                </h1>

                <p className="animate-rise stagger-3 mt-6 max-w-md text-lead text-grey/75">
                  Fifteen seconds, no obligation. Plans, pricing and lease dates
                  go to this list before they go anywhere else.
                </p>

                <dl className="animate-rise stagger-4 mt-9 hidden max-w-md grid-cols-3 gap-6 border-t border-sand/20 pt-7 lg:grid">
                  <Mini value={SITE.facts.units.toString()} label="Suites" />
                  <Mini value={SITE.facts.beds.toString()} label="Beds" />
                  <Mini value={`${SITE.facts.shuttleMinutes} min`} label="To Brock" />
                </dl>
              </div>

              {/* Form card. Charcoal so the fields read as one object on the
                  photograph rather than floating loose over it. */}
              <div className="animate-rise stagger-3 w-full bg-ink/95 p-6 backdrop-blur-md md:p-8">
                <p className="mb-6 text-eyebrow uppercase text-grey/75 sm:hidden">
                  Priority list · {SITE.facts.occupancyShort}
                </p>
                <h2 className="mb-6 text-h3 text-bone sm:hidden">Get in first.</h2>

                <CaptureForm onDark compact ctaLabel="Register your interest" />

                <div className="mt-6 border-t border-sand/15 pt-5">
                  <p className="text-sm text-grey/75">
                    Rather just ask someone?{" "}
                    <a
                      href={SITE.phoneHref}
                      className="font-semibold text-bone underline underline-offset-4 hover:text-brick"
                    >
                      {SITE.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What happens next */}
        <section className="bg-ink text-grey">
          <div className="container-stax section-y">
            <ol className="grid gap-x-8 gap-y-12 md:grid-cols-3">
              <Step
                n="01"
                title="You get the plan pack"
                body="Every layout at full resolution, in your inbox, straight away."
              />
              <Step
                n="02"
                title="We tell you when pricing lands"
                body="Spring 2027. You'll have it before it appears anywhere public."
              />
              <Step
                n="03"
                title="You get first access"
                body="Suites are released to the registration list before general availability."
              />
            </ol>
          </div>
        </section>

        <FaqSection heading="Before you register" eyebrow="Questions" />
      </main>
      <Footer />
    </>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="text-h3 tnum text-bone">{value}</dd>
      <dt className="mt-1.5 text-eyebrow uppercase text-grey/75">{label}</dt>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li>
      <div className="flex items-center gap-3 border-b border-sand/15 pb-3">
        <span className="text-eyebrow tnum text-brick">{n}</span>
        <span className="h-1.5 w-1.5 bg-brick" aria-hidden="true" />
      </div>
      <h2 className="text-h3 mt-5 text-bone">{title}</h2>
      <p className="mt-3 leading-relaxed text-grey/75">{body}</p>
    </li>
  );
}
