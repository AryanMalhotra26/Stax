import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Render } from "@/components/ui/Render";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { media } from "@/content/generated/media";
import { CAMPAIGNS, getCampaign } from "@/content/campaigns";
import { landingFaqs } from "@/content/faqs";
import { SITE } from "@/lib/site";

/**
 * /l/[campaign] — the ad destination (§3.5).
 *
 * Rules this page holds to, all of them load-bearing:
 *   - Logo only. No nav links. Nothing to click but the CTA.
 *   - Form above the image on mobile, directly under the headline.
 *   - Three static images, no carousel — carousels hide content and
 *     near-nobody clicks past slide 1.
 *   - No Lenis, no pinning, no GSAP. Smooth scroll adds perceptual latency to
 *     the exact click being paid for (§6.2 rule 3).
 *   - Statically generated at build so the ad click hits a cached document.
 *
 * Every campaign is a row in `campaigns` — a new ad angle is a row, not a
 * deploy. That is the feature that makes the site pay for itself (§3.5).
 */

export function generateStaticParams() {
  return CAMPAIGNS.filter((c) => c.isActive).map((c) => ({ campaign: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/l/[campaign]">,
): Promise<Metadata> {
  const { campaign: slug } = await props.params;
  const campaign = getCampaign(slug);
  if (!campaign) return { title: "Not found" };

  return {
    title: campaign.headline,
    description: campaign.subhead,
    // Ad landing pages must never be indexed — they compete with / for the
    // brand query and they split the ranking signal.
    robots: { index: false, follow: false },
  };
}

export default async function LandingPage(props: PageProps<"/l/[campaign]">) {
  const { campaign: slug } = await props.params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  return (
    <div className="min-h-dvh flex flex-col">
      {/* 1. Logo only */}
      <header className="container-stax py-6 md:py-7">
        <Logo className="h-6 md:h-7 w-auto text-ink" aria-label="Stax" />
      </header>

      <main id="main" className="flex-1">
        {/* 2. Hero, split. Form above the image on mobile. */}
        <section className="container-stax pb-16 md:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
            <div className="lg:pt-6">
              <h1 className="text-h1 text-balance max-w-2xl">
                {campaign.headline}
              </h1>
              <p className="text-lead text-ink-soft mt-6 max-w-lg">
                {campaign.subhead}
              </p>

              <ul className="mt-8 space-y-3.5">
                {campaign.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3.5">
                    <span
                      className="shrink-0 w-5 h-5 bg-brick mt-0.5 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="w-3 h-3 fill-none stroke-white"
                        strokeWidth={3}
                      >
                        <path d="M4 10.5 L8 14.5 L16 6" strokeLinecap="square" />
                      </svg>
                    </span>
                    <span className="text-ink-soft">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Form sits directly under the headline block on mobile —
                  above the image, which is the whole point (§3.5). */}
              <div className="mt-10 border border-line p-6 md:p-8 bg-paper">
                <CaptureForm
                  ctaLabel={campaign.ctaLabel}
                  landingSlug={campaign.slug}
                />
              </div>
            </div>

            {/* No order override: DOM order already puts the headline, bullets
                and form first on mobile, with the render below them. Hoisting
                the image above the form on a paid-traffic page pushes the only
                conversion element off the first screen (§3.5). */}
            <div className="relative aspect-4/5 lg:aspect-3/4 overflow-clip rounded-md bg-grey">
              <Render
                media={campaign.heroMedia}
                sizes="(max-width: 1023px) 100vw, 45vw"
                priority
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 3. Proof row */}
        <section className="bg-espresso text-grey">
          <div className="container-stax section-y-sm">
            <dl className="grid grid-cols-3 gap-6">
              <Proof value={SITE.facts.units.toString()} label="Suites" />
              <Proof value={`${SITE.facts.shuttleMinutes} min`} label="To Brock" />
              <Proof value={SITE.facts.occupancyShort} label="Move-in" />
            </dl>
          </div>
        </section>

        {/* 4. Three images. Interior, amenity, neighbourhood. No carousel. */}
        <section className="container-stax section-y-sm">
          <div className="grid sm:grid-cols-3 gap-3.5">
            {["living-upgrade-island", "bedroom", "exterior-garden"].map((slug) => (
              <div key={slug} className="relative aspect-4/5 overflow-clip rounded-md bg-grey">
                <Render
                  media={media(slug)}
                  sizes="(max-width: 639px) 100vw, 31vw"
                  className="block w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQ, 3 items — the objections that kill this specific click. */}
        <section className="bg-paper">
          <div className="container-stax section-y-sm">
            <h2 className="text-h2 max-w-lg text-balance">
              Three things people ask first.
            </h2>
            <div className="mt-10 border-t border-line max-w-3xl">
              {landingFaqs.map((faq) => (
                <details key={faq.id} className="group border-b border-line">
                  <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="text-h3 pr-2">{faq.question}</h3>
                    <span className="relative shrink-0 w-5 h-5 mt-1.5" aria-hidden="true">
                      <span className="absolute top-1/2 left-0 w-5 h-[1.5px] bg-ink -translate-y-1/2" />
                      <span className="absolute top-1/2 left-0 w-5 h-[1.5px] bg-ink -translate-y-1/2 rotate-90 transition-transform duration-300 group-open:rotate-0" />
                    </span>
                  </summary>
                  <p className="pb-6 pr-10 text-ink-soft leading-relaxed max-w-xl">
                    {faq.answer.replace(/^\[DRAFT\]\s*/, "")}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Form repeat with a one-line trust statement */}
        <section className="bg-espresso text-grey">
          <div className="container-stax section-y-sm">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start max-w-5xl">
              <div>
                <h2 className="text-h2 text-bone text-balance max-w-md">
                  {campaign.ctaLabel}.
                </h2>
                <p className="mt-5 text-grey/75 max-w-sm">{campaign.trustLine}</p>
              </div>
              <CaptureForm
                onDark
                ctaLabel={campaign.ctaLabel}
                landingSlug={campaign.slug}
              />
            </div>
          </div>
        </section>
      </main>

      {/* 7. Minimal footer: privacy, contact. */}
      <footer className="container-stax py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-ink-faint">
        <p>
          © {new Date().getFullYear()} {SITE.legalName}
        </p>
        <div className="flex gap-6">
          <a href={`mailto:${SITE.email}`} className="hover:text-ink transition-colors">
            {SITE.email}
          </a>
          <a href="/privacy" className="hover:text-ink transition-colors">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}

function Proof({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="text-h2 text-bone tnum">{value}</dd>
      <dt className="text-eyebrow uppercase mt-2 text-grey/75">{label}</dt>
    </div>
  );
}
