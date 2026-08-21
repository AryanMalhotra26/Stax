"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Render } from "@/components/ui/Render";
import { Button } from "@/components/ui";
import { FloorPlanDiagram } from "@/components/plans/FloorPlanDiagram";
import { FLOOR_PLANS, sqftRange, type FloorPlan } from "@/content/floorPlans";

/**
 * Plan selector + cards (§3.2 §2–3).
 *
 * Filtering is client-side and instant — no route change, no refetch. A
 * filter that costs a navigation is a filter people use once.
 */

const FILTERS = [
  { value: "all", label: "All" },
  { value: "studio", label: "Studio" },
  { value: "one-bed", label: "1 Bed" },
  { value: "two-bed", label: "2 Bed" },
  { value: "three-bed", label: "3 Bed" },
] as const;

export function PlanSelector({
  onRequestPlan,
}: {
  onRequestPlan?: (planId: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const reduce = useReducedMotion();

  const visible =
    filter === "all"
      ? FLOOR_PLANS
      : FLOOR_PLANS.filter((p) => p.slug === filter);

  return (
    <div>
      {/* Sticky so the filter stays reachable while reading long cards */}
      <div className="sticky top-18 md:top-20 z-30 bg-bone/92 backdrop-blur-md -mx-5 px-5 md:-mx-10 md:px-10 py-4 border-b border-line">
        <div
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter floor plans"
        >
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={`shrink-0 min-h-11 rounded-full border px-5 text-[0.9375rem] font-medium transition-colors duration-150 ease-[var(--ease-out-soft)] ${
                  active
                    ? "border-ink bg-ink text-bone"
                    : "border-ink/20 bg-transparent text-ink hover:border-brick hover:text-brick"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-16 space-y-24 md:space-y-32">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((plan, i) => (
            <motion.article
              key={plan.id}
              id={plan.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="scroll-mt-40"
            >
              <PlanCard plan={plan} flip={i % 2 === 1} onRequest={onRequestPlan} />
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mt-16 text-lead text-ink-soft">
          Nothing matches that filter yet.
        </p>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  flip,
  onRequest,
}: {
  plan: FloorPlan;
  flip: boolean;
  onRequest?: (planId: string) => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Render */}
      <div className={flip ? "lg:order-2" : ""}>
        <div className="relative aspect-4/3 overflow-clip rounded-md bg-grey">
          <Render
            media={plan.heroMedia}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="block w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        </div>

        {/* The plan diagram — SVG, so it stays sharp at any zoom and costs
            ~4KB rather than ~400KB (§3.2). */}
        <figure className="mt-4 rounded-md border border-line bg-paper p-6 md:p-8">
          <FloorPlanDiagram slug={plan.slug} />
          <figcaption className="mt-4 text-xs text-ink-faint leading-relaxed">
            Illustrative layout. Dimensioned plans are released with pricing in
            Spring 2027.
          </figcaption>
        </figure>
      </div>

      {/* Detail */}
      <div className={flip ? "lg:order-1 lg:pt-4" : "lg:pt-4"}>
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 className="text-h2">{plan.name}</h2>
          <p className="text-sm font-semibold text-brick whitespace-nowrap">
            {plan.startingRent
              ? `From $${plan.startingRent.toLocaleString()}/mo`
              : "Pricing Spring 2027"}
          </p>
        </div>

        <dl className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-y-7 gap-x-4">
          <Spec label="Size" value={`${sqftRange(plan)} sq ft`} />
          <Spec label="Bathrooms" value={String(plan.bathrooms)} />
          <Spec label="Sleeps" value={String(plan.bedsPerUnit)} />
          <Spec label="Ceilings" value={`${plan.ceilingFt} ft`} />
        </dl>

        <p className="mt-8 text-lead text-ink-soft max-w-lg">{plan.description}</p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-ink-soft">
              <span
                className="shrink-0 w-1.5 h-1.5 bg-brick mt-2.5"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            onClick={() => onRequest?.(plan.id)}
            aria-label={`Request the ${plan.name} plan`}
          >
            Request this plan
          </Button>
          <p className="text-sm text-ink-faint">
            {plan.exposure} · Available {plan.availableFrom.slice(0, 7).replace("-", "/")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="text-h3 tnum">{value}</dd>
      <dt className="text-eyebrow uppercase mt-2 text-ink-faint">{label}</dt>
    </div>
  );
}
