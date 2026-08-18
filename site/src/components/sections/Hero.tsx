import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitLetters } from "@/components/motion/SplitWords";
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
 * Depth comes from to-top.ch's layered-plate treatment. They separate a
 * mountain range into six images and scrub each at a different `yPercent`;
 * there is one render here rather than a plate stack, so the same differential
 * is applied to the elements that already sit at different z-heights. Each
 * declares itself with `data-px` and ParallaxHero reads them — the render lags
 * behind the page, the type leads it, and the cue sinks hardest.
 *
 * The render and scrim are deliberately oversized and offset (`-inset-y-[20%]`)
 * so a 12% translation never exposes an edge.
 *
 * Entrance is still a CSS keyframe with a 60ms stagger and the LCP image never
 * animates on load — the parallax only responds to scroll (§6.2 rule 1).
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

const LINE_1 = "Student living,";
const LINE_2 = "reimagined.";

export function Hero() {
  return (
    <section
      data-px-root
      className="relative flex min-h-dvh flex-col overflow-hidden bg-charcoal"
    >
      <div data-px="render" className="absolute -inset-y-[20%] inset-x-0">
        <Render
          media={media("exterior-lawn")}
          sizes="100vw"
          priority
          className="absolute inset-0 block"
          imgClassName="h-full w-full object-cover"
        />
      </div>

      {/* Weighted to the bottom third so the sky and the building stay open. */}
      <div
        data-px="scrim"
        className="absolute -inset-y-[20%] inset-x-0 bg-linear-to-t from-black/88 via-black/58 to-black/12 md:via-black/38 md:to-transparent"
        aria-hidden="true"
      />

      <div className="container-stax relative flex flex-1 flex-col justify-end pt-28 pb-12 md:pb-16">
        <p
          data-px="badge"
          data-px-fade
          className="animate-rise stagger-1 mb-7 inline-flex w-fit items-center gap-2.5 bg-brick px-3.5 py-2 text-eyebrow uppercase whitespace-nowrap text-white"
        >
          <span className="h-1.5 w-1.5 shrink-0 bg-white" aria-hidden="true" />
          Now registering · {SITE.facts.occupancyShort}
        </p>

        <h1
          data-px="headline"
          data-px-fade
          aria-label={`${LINE_1} ${LINE_2}`}
          className="animate-rise stagger-2 text-poster uppercase text-white"
        >
          <span className="block">
            <SplitLetters text={LINE_1} />
          </span>
          <span className="block">
            <SplitLetters text={LINE_2} startIndex={LINE_1.length} />
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <p
            data-px="lede"
            data-px-fade
            className="animate-rise stagger-3 max-w-lg text-lead text-white/80"
          >
            Brand-new rentals near Brock University — furnished, connected by a
            complimentary shuttle, and built for the way students actually live.
          </p>

          <div
            data-px="cta"
            data-px-fade
            className="animate-rise stagger-4 flex shrink-0 flex-col gap-3 sm:flex-row"
          >
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

      {/* Scroll cue. Square rather than the reference's circle — the wordmark
          is stacked blocks, so a circle would be the one round thing here. */}
      <a
        href="#main-story"
        data-px="cue"
        aria-label="Scroll to content"
        className="hero-cue absolute right-5 bottom-24 z-10 hidden h-20 w-20 place-items-center border border-white/35 bg-black/25 text-white backdrop-blur-[2px] md:grid xl:right-8"
      >
        <svg
          viewBox="0 0 12 26"
          aria-hidden="true"
          className="hero-cue-arrow h-6 w-3 fill-none stroke-current"
          strokeWidth={1.5}
        >
          <path d="M6 0 V22 M1.5 17 L6 22 L10.5 17" />
        </svg>
      </a>

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
