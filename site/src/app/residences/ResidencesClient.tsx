"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Eyebrow, buttonClass } from "@/components/ui";
import { PlanSelector } from "@/components/plans/PlanSelector";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { planBySlug, FLOOR_PLANS } from "@/content/floorPlans";

/** Flip is only needed once the visitor reaches the gallery. */
const Gallery = dynamic(() =>
  import("@/components/motion/Gallery").then((m) => m.Gallery),
);

/**
 * Client shell for /residences. Holds the one piece of cross-section state:
 * which plan the inline capture form is prefilled with, set by "Request this
 * plan" on a card (§3.2 §3).
 */
export function ResidencesClient() {
  const [planId, setPlanId] = useState<string | undefined>();
  const captureRef = useRef<HTMLDivElement>(null);

  const handleRequest = (id: string) => {
    setPlanId(id);
    captureRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const requested = FLOOR_PLANS.find((p) => p.id === planId);

  return (
    <>
      <section className="bg-bone">
        <div className="container-stax pb-8">
          <PlanSelector onRequestPlan={handleRequest} />
        </div>
      </section>

      {/* Inline capture, contextual copy (§3.2 §6) */}
      <section className="bg-paper" ref={captureRef}>
        <div className="container-stax section-y">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-5xl">
            <div>
              <Eyebrow className="text-brick">Floor plan pack</Eyebrow>
              <h2 className="text-h2 mt-6 text-balance">
                {requested
                  ? `Send me the ${requested.name} plan.`
                  : "Send me the full floor plan pack."}
              </h2>
              <p className="mt-6 text-lead text-ink-soft max-w-md">
                {requested
                  ? `We'll email the ${requested.name} layout, and let you know the moment pricing and lease dates are released.`
                  : "Every layout, at full resolution, plus pricing and lease dates the moment they're set."}
              </p>
              {requested && (
                <button
                  onClick={() => setPlanId(undefined)}
                  className="mt-5 text-sm text-ink-faint underline underline-offset-4 hover:text-ink"
                >
                  Send me every plan instead
                </button>
              )}
            </div>
            <CaptureForm
              floorPlanId={planId}
              ctaLabel={requested ? `Get the ${requested.name} plan` : "Get the plan pack"}
            />
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="container-stax section-y">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <Eyebrow className="text-brick">Gallery</Eyebrow>
              <h2 className="text-h2 mt-6 text-balance">Inside and out.</h2>
            </div>
            <p className="text-sm text-ink-faint max-w-xs">
              Renderings are artist&rsquo;s impressions and subject to change.
            </p>
          </div>
          <Gallery />
        </div>
      </section>

      {/* Sticky mobile CTA (§3.2 §7) — persistent below 768px */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bone/95 backdrop-blur-md border-t border-line p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link href="/register" className={buttonClass("primary", "lg", "w-full")}>
          Register your interest
        </Link>
      </div>
      <div className="md:hidden h-20" aria-hidden="true" />
    </>
  );
}

export { planBySlug };
