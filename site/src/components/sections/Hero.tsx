import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitLetters } from "@/components/motion/SplitWords";
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

/**
 * The two things nobody else near Brock offers, stated flat.
 *
 * This was "Student living, / reimagined." — and "reimagined" is the single
 * highest-frequency abstract intensifier in AI marketing copy, sitting in the
 * largest type on the site while saying nothing (reimagined *how*?). The rest
 * of this site writes like a person — "It matters more in February than it
 * does in September", "You are not buying a couch in August" — and the hero
 * was the one place it wrote like a brand.
 */
const LINE_1 = "Your own front door.";
const LINE_2 = "Fifteen minutes from Brock.";

export function Hero() {
  return (
    <section
      data-px-root
      className="relative flex min-h-dvh flex-col overflow-clip bg-espresso"
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
          {/* Saturation and contrast are pushed on the plate itself rather
              than lightened out of the scrim, because the problem was never
              exposure — it was that a golden-hour gradient, a 35% night wash
              and a 82% scrim stacked into one flat brown-blue band and the
              blocks came out as grey silhouettes with no material. The lit
              windows are the whole "arriving home" idea and they have to be
              legible. Object-position drops 8% so the frame holds more
              building and less empty sky. */}
          <Render
            media={media("exterior-street")}
            sizes="100vw"
            priority
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[38%_70%] [filter:saturate(1.12)_contrast(1.08)] md:object-[50%_70%]"
          />
        </div>

        {/* The scene sits a stop under the type. Without this the render
            competes with the headline for the same pixels and the headline
            loses — which is what a hero must never do.

            22%, not 35%. This wash and the scrim below it were each set in
            isolation and multiply in practice; the headline's contrast is
            carried by the scrim, which is where it belongs, and this layer
            only has to take the edge off the sky. */}
        <div className="absolute inset-0 bg-night/22" />

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
            "linear-gradient(to top, #171210 4%, rgb(23 18 16 / 0.55) 55%, rgb(23 18 16 / 0.22) 78%, transparent 100%)",
        }}
      />

      {/* ---- Copy ------------------------------------------------
          FIVE blocks, left-anchored, one CTA.

          This was ten blocks on a single centred axis — badge, headline x2,
          handwriting, lead paragraph, two buttons, sun-circle, proof label,
          proof row — and that stack *is* the signature of every AI page
          builder's output: pill badge, big headline, grey subheadline,
          primary button plus ghost secondary, all centred. The badge was the
          loudest tell, and the lead paragraph carried no fact that was not
          already on screen twice.

          Breaking the centre axis matters as much as the deletions. The
          reference centres because it has a symmetrical mountain behind it;
          this render is a horizontal terrace of buildings, which reads better
          under an asymmetric overlay — and it leaves the right third of the
          scene uninterrupted. */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* `justify-end` hangs the copy off the bottom of the fold, so the
            bottom padding — not the top — is what sets where the headline
            starts. At `pb-8` the H1 began at 39% of the viewport; this lands
            it near 36%, which is as high as it goes before the sun-circle
            starts crowding the proof band underneath it. */}
        <div className="container-stax flex w-full flex-1 flex-col justify-end pt-[clamp(7rem,14vw,11rem)] pb-14">
          <h1
            data-px="headline"
            data-px-fade
            aria-label={`${LINE_1} ${LINE_2}`}
            className="hero-reveal max-w-[30ch] text-hero text-bone"
          >
            <span className="block">
              <SplitLetters text={LINE_1} />
            </span>
            {/* Sand, not stone.

                The two-tone headline is the site's device and it stays, but
                the quiet half has to survive the brighter render underneath
                it now that the scrim is down from 82% to 55%. Stone (#9c877a)
                over the lit facade measured about 2.8:1 — under the 3:1 that
                large text needs — where sand holds the same warmth at
                roughly 5.5:1 and is still unmistakably a step below bone. */}
            <span className="block text-sand">
              <SplitLetters text={LINE_2} startIndex={LINE_1.length} />
            </span>
          </h1>

          {/* The annotation and the single CTA share a row, and the row is
              top-aligned.

              It was `items-end`, which was the source of the ~200px void
              under the headline: the row's height is set by the sun-circle,
              which is 17ch across, so bottom-aligning the annotation parked
              it at the foot of a 230px box while the headline ended at the
              top of one. Nothing was wrong with the spacing value — the
              annotation was being aligned against an object it has no
              relationship to.

              The annotation itself no longer carries the bed count. That
              number moved to the proof band, and Pass 2's own rule applies:
              carrying a fact in two places on one screen is the same
              redundancy in a different face. Blocks and the move-in date are
              the two things the band does not say. */}
          <div className="mt-8 flex items-start justify-between gap-8 md:mt-10">
            <p
              data-px="hand"
              data-px-fade
              className="hand max-w-[42ch] text-hand text-brick-light"
              style={{ ["--hand-tilt" as string]: "-3deg" }}
            >
              eight blocks. september 2027
            </p>

            {/* The only CTA on the fold, and it points at Register — the
                conversion goal — rather than at the floor plans, which the
                nav already links and which section 02 is entirely made of.
                That also kills the duplicate-destination bug: this circle and
                the deleted FLOOR PLANS button both resolved to /residences.

                `mr-16` because the glow is `0 12px 60px` and the container's
                own inline padding is 40px: flush against the container edge
                the lamp was being sheared off by the section's clip, which
                is the one thing a light source must not be. */}
            <Link
              href="/register"
              data-px="sun-circle"
              className="sun-circle hidden shrink-0 lg:mr-16 lg:grid"
            >
              Register your interest
            </Link>
          </div>
        </div>

        {/* ---- Proof band --------------------------------------------
            Three groups, evenly weighted, spread across the full measure:
            where it is, how big it is, who is building it.

            Pass 2 cut this to two items and that left BROCK UNIVERSITY alone
            at the left and the developer line far right with a void between
            them — a rule with two labels on it rather than a band. Scale is
            the missing third: it is the one claim of the three that the
            headline does not already make, and it belongs here rather than
            in the annotation because it is evidence, not an aside.

            The second `.hand` note that used to open this row is gone. One
            annotation per section is the rule and the fold already has one;
            *minutes from* was also the fragment that read as a label with
            its number missing, since the number is in the headline. */}
        <div className="container-stax relative z-10 w-full pb-8 md:pb-10">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-sand/15 pt-6">
            <span className="text-eyebrow text-grey/85 uppercase">
              Brock University
            </span>
            <span className="text-eyebrow tnum text-grey/85 uppercase">
              {SITE.facts.units} suites · {SITE.facts.beds} beds
            </span>
            <span className="text-eyebrow text-grey/75 uppercase">
              A {SITE.developer.name} community
            </span>
          </div>
        </div>

        {/* The sun-circle is the only CTA, so on a phone — where it is the
            only one there has ever been — it has to be present rather than
            hidden. Sits below the annotation at a smaller diameter. */}
        <div className="container-stax w-full pb-10 lg:hidden">
          <Link href="/register" className="sun-circle sun-circle-sm">
            Register your interest
          </Link>
        </div>
      </div>

      {/* Torn edge 1 of 2 on the whole site: the dark outside tearing open
          onto the cream of the first light section. It lands because it is
          rare — there is exactly one more, at the FAQ/Register join. */}
      <TornEdge color="bone" />
    </section>
  );
}
