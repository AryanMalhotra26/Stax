import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * Home hero. [LCP]
 *
 * Image-led, not block-led. The render occupies the full frame and the type
 * sits on it — the pattern every well-made development site uses (ERA
 * Residence, Base31, Scape). An earlier version put the headline on a
 * half-screen brick slab; a large flat field of a mid-saturation red flattens
 * the render and reads cheap, so the accent is now a thin band and a button
 * rather than a wall.
 *
 * Legibility comes from a bottom-weighted gradient rather than a flat scrim,
 * so the building stays visible behind the words.
 *
 * No JS above the fold: entrance is a CSS keyframe with a 60ms stagger and the
 * LCP image never animates (§6.2 rule 1).
 */

const TICKER = [
  `${SITE.facts.units} suites`,
  `${SITE.facts.beds} beds`,
  `${SITE.facts.shuttleMinutes} min to Brock`,
  "Fully furnished",
  "Internet included",
  `${SITE.facts.blocks} blocks`,
  "Shuttle included",
  `Move in ${SITE.facts.occupancyShort}`,
];

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-charcoal">
      <Render
        media={media("exterior-lawn")}
        sizes="100vw"
        priority
        className="absolute inset-0 block"
        imgClassName="h-full w-full object-cover"
      />

      {/* Weighted to the bottom third so the sky and the building stay open. */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/88 via-black/58 to-black/12 md:via-black/38 md:to-transparent"
        aria-hidden="true"
      />

      <div className="container-stax relative flex flex-1 flex-col justify-end pt-28 pb-12 md:pb-16">
        <p className="animate-rise stagger-1 mb-7 inline-flex w-fit items-center gap-2.5 bg-brick px-3.5 py-2 text-eyebrow uppercase whitespace-nowrap text-white">
          <span className="h-1.5 w-1.5 shrink-0 bg-white" aria-hidden="true" />
          Now registering · {SITE.facts.occupancyShort}
        </p>

        <h1 className="animate-rise stagger-2 text-poster uppercase text-white">
          Student living,
          <br />
          reimagined.
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <p className="animate-rise stagger-3 max-w-lg text-lead text-white/80">
            Brand-new rentals near Brock University — furnished, connected by a
            complimentary shuttle, and built for the way students actually live.
          </p>

          <div className="animate-rise stagger-4 flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group flex min-h-14 items-center justify-center gap-3 bg-brick px-7 text-[0.9375rem] font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white hover:text-brick"
            >
              Register your interest
              <svg
                viewBox="0 0 26 10"
                aria-hidden="true"
                className="h-2.5 w-6 shrink-0 fill-none stroke-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                strokeWidth={2}
              >
                <path d="M0 5 H23 M19 1.5 L23 5 L19 8.5" />
              </svg>
            </Link>
            <Link
              href="/residences"
              className="flex min-h-14 items-center justify-center border border-white/45 px-7 text-[0.9375rem] font-bold uppercase tracking-wide text-white backdrop-blur-[2px] transition-colors duration-200 hover:bg-white hover:text-ink"
            >
              Floor plans
            </Link>
          </div>
        </div>
      </div>

      {/* The accent as a thin band rather than a wall — the one place brick
          runs edge to edge. Seam-free loop, no JS. */}
      <div className="relative overflow-hidden bg-brick py-3.5">
        <div className="ticker-track" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {TICKER.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-5 px-6 text-eyebrow uppercase whitespace-nowrap text-white"
                >
                  <span className="h-1.5 w-1.5 shrink-0 bg-white/50" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="sr-only">
          {SITE.facts.units} suites, {SITE.facts.beds} beds,{" "}
          {SITE.facts.shuttleMinutes} minutes to Brock, fully furnished,
          internet included, move in {SITE.facts.occupancy}.
        </p>
      </div>
    </section>
  );
}
