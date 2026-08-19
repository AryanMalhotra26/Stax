import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitLetters, SplitWords } from "@/components/motion/SplitWords";
import { TornEdge } from "@/components/ui/Edge";
import { media } from "@/content/generated/media";
import { asset } from "@/lib/asset";
import { SITE } from "@/lib/site";

/**
 * Home hero — "Approach" (§5.1). [LCP]
 *
 * The stage the whole page opens from: you are outside, on the street, in the
 * last hour of daylight. Everything after this moves inward and warmer.
 *
 * Four changes over the previous hero, in the order they matter:
 *
 * 1. THE HEADLINE GOES SERIF AND DROPS TO SENTENCE CASE. It was all-caps Jost
 *    — shouting. The reference whispers at twice the size and wins. This alone
 *    moves the perceived tier of the project more than anything else here.
 *
 * 2. THE IMAGE BECOMES THE ROOM YOU ARE STANDING IN. It was a 27vh strip
 *    below the type: a picture on the wall. The renders are the strongest
 *    emotional asset the project has, and the reference always puts its
 *    imagery *behind* the content. Three plates at different depths (§8.1
 *    Route B) — a golden-hour sky, the street at dusk, and an out-of-focus
 *    foreground — make the hero an environment rather than a backdrop.
 *
 * 3. THE SUN-CIRCLE ARRIVES. The single glowing object above the fold and the
 *    element the page was most conspicuously missing. It is the light source;
 *    nothing else up here emits.
 *
 * 4. THE TICKER GOES. An infinite-scroll stat marquee is the most generic
 *    element on a property site. The reference puts *press logos* inside the
 *    hero — proof before the fold ends. The static proof band is that, in the
 *    only currency this project has pre-construction: proximity, scale, and
 *    who is building it.
 *
 * Depth comes from ParallaxHero via `data-px`; the LCP image never carries an
 * entrance animation, only scroll response.
 */

const LINE_1 = "Student living,";
const LINE_2 = "reimagined.";

