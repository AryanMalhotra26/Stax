import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SectionHead, ButtonLink } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { FloorPlanDiagram } from "@/components/plans/FloorPlanDiagram";
import { FLOOR_PLANS, sqftRange } from "@/content/floorPlans";

/**
 * Highest-value internal click on the page (§3.1 §4) — people do not lease a
 * building, they lease a floor plan.
 *
 * Card hover is CSS only: scale on the image, 2px lift on the card (motion
 * inventory #5). Affordance, nothing more.
 */
/**
 * to-top.ch alternates the background of its four numbered service blocks
 * (`.service-content-container` plus `.yellow` / `.mint-green` /
 * `.light-mint-green`) so four identical rows stop reading as a table. Same
 * rhythm here, stepped along the neutral ramp — the brick accent stays the
 * only saturated thing on the page.
 */
const TONES = ["tonal-a", "tonal-b", "tonal-c", "tonal-d"] as const;

export function PlanPreview() {
  return (
    <section className="bg-paper">
      <div className="container-stax section-y">
        <SectionHead
          index="02"
          eyebrow="Floor plans"
          heading="Four layouts. Take a room or take the whole thing."
          action={
            <ButtonLink href="/residences" variant="secondary">
              All plans &amp; galleries
            </ButtonLink>
          }
        />

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {FLOOR_PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.06} as="article">
              <Link
                href={`/residences#${plan.slug}`}
                className="group block transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
              >
                <div className="sd-mask relative aspect-4/3 overflow-hidden bg-grey">
                  <Render
                    media={plan.heroMedia}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 23vw"
                    className="block w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-103"
                  />
                  {/* Plate overlays on hover — the plan is the thing being
                      chosen, so it should be one gesture away. */}
                  <div className="absolute inset-0 bg-bone/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-5">
                    <FloorPlanDiagram slug={plan.slug} className="w-full" />
                  </div>
                </div>

                <div className={`${TONES[i % TONES.length]} p-5 md:p-6`}>
                  <div className="mb-4 flex items-center gap-3 border-b border-ink/12 pb-3">
                    <span className="text-eyebrow tnum text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="h-1.5 w-1.5 shrink-0 bg-brick"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-h3">{plan.name}</h3>
                    <span className="text-sm text-ink-faint tnum whitespace-nowrap">
                      {sqftRange(plan)} sq ft
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-ink-soft tnum">
                    {plan.bathrooms} bath · {plan.bedsPerUnit}{" "}
                    {plan.bedsPerUnit === 1 ? "bed" : "beds"}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-brick">
                    {plan.startingRent
                      ? `From $${plan.startingRent.toLocaleString()}/mo`
                      : "Pricing Spring 2027"}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
