import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitLetters } from "@/components/motion/SplitWords";
import { TornEdge } from "@/components/ui/Edge";
import { AMENITIES } from "@/content/amenities";
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
 * The client's own phrasing, and the closest thing the project has to a
 * slogan (Pass 6 §2.1).
 *
 * This was "Your own front door. / Fifteen minutes from Brock." — two true
 * claims, stated flat, which was already a long way better than the
 * "Student living, / reimagined." it replaced. What this adds is rhythm:
 * four words, a parallel structure, and both halves of the product in the
 * smallest space it can be said in.
 *
 * *Here*, not *there*, on the first line — the client's own correction and a
 * real improvement. "Live there. Shuttle there." points twice at the same
 * place and the parallel collapses; *here* is Stax and *there* is Brock, so
 * the two lines now name the two ends of the thing being sold. One word.
 *
 * The concrete differentiators move down into the annotation, which is where
 * this site puts things a person would say rather than things a brand would
 * claim — see below.
 */
const LINE_1 = "Live here.";
const LINE_2 = "Shuttle there.";

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
        {/* `pb-8` on a phone, `pb-14` from md.

            The copy block is `flex-1` under `justify-end`, so every pixel the
            stack below it saves turns into space ABOVE the headline and this
            padding is the only thing setting the distance to the address
            band. At 56px that gap measured 77px — the one genuinely empty
            band on the fold, sitting between the poster and the facts. 32px
            closes it to about 50 and costs the sky above almost nothing. */}
        <div className="container-stax flex w-full flex-1 flex-col justify-end pt-[clamp(7rem,14vw,11rem)] pb-8 md:pb-14">
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

              The annotation carries the two differentiators now rather than
              the facts. With the headline down to four words the fold has
              room for *what makes this different* and no longer needs the
              annotation to be a caption — and *your own front door* and
              *private shuttle to brock* are exactly the two claims nobody
              else near Brock can make. The block count and the move-in date
              are still on the fold: the date is in the proof band's
              neighbour line and the scale figures sit beside it. */}
          <div className="mt-8 flex items-start justify-between gap-8 md:mt-10">
            <p
              data-px="hand"
              data-px-fade
              className="hand max-w-[42ch] text-hand text-brick-light"
              style={{ ["--hand-tilt" as string]: "-3deg" }}
            >
              your own front door. private shuttle to brock.
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

        {/* ---- The address -------------------------------------------
            455 Welland, third time, and now at display scale.

            It has been an 11px eyebrow, then 15px, then 18/22px, and each
            time it still read as a caption because it was sharing a row with
            the developer credit — a line with two things on it has no
            emphasis, only balance. So it takes the whole measure, opens the
            band with the rule that used to sit on the pills, and goes to
            24/32px: large enough to be the second voice on the fold after
            the headline, which is what "prominent" has to mean for the one
            fact somebody will type into a map.

            The marker is doing real work rather than decorating. At this
            size a street name set in bone could read as a strapline; a pin
            in front of it says "this is a place" before the words are
            parsed. */}
        <div className="container-stax relative z-10 w-full border-t border-sand/15 pt-5 pb-4 md:pt-6 md:pb-6">
          {/* 20px on a phone, 32 from `md`. 24 everywhere was the first
              attempt and it broke the line mid-address — "455 Welland Avenue,
              St." with "Catharines" stranded below — and the extra row pushed
              the register circle off the fold, which costs more than the four
              points of size were buying.

              Only the CITY is `nowrap`, and that distinction cost two
              attempts. `text-balance` was the first and it severed the street
              name — "455 Welland / Avenue, St. Catharines". Replacing it with
              a non-breaking space after the comma was worse: that glued
              "Avenue," to "St. Catharines" and left the break between
              "Welland" and "Avenue" as the ONLY place the line could go.

              An address is not a headline. It wants to fill the first line
              and break at the comma, which is exactly what a normal space
              does — so the only thing worth protecting is "St. Catharines",
              a city split across two lines reading as a typo rather than as
              typesetting. */}
          <p className="flex items-center gap-2.5 text-[1.25rem] leading-tight font-medium text-bone md:gap-3 md:text-[2rem]">
            <PinMark />
            <span>
              {SITE.address.street},{" "}
              <span className="whitespace-nowrap">{SITE.address.city}</span>
            </span>
          </p>
        </div>

        {/* ---- Amenity strip -----------------------------------------
            What you get, above the fold, without scrolling.

            This is the change the client asked for and it replaces the half
            of the old proof band that was a development statistic. The band
            used to read *Brock University · 248 suites · 551 beds · A Sphere
            Developments community* — where it is, how big it is, who built
            it — which is a prospectus, not a reason to live somewhere. The
            bed count is gone from the site entirely; the suite count moved
            down to the Idea section, where it is evidence for an argument
            rather than a headline in its own right.

            Read from `AMENITIES`, the same array the walkthrough uses, so
            the strip and the section two screens below can never disagree —
            and so the full list, when it arrives, lands in one file.

            All six now, not five. The client's list is the list.

            IT DOES NOT WRAP TO TWO ON A PHONE, which is what this said and
            what it was sized for. At the eyebrow's 11px with 14px of side
            padding the six chips came out over FIVE rows — 157px, a fifth of
            the fold, and ragged: one row carried two chips and the other four
            carried one each. A list that uneven reads as a layout fault
            rather than as a list.

            10px and 10px of padding is the smallest change that packs them
            two to a row at 375px, which makes the block even-edged as well as
            short. The size comes back at `md`, where there was never a
            problem — one line, as designed. */}
        <div className="container-stax relative z-10 w-full pb-5 md:pb-6">
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-2 md:gap-x-3">
            {AMENITIES.map((a) => (
              <li
                key={a.id}
                /* Tracking, weight and leading are stated rather than left to
                   `text-eyebrow`, because only the SIZE changes between the
                   two breakpoints and the token would otherwise fight the
                   override for the same property. The values are the token's
                   own, so `md:text-eyebrow` lands on exactly what is already
                   there. */
                className="rounded-full border border-sand/20 bg-night/35 px-2.5 py-1 text-[0.625rem] leading-none font-semibold tracking-[0.18em] text-grey/90 uppercase backdrop-blur-[2px] md:px-3.5 md:py-1.5 md:text-eyebrow"
              >
                {a.short}
              </li>
            ))}
          </ul>
        </div>

        {/* The sun-circle is the only CTA, so on a phone — where it is the
            only one there has ever been — it has to be present rather than
            hidden. Sits at a smaller diameter.

            ABOVE the developer credit, which is where it had quietly ended up
            below. The one action on the fold was sitting under the one piece
            of small print on it, and anything placed after a credit line
            stops reading as the thing to do next and starts reading as
            footer. Desktop is unaffected: this block is `lg:hidden` and the
            credit stays last there. */}
        <div className="container-stax w-full pb-7 lg:hidden">
          <Link href="/register" className="sun-circle sun-circle-sm">
            Register your interest
          </Link>
        </div>

        {/* Who is building it. Demoted to its own quiet line so the address
            above can have the full measure — it is a credit, not a claim. */}
        <div className="container-stax relative z-10 w-full pb-8 md:pb-10">
          <span className="text-eyebrow text-grey/75 uppercase">
            A {SITE.developer.name} community
          </span>
        </div>
      </div>

      {/* Torn edge 1 of 2 on the whole site: the dark outside tearing open
          onto the cream of the first light section. It lands because it is
          rare — there is exactly one more, at the FAQ/Register join. */}
      <TornEdge color="bone" />
    </section>
  );
}

/**
 * A map pin, inline.
 *
 * `shrink-0` because it sits in a flex row beside text that wraps on a
 * phone, and a squashed pin is worse than none.
 */
function PinMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[0.85em] w-[0.85em] shrink-0 fill-none stroke-brick-light"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