export function Hero() {
  return (
    <section
      data-px-root
      className="relative flex min-h-dvh flex-col overflow-hidden bg-espresso"
    >
      {/* ---- The environment ------------------------------------------
          Three plates at three depths (§8.1 Route B). Every plate travels
          *downward* as the page scrolls up, and the sky sits behind all of
          them at full bleed — which is what guarantees no plate can ever
          expose an edge, however far it lags. Oversizing the container is the
          usual fix and it is the wrong one: it forces every plate to be
          scaled up past the point where the render still reads. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* L0 — sky. A CSS gradient rather than an image: the render's own sky
            is flat blue dusk, and golden hour is the entire premise of the
            page. Free, and it is the one layer that never needs to be sharp. */}
        <div
          data-px="sky"
          className="absolute -inset-y-[8%] inset-x-0"
          style={{
            background:
              "linear-gradient(to bottom, #150F0D 0%, #24191A 14%, #4A2C25 26%, #8B4B2E 36%, #D07C36 44%, #E8A33D 50%, #A25E34 58%, #3B2A24 72%, #1E1917 88%)",
          }}
        />

        {/* The sun itself, low and behind the roofline. */}
        <div
          data-px="sun"
          className="absolute top-[18%] left-1/2 h-[62vw] w-[62vw] -translate-x-1/2 rounded-full opacity-55 md:top-[16%] md:h-[46vw] md:w-[46vw] md:opacity-100"
          style={{
            background:
              "radial-gradient(circle, rgb(255 219 152 / 0.85) 0%, rgb(232 163 61 / 0.45) 34%, transparent 70%)",
          }}
        />

        {/* L2 — the blocks at dusk, mid distance. Masked into transparency
            across its own sky so the golden-hour gradient shows through above
            the rooflines: the same result as an alpha cut-out, without one. */}
        <div
          data-px="blocks"
          className="absolute inset-x-0 top-[42%] h-[52%] md:top-[38%] md:h-[56%]"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 16%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, #000 16%, #000 100%)",
          }}
        >
          <Render
            media={media("exterior-street")}
            sizes="100vw"
            priority
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[38%_62%] md:object-[50%_62%]"
          />
        </div>

        {/* The scene sits a stop under the type. Without this the render
            competes with the headline for the same pixels and the headline
            loses — which is what a hero must never do. */}
        <div className="absolute inset-0 bg-night/35" />

        {/* L4 — foreground planting, thrown out of focus. Travels furthest,
            so it reads as the metre of ground between you and the block. */}
        <div data-px="near" className="absolute inset-x-0 -bottom-[6%] h-[26%]">
          <picture>
            <source
              type="image/avif"
              srcSet={`${asset("/renders/hero-near-1024.avif")} 1024w, ${asset("/renders/hero-near-1600.avif")} 1600w`}
              sizes="100vw"
            />
            <img
              src={asset("/renders/hero-near-1600.webp")}
              alt=""
              width={1600}
              height={296}
              className="h-full w-full object-cover"
            />
          </picture>
        </div>
      </div>

      {/* ---- Scrim ----------------------------------------------------
          Lands the environment into the section below it and guarantees the
          type's contrast regardless of what the render is doing up there. */}
      <div
        data-px="scrim"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-7 h-[72vh]"
        style={{
          background:
            "linear-gradient(to top, #171210 4%, rgb(23 18 16 / 0.82) 40%, rgb(23 18 16 / 0.35) 72%, transparent 100%)",
        }}
      />

      {/* ---- Copy ------------------------------------------------------ */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="container-stax w-full flex-1 pt-[clamp(6.5rem,13vw,11rem)] pb-8 text-center">
          <p
            data-px="badge"
            data-px-fade
            className="animate-rise stagger-1 mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full bg-brick px-4 py-2 text-[0.625rem] tracking-[0.16em] text-bone uppercase md:text-eyebrow"
          >
            <span className="h-1.5 w-1.5 shrink-0 bg-bone" aria-hidden="true" />
            Now registering · {SITE.facts.occupancyShort}
          </p>

          {/* Sentence case, display serif, and the two-tone split the
              reference uses on every headline: the statement in full white,
              the resolution a step back into the surface. */}
          <h1
            data-px="headline"
            data-px-fade
            aria-label={`${LINE_1} ${LINE_2}`}
            className="hero-reveal text-mega text-bone"
          >
            <span className="block">
              <SplitLetters text={LINE_1} />
            </span>
            <span className="block text-stone">
              <SplitLetters text={LINE_2} startIndex={LINE_1.length} />
            </span>
          </h1>

          <p
            data-px="hand"
            data-px-fade
            className="hand mt-5 inline-block text-hand text-amber"
            style={{ ["--hand-tilt" as string]: "-2.5deg" }}
          >
            <SplitWords text="eight blocks. your own front door." />
          </p>

          <div
            data-px="lede"
            data-px-fade
            className="animate-rise stagger-3 mx-auto mt-6 max-w-2xl"
          >
            <p className="text-lead text-balance text-grey/70">
              Brand-new rentals near Brock University — furnished, connected by
              a complimentary shuttle, and built for the way students actually
              live.
            </p>
          </div>

          <div
            data-px="cta"
            data-px-fade
            className="animate-rise stagger-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group flex min-h-14 items-center justify-center gap-3 rounded-full bg-brick px-8 text-[0.8125rem] font-bold tracking-[0.06em] text-bone uppercase transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brick-dark hover:shadow-glow [--glow-strength:0.3]"
            >
              Register your interest
              <svg
                viewBox="0 0 26 10"
                aria-hidden="true"
                className="h-2.5 w-6 shrink-0 fill-none stroke-current transition-transform duration-300 group-hover:translate-x-1.5"
                strokeWidth={2}
              >
                <path d="M0 5 H23 M19 1.5 L23 5 L19 8.5" />
              </svg>
            </Link>
            <Link
              href="/residences"
              className="flex min-h-14 items-center justify-center rounded-full border border-grey/30 px-8 text-[0.8125rem] font-bold tracking-[0.06em] text-grey uppercase transition-colors duration-150 ease-[var(--ease-out-soft)] hover:border-amber hover:text-amber"
            >
              Floor plans
            </Link>
          </div>
        </div>

        {/* ---- The sun-circle ----------------------------------------
            Half-overlapping the environment, lower right, so it sits *in* the
            scene rather than on top of it. The only object glowing above the
            fold, and one of exactly two on the site. */}
        <Link
          href="/residences"
          data-px="sun-circle"
          className="sun-circle absolute right-[clamp(1rem,5vw,7rem)] bottom-[clamp(9rem,18vh,14rem)] z-10 hidden lg:grid"
        >
          See the plans
        </Link>

        {/* ---- Proof band -------------------------------------------- */}
        <div className="container-stax relative z-10 w-full pb-8 md:pb-10">
          <div className="flex flex-col items-center gap-4 border-t border-sand/12 pt-6 md:flex-row md:justify-between md:gap-8">
            <p
              className="hand shrink-0 text-hand-sm text-amber"
              style={{ ["--hand-tilt" as string]: "-4deg" }}
            >
              minutes from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-eyebrow text-grey/60 uppercase md:gap-x-10">
              <span className="text-grey/85">Brock University</span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-sand/20 md:block" />
              <span className="hidden tnum sm:inline">
                {SITE.facts.units} suites
              </span>
              <span className="hidden tnum sm:inline">
                {SITE.facts.beds} beds
              </span>
              <span className="tnum">
                {SITE.facts.shuttleMinutes} min to Brock
              </span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-sand/20 md:block" />
              <span className="hidden md:inline">
                A {SITE.developer.name} community
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Torn edge 1 of 2 on the whole site: the dark outside tearing open
          onto the cream of the first light section. It lands because it is
          rare — there is exactly one more, at the FAQ/Register join. */}
      <TornEdge color="bone" />
    </section>
  );
}
