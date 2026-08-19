import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SplitWords } from "@/components/motion/SplitWords";
import { Eyebrow } from "@/components/ui";
import { Seam } from "@/components/ui/Edge";
import { PlanStack } from "@/components/plans/PlanStack";
import { FLOOR_PLANS, sqftRange } from "@/content/floorPlans";
import { FloorPlanDiagram } from "@/components/plans/FloorPlanDiagram";

/**
 * "02 — Floor Plans" — the threshold (§5.3).
 *
 * The single highest-value section in the rebuild, and a perfect 1:1 with the
 * reference: four items to four items. It had four plans in a flat
 * `md:grid-cols-4` row of small cards, which wastes the structure entirely —
 * people do not lease a building, they lease a floor plan, and this is the
 * most valuable internal click on the page.
 *
 * Now the four cards are `position: sticky` and stack on top of each other as
 * you scroll, with the buried cards scaling down so the stack reads as depth
 * rather than as a deck of cards.
 *
 * THE LUMINANCE LADDER IS THE WHOLE POINT. Studio → 3 Bedroom runs
 * `espresso → clay → taupe → stone`: the suite gets literally lighter as it
 * gets bigger. That is the reference's altitude gradient — its cards get
 * lighter as you climb — translated to a building. Nobody will consciously
 * notice; everybody will feel that the plans are ordered.
 *
 * Sticky, not pinned. There is exactly one pinned section on this site and it
 * is the amenities walkthrough, which genuinely needs horizontal scroll; the
 * reference has 64 ScrollTriggers and zero pins, because pins are the number
 * one source of "this site fights me".
 */

const SURFACES = [
  "bg-espresso text-grey",
  "bg-clay text-grey",
  "bg-taupe text-bone",
  "bg-stone text-night",
] as const;

/** One margin note for the section, beside the plan it is actually about. */
const NOTES: Record<number, string> = {
  2: "the second bathroom is the one you’ll thank us for",
};

export function PlanPreview() {
  return (
    <section data-trail="your door" className="relative bg-paper section-y">
      <Seam edge="top" color="bone" size="14%" />
      <Seam edge="bottom" color="espresso" size="20%" />

      <div className="container-stax relative z-2">
        <div className="relative overflow-hidden border-t border-ink/15 pt-5 md:pt-6">
          <span
            aria-hidden="true"
            className="ghost-num top-1/2 hidden -translate-y-1/2 text-ink md:right-0 md:block"
          >
            02
          </span>

          <div className="relative z-2">
            <Eyebrow className="text-ink-soft">
              <span className="tnum">02</span> · Floor plans
            </Eyebrow>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mt-8">
              <h2 className="max-w-3xl text-h1 text-balance">
                <span className="text-ink">
                  <SplitWords text="Four layouts." />
                </span>{" "}
                <span className="text-ink-faint">
                  <SplitWords text="Take a room or take the whole thing." />
                </span>
              </h2>
              <Link
                href="/residences"
                className="rounded-full border border-ink/25 px-7 py-3.5 text-[0.8125rem] font-bold tracking-[0.06em] text-ink uppercase transition-colors duration-150 ease-[var(--ease-out-soft)] hover:border-brick hover:text-brick"
              >
                All plans &amp; galleries
              </Link>
            </div>
          </div>
        </div>

        <PlanStack className="mt-12 md:mt-16">
          {FLOOR_PLANS.map((plan, i) => (
            <article
              key={plan.id}
              data-plan-card
              className={`plan-card ${SURFACES[i]}`}
              style={{
                ["--tilt" as string]: i % 2 ? "1deg" : "-1deg",
                ["--depth" as string]: i,
                zIndex: 10 + i,
              }}
            >
              <div className="grid h-full gap-0 lg:grid-cols-[42fr_58fr]">
                {/* ---- Left: the plan itself ---------------------------- */}
                <div className="relative z-2 flex flex-col justify-center p-7 md:p-11 lg:p-14">
                  <p
                    className="hand text-hand-sm text-amber"
                    style={{ ["--hand-tilt" as string]: "-4deg" }}
                  >
                    {plan.bedrooms === 0
                      ? "take a room"
                      : plan.bedrooms === 3
                        ? "take the whole thing"
                        : `take ${plan.bedrooms === 1 ? "a" : "two"} bedroom${plan.bedrooms === 1 ? "" : "s"}`}
                  </p>

                  <h3 className="mt-3 text-h1">{plan.name}</h3>

                  <p className="mt-5 text-lead tnum opacity-75">
                    {sqftRange(plan)} sq ft
                    <br />
                    {plan.bathrooms} bath · {plan.bedsPerUnit}{" "}
                    {plan.bedsPerUnit === 1 ? "bed" : "beds"}
                  </p>

                  <hr className="my-7 border-0 border-t border-current opacity-20" />

                  <p className="text-eyebrow uppercase opacity-70">
                    {plan.startingRent
                      ? `From $${plan.startingRent.toLocaleString()}/mo`
                      : "Pricing Spring 2027"}
                  </p>

                  <Link
                    href={`/residences#${plan.slug}`}
                    className="group mt-6 inline-flex w-fit items-center gap-3 rounded-full border border-current/35 px-7 py-3.5 text-[0.8125rem] font-bold tracking-[0.06em] uppercase transition-colors duration-150 ease-[var(--ease-out-soft)] hover:border-amber hover:text-amber"
                  >
                    See this plan
                    <svg
                      viewBox="0 0 26 10"
                      aria-hidden="true"
                      className="h-2.5 w-6 shrink-0 fill-none stroke-current transition-transform duration-300 group-hover:translate-x-1.5"
                      strokeWidth={2}
                    >
                      <path d="M0 5 H23 M19 1.5 L23 5 L19 8.5" />
                    </svg>
                  </Link>

                  {NOTES[i] && (
                    <p
                      className="hand mt-8 max-w-[22ch] text-hand-sm text-amber lg:absolute lg:-bottom-2 lg:left-14 lg:mt-0"
                      style={{ ["--hand-tilt" as string]: "-8deg" }}
                    >
                      {NOTES[i]}
                    </p>
                  )}
                </div>

                {/* ---- Right: the render ------------------------------- */}
                <div className="relative min-h-52 overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="ghost-num -top-[14%] -left-6 z-1 text-current opacity-10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Render
                    media={plan.heroMedia}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="absolute inset-0 block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />

                  {/* The plate itself, as a corner overlay — the plan is what
                      is being chosen, so it should never be a hover away.
                      Kept on paper rather than inverted onto the render: a
                      floor plan is a drawing on a sheet, and the diagram's
                      wall breaks are drawn by erasing to the sheet colour. */}
                  <div className="pointer-events-none absolute right-4 bottom-4 hidden w-32 rounded-sm bg-bone/92 p-2.5 shadow-card backdrop-blur-[2px] md:block lg:w-40 lg:p-3.5">
                    <FloorPlanDiagram slug={plan.slug} className="w-full" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </PlanStack>
      </div>
    </section>
  );
}
