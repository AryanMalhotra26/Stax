import { Render } from "@/components/ui/Render";
import { Reveal, CountUp } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { SplitWords } from "@/components/motion/SplitWords";
import { ArtArrow, ArtBus, ArtKey, ArtSignpost } from "@/components/ui/LineArt";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * "01 — The Idea" — the question (§5.2).
 *
 * The reference opens the equivalent section with a huge two-tone serif
 * question, a 3D signpost showing a fork in the road, and two large rounded
 * cards naming the two things people are actually worried about. Stax had the
 * same argument in its copy and none of its structure: a 240px summary strip,
 * a counter row, then a text-only block. The words were doing all the work
 * unaided.
 *
 * This is that argument composed. The question is asked at display scale, the
 * fork puts the choice in front of you, the two cards are the two bad options
 * — and the light source picks the answer, because the arm pointing at your
 * own front door is the only thing here that glows.
 *
 * The counter row folds in as a footer strip rather than owning a section of
 * its own. It is supporting evidence for the idea, not a standalone
 * statement, and giving it a section of its own was what made the top of the
 * page read as a slide deck.
 */

/**
 * THE TWO CARDS ARE NO LONGER A MATCHED PAIR (Pass 6 §3.3).
 *
 * Card 02 used to be "The corridor" — a second problem, alongside card 01's
 * carved-up student house. At the client's direction it is now the shuttle,
 * which is a benefit, and two cards set identically under one heading would
 * read as two unrelated statements rather than as an argument.
 *
 * So they stop being a pair and become a before/after. Card 01 is
 * desaturated, unlit and sits back; card 02 is full strength with a halo and
 * is the only object in the section emitting light. Nobody has to be told
 * which one is being recommended — the page has already used exactly this
 * device 400px higher up, on the signpost, where the arm pointing back the
 * way you came is muted and the arm pointing at your own front door glows.
 *
 * The section heading still works without a word changed: *Close enough to
 * campus. Far enough to feel like your own place.* Card 01 is the
 * far-from-campus problem; card 02 is what closes the distance.
 *
 * Two deliberate departures from the change list, both for contrast:
 *
 * The lit numeral is `brick-light`, not `brick`. At 11px on espresso the
 * brand red measures 3.24 against a 4.5 requirement — the same measurement
 * that put Light Grey on these numerals in the first place — where
 * brick-light is 4.96. It is still unmistakably the red, and it is still the
 * only red numeral in the section.
 *
 * The muted numeral is `grey/75`, not `grey/45`. At 45% over clay it comes
 * out at 2.88:1, which is not "sitting back", it is being unreadable; 75%
 * measures 5.67 and is still a clear step below the lit card. The
 * desaturation and the halo are what carry the contrast between the two
 * cards, and neither of those is type.
 */
const CONCERNS = [
  {
    n: "01",
    title: "A room that was never a home",
    body: "A room in a house that was never meant to be one — carved up, patched together, and rented by the door.",
    surface: "bg-clay text-grey saturate-[.7]",
    numeral: "text-grey/75",
    bodyTone: "text-grey/75",
    halo: "",
    tilt: "-1.2deg",
    Art: ArtKey,
  },
  {
    n: "02",
    title: "A home, and a way to campus",
    body: "A purpose-built home with your own front door, rented by the unit — and a private shuttle to Brock roughly every fifteen minutes, both directions, included in your rent. A transit pass if you would rather take the bus.",
    surface: "bg-espresso text-bone",
    numeral: "text-brick-light",
    bodyTone: "text-bone/85",
    // The one lit object in the section. 25%, not the 35% default: this is a
    // lamp behind a card, not the register form's submit button.
    halo: "rounded-md shadow-glow [--glow-strength:0.25]",
    tilt: "1.4deg",
    // A bus, not a door. The door outline was drawn for "The corridor" and
    // leaving it on a card about a shuttle is the kind of detail that reads
    // as unfinished — the same drawing the walkthrough's shuttle card uses.
    Art: ArtBus,
  },
] as const;

