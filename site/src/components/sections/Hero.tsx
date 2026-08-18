import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitLetters } from "@/components/motion/SplitWords";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * Home hero. [LCP]
 *
 * Recomposed to to-top.ch's structure, which is the part of that page doing
 * the most work and the part this hero previously ignored.
 *
 * Their hero is *not* a photograph with type laid over it. It is a flat field
 * of brand colour carrying a very large centred headline, with the illustrated
 * range entering as a band across the lower third — 157px display type at
 * -0.04em on 1440, then the image below it. The type owns the screen and the
 * image supports it.
 *
 * The previous version here was a full-bleed render with a headline in the
 * bottom-left corner and a ticker under it: the default treatment on every
 * property site, which is exactly why it read as generic. This inverts it.
 * The render becomes a band the type sits above rather than a backdrop the
 * type fights, and the headline moves to `--text-mega` (~11vw, matching their
 * ratio) so it is the artwork rather than a caption set large.
 *
 * The band's top edge dissolves into the charcoal field, so the building
 * emerges from the colour the way their range does rather than starting at a
 * hard seam.
 *
 * Depth still comes from ParallaxHero via `data-px`. Entrance is a CSS
 * keyframe and the LCP image never animates on load (§6.2 rule 1).
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
      {/* ---- Type field ---------------------------------------------- */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="container-stax w-full py-14 text-center md:py-16">
          <p
            data-px="badge"
            data-px-fade
            className="animate-rise stagger-1 mb-7 inline-flex items-center gap-2.5 bg-brick px-3.5 py-2 text-eyebrow uppercase whitespace-nowrap text-white"
          >
            <span className="h-1.5 w-1.5 shrink-0 bg-white" aria-hidden="true" />
            Now registering · {SITE.facts.occupancyShort}
          </p>

          <h1
            data-px="headline"
            data-px-fade
            aria-label={`${LINE_1} ${LINE_2}`}
            className="animate-rise stagger-2 text-mega uppercase text-white"
          >
            <span className="block">
              <SplitLetters text={LINE_1} />
            </span>
            <span className="block text-white/45">
              <SplitLetters text={LINE_2} startIndex={LINE_1.length} />
            </span>
          </h1>

          <div
            data-px="lede"
            data-px-fade
            className="animate-rise stagger-3 mx-auto mt-8 max-w-xl"
          >
            <span
              className="mx-auto mb-6 block h-px w-16 bg-brick"
              aria-hidden="true"
            />
            <p className="text-lead text-white/70">
              Brand-new rentals near Brock University — furnished, connected by
              a complimentary shuttle, and built for the way students actually
              live.
            </p>
          </div>

          <div
            data-px="cta"
            data-px-fade
            className="animate-rise stagger-4 mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group flex min-h-14 items-center justify-center gap-3 bg-brick px-8 text-[0.9375rem] font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white hover:text-brick"
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
              className="flex min-h-14 items-center justify-center border border-white/40 px-8 text-[0.9375rem] font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white hover:text-ink"
            >
              Floor plans
            </Link>
          </div>
        </div>
      </div>

      {/* ---- Render band --------------------------------------------- */}
      <div className="relative h-[27vh] min-h-48 w-full shrink-0 overflow-hidden md:h-[32vh]">
        <div
          data-px="render"
          className="absolute -inset-y-[12%] inset-x-0 md:-inset-y-[20%]"
        >
          <Render
            media={media("exterior-lawn")}
            sizes="100vw"
            priority
            className="absolute inset-0 block"
            imgClassName="h-full w-full object-cover"
          />
        </div>

        {/* Dissolves the band's top edge into the field above, so the
            building emerges from the colour instead of butting against it. */}
        <div
          data-px="scrim"
          className="absolute inset-0 bg-linear-to-b from-charcoal via-charcoal/25 to-transparent"
          aria-hidden="true"
        />

        <a
          href="#main-story"
          data-px="cue"
          aria-label="Scroll to content"
          className="hero-cue absolute top-6 left-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 place-items-center border border-white/35 bg-charcoal/60 text-white backdrop-blur-[2px] md:grid"
        >
          <svg
            viewBox="0 0 12 26"
            aria-hidden="true"
            className="hero-cue-arrow h-5 w-3 fill-none stroke-current"
            strokeWidth={1.5}
          >
            <path d="M6 0 V22 M1.5 17 L6 22 L10.5 17" />
          </svg>
        </a>
      </div>

      {/* The accent as a thin band rather than a wall — the one place brick
          runs edge to edge. Seam-free loop, no JS. */}
      <div className="relative shrink-0 overflow-hidden bg-brick py-3.5">
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
