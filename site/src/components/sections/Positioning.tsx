import { Render } from "@/components/ui/Render";
import { Reveal, CountUp } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Seam } from "@/components/ui/Edge";
import { ArtArrow, ArtDoor, ArtKey, ArtSignpost } from "@/components/ui/LineArt";
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

const CONCERNS = [
  {
    n: "01",
    title: "The house that was never a house",
    body: "A room in a house that was never meant to be one — carved up, patched together, and rented by the door.",
    surface: "bg-clay text-bone",
    tilt: "-1.2deg",
    Art: ArtKey,
  },
  {
    n: "02",
    title: "The corridor",
    body: "Or a residence hall, where a corridor is the first thing you walk into every day and the last thing you walk out of.",
    surface: "bg-espresso text-grey",
    tilt: "1.4deg",
    Art: ArtDoor,
  },
] as const;

export function Positioning() {
  return (
    <section
      id="main-story"
      className="relative overflow-clip bg-bone section-y"
    >
      <Seam edge="bottom" color="paper" size="18%" />

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
            the section's actual thesis read as a footnote to its examples. */}
        <Reveal delay={0.08}>
          <p className="mt-10 max-w-[52ch] text-lead text-ink-soft md:mt-14">
            Stax is {SITE.facts.blocks} purpose-built blocks in a
            stacked-townhouse form — private entries, real kitchens, balconies —
            with a complimentary shuttle that removes the reason anyone puts up
            with the alternative.
          </p>
        </Reveal>

        {/* ---- The two concerns ---------------------------------------- */}
        <div className="mt-10 grid items-stretch gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          {CONCERNS.map(({ n, title, body, surface, tilt, Art }, i) => (
            <Reveal key={n} delay={i * 0.08} as="article" className="h-full">
              <div
                className={`card block-pad flex h-full flex-col ${surface}`}
                style={{ ["--tilt" as string]: tilt }}
              >
                {/* The watermark. Sized to ~60% of the card and bled off a
                    corner — clipping it is what makes it texture rather than
                    a placed icon. */}
                <Art className="pointer-events-none absolute -right-8 -bottom-10 h-[62%] w-auto opacity-8" />

                <div className="relative z-2 flex flex-1 flex-col">
                  {/* 11px, and these two cards are `clay` and `espresso`.
                      Brick lands at 3.00 and 3.24; Light Grey is 11.7 and
                      14.0. */}
                  <p className="text-eyebrow tnum text-light-grey uppercase">
                    {n}
                  </p>
                  <h3 className="mt-6 text-h2">{title}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed opacity-80">
                    {body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---- Evidence ------------------------------------------------ */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:mt-16 md:grid-cols-4">
          <Fact value={<CountUp to={SITE.facts.units} />} label="Suites" />
          <Fact value={<CountUp to={SITE.facts.beds} />} label="Beds" />
          <Fact
            value={
              <>
                <CountUp to={SITE.facts.shuttleMinutes} />
                <span className="ml-1.5 mb-[0.35em] self-end font-sans text-[0.28em] font-semibold tracking-[0.18em]">
                  MIN
                </span>
              </>
            }
            label="To Brock, by shuttle"
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