export function Positioning() {
  return (
    <section
      id="main-story"
      className="relative overflow-clip bg-bone pt-loose pb-tight"
    >
      {/* A bleed at the top now, and that is a consequence of the reorder.

          This section used to sit directly under the hero, whose `TornEdge`
          WAS the transition — an irregular edge the eye reads as material,
          and a gradient underneath it would have run dark→light→dark→light
          in 300px. The torn edge now opens onto the walkthrough instead, and
          what sits above this section is the shuttle in linen. linen → bone
          is the smallest step on the page, so it takes the shortest ramp: a
          long gradient across a Δ this small reads as a smudge.

          Below: whichever section follows owns the join. With the floor
          plans published that is Floor Plans, which carries the bone bleed on
          its own top edge; while they are hidden it is the image band, whose
          `from` prop is switched to bone in app/page.tsx so its own dissolve
          starts on the colour immediately above it. Either way there is
          exactly one gradient at that boundary, painted by the thing being
          entered. */}
      <Seam edge="top" color="linen" size="sm" />

      <div className="container-stax relative z-2">
        {/* The section's one annotation. Lowercase, rotated, in a student's
            voice, sitting outside the content column — never inside it. */}
        <div className="relative mx-auto max-w-3xl text-center">
          <p
            className="hand inline-block text-hand text-brick"
            style={{ ["--hand-tilt" as string]: "-3deg" }}
          >
            so — where do you actually want to live?
          </p>
          <ArtArrow className="absolute -right-2 -bottom-7 hidden h-10 w-14 text-brick/50 md:block" />
        </div>

        <h2 className="mx-auto mt-7 max-w-[17ch] text-center text-h1 text-balance">
          <span className="text-ink">
            <SplitWords text="Close enough to campus." />
          </span>{" "}
          <span className="text-ink-faint">
            <SplitWords text="Far enough to feel like your own place." />
          </span>
        </h2>

        {/* ---- The fork ------------------------------------------------
            The reference spends 2.2MB of WebGL on a 3D signpost here. This is
            the same idea flat: a band, a drawn post, two arms in the hand —
            about 15KB, and at a glance nobody can tell which one they are
            looking at. */}
        <Reveal className="relative mt-10 md:mt-14" delay={0.06}>
          <div className="sd-mask relative aspect-16/8 overflow-clip rounded-md bg-linen md:aspect-[21/7]">
            <Render
              media={media("exterior-garden")}
              sizes="(max-width: 1439px) 100vw, 1312px"
              className="sd-drift absolute inset-0 block h-[108%] w-full"
              imgClassName="h-full w-full object-cover"
            />
            {/* The scrim runs left to right rather than bottom to top: the
                signpost stands on the lawn at the left, and the building has
                to stay legible at the right. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 45% 60% at 22% 62%, rgb(23 18 16 / 0.62), transparent 70%), linear-gradient(to right, rgb(23 18 16 / 0.88) 6%, rgb(23 18 16 / 0.52) 38%, transparent 66%), linear-gradient(to top, rgb(23 18 16 / 0.45), transparent 40%)",
              }}
            />

            {/* The post and its two boards. Built from elements rather than
                one flat drawing so the arms can carry live text at the hand's
                own size — a label baked into an SVG stops being type. */}
            <div className="absolute inset-y-0 left-0 flex items-end pb-[7%] pl-[6%] md:pl-[8%]">
              <div className="relative flex flex-col items-start">
                <div className="relative mb-1 flex flex-col items-start gap-2.5 md:gap-3.5">
                  {/* Left arm — the alternative. Unlit, and it points back
                      the way you came.

                      Both arms now sit on near-solid panels. They were
                      night/55 and night/80 with the text itself at 85%, and
                      that stacks two transparencies over a photograph: the
                      measured contrast came out at 2.20:1 and 2.97:1
                      depending on what part of the facade was behind them.
                      This is the section's entire argument — which of two
                      ways to live you would rather choose — and it was the
                      one thing on the page you could not read. A panel that
                      is opaque still reads as a board nailed to a post; one
                      that lets the render through does not read at all.

                      The lit arm went the last 8% to fully solid when the
                      accent became red: brick-light on night/92 measures
                      4.34 against the 4.5 it needs below `md`, where the
                      label is still `text-hand-sm`. On solid night it is
                      5.28. */}
                  <span
                    className="hand -translate-x-[14%] rounded-sm border border-bone/30 bg-night/88 px-3 py-1 text-hand-sm whitespace-nowrap text-bone backdrop-blur-[2px] md:px-4 md:py-1.5 md:text-hand"
                    style={{ ["--hand-tilt" as string]: "-6deg" }}
                  >
                    ← a room in someone&rsquo;s house
                  </span>

                  {/* Right arm — the answer. The only object in this
                      composition emitting light, which is how the reader is
                      told which way to go without a word of instruction. */}
                  <span
                    className="hand translate-x-[10%] rounded-sm border border-brick/50 bg-night px-3 py-1 text-hand-sm whitespace-nowrap text-brick-light shadow-glow backdrop-blur-[2px] md:px-4 md:py-1.5 md:text-hand"
                    style={{ ["--hand-tilt" as string]: "4deg" }}
                  >
                    your own front door →
                  </span>
                </div>

                <ArtSignpost
                  className="ml-[18%] h-24 w-28 text-bone/85 md:h-40 md:w-36"
                  // Stroke art needs a shadow cast by the stroke, not by the
                  // element box, or the post disappears against a pale facade.
                  style={{ filter: "drop-shadow(0 2px 10px rgb(23 18 16 / 0.7))" }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* The argument, stated before the two cards rather than after them.
            It was centred, low-contrast and sitting underneath — which made
            the section's actual thesis read as a footnote to its examples.

            It now sits beside the cutaway, because "stacked-townhouse form"
            is the one phrase on this page that a reader cannot picture from
            words. The cross-section shows it in a single frame — a basement
            walkout, a ground-floor suite, and a two-storey suite stacked on
            top, each with its own front door — and it makes the paragraph's
            claim checkable rather than assertable. */}
        <div className="mt-10 grid items-center gap-8 md:mt-14 lg:grid-cols-[minmax(0,42ch)_1fr] lg:gap-14">
          <Reveal delay={0.08}>
            <p className="text-lead text-ink-soft">
              Stax is {SITE.facts.blocks} purpose-built blocks in a
              stacked-townhouse form — private entries, real kitchens,
              balconies — with a private shuttle to Brock that runs all day and
              removes the reason anyone puts up with the alternative.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            {/* The crop lives on an inner element, not on the <figure>.
                With `overflow-clip` and a radius on the figure itself the
                caption is inside the clip box, and the rounded corner shaves
                the first character off it. */}
            <figure>
              <div className="sd-mask relative overflow-clip rounded-md">
                <Render
                  media={media("cutaway")}
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="block w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 font-sans text-eyebrow text-ink-faint uppercase">
                One block, cut through
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* ---- The alternative, and the answer ------------------------- */}
        <div className="relative mt-10 grid items-stretch gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          {CONCERNS.map(({ n, title, body, bodyTone, numeral, surface, halo, tilt, Art }, i) => (
            <Reveal
              key={n}
              delay={i * 0.08}
              as="article"
              className={`h-full ${halo}`}
            >
              <div
                className={`card block-pad flex h-full flex-col ${surface}`}
                style={{ ["--tilt" as string]: tilt }}
              >
                {/* The watermark. Sized to ~60% of the card and bled off a
                    corner — clipping it is what makes it texture rather than
                    a placed icon. */}
                <Art className="pointer-events-none absolute -right-8 -bottom-10 h-[62%] w-auto opacity-8" />

                <div className="relative z-2 flex flex-1 flex-col">
                  <p className={`text-eyebrow tnum uppercase ${numeral}`}>
                    {n}
                  </p>
                  <h3 className="mt-6 text-h2">{title}</h3>
                  <p className={`mt-4 max-w-sm leading-relaxed ${bodyTone}`}>
                    {body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          {/* The connector. Turns two cards into one sentence — and it is the
              only thing here that states the direction of the argument out
              loud, so it is drawn in the same hand as the signpost arrows
              rather than set as a glyph.

              Only where the cards are actually side by side: stacked on a
              phone the pair already reads top-to-bottom, and an arrow
              pointing right across a vertical stack would point at nothing.

              Rotated 49° off the drawing's own axis. `ArtArrow` is drawn
              pointing down-right at roughly 45°, so -45° levels it and the
              remaining 4° is the tilt the rest of the drawn elements carry. */}
          <ArtArrow
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden h-8 w-12 -translate-x-1/2 -translate-y-1/2 -rotate-[49deg] text-brick/70 md:block"
          />
        </div>

        {/* ---- Evidence ------------------------------------------------ */}
        {/* Three, not four. The bed count is gone site-wide — it is the most
            prospectus-shaped number the page had, and this section is meant to
            read as what living here is like rather than as a unit schedule.
            What is left is the one number a renter chooses between, the one
            that gets them to campus, and the one that says when. */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:mt-16 md:grid-cols-3">
          <Fact value={<CountUp to={SITE.facts.units} />} label="Suites" />
          <Fact
            value={
              <>
                <span className="mr-2 mb-[0.3em] self-end font-sans text-[0.26em] font-semibold tracking-[0.18em]">
                  EVERY
                </span>
                <CountUp to={SITE.facts.shuttleEveryMinutes} />
                <span className="ml-1.5 mb-[0.35em] self-end font-sans text-[0.28em] font-semibold tracking-[0.18em]">
                  MIN
                </span>
              </>
            }
            label="Shuttle to Brock"
          />
          <Fact value="Sept" label="2027 move-in" suffix="’27" />
        </dl>
      </div>
    </section>
  );
}

function Fact({
  value,
  label,
  suffix,
}: {
  value: React.ReactNode;
  label: string;
  suffix?: string;
}) {
  return (
    <div>
      <dd className="flex items-baseline font-display text-stat text-ink">
        {value}
        {suffix && <span className="sr-only">{suffix}</span>}
      </dd>
      <dt className="mt-3.5 font-sans text-eyebrow text-ink-faint uppercase">
        {label}
      </dt>
    </div>
  );
}
