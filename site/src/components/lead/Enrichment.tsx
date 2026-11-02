"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Label, PillGroup } from "@/components/ui";
import { BEDROOM_OPTIONS, BUDGET_OPTIONS, RENTER_TYPE_OPTIONS } from "@/lib/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Progressive enrichment (§7.2).
 *
 * Every answer PATCHes the lead row on click. There is deliberately no submit
 * button gating this — partial answers still enrich the record, which is the
 * entire point. Someone who answers "3 bedrooms" and leaves is worth more
 * than someone who abandoned a six-field form.
 */

export function Enrichment() {
  const reduce = useReducedMotion();
  // Read from the URL rather than a server prop so /thank-you stays
  // prerenderable — a server-side searchParams read forces it dynamic.
  const leadId = useSearchParams().get("id");

  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [renterType, setRenterType] = useState<string | null>(null);

  /* The name/phone hold form is gone from this page. Both fields are
     required on the registration form now, so by the time anybody reaches
     the thank-you page we already have them — and a second ask for data we
     hold reads as the first form having failed. The three questions above
     are the only things still worth collecting here, and they patch on
     click, which is the whole point of progressive enrichment.

     `patch` stays exactly as it was: those three still use it. */

  async function patch(fields: Record<string, string>) {
    if (!leadId) return;
    try {
      await fetch("/api/lead", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: leadId, ...fields }),
      });
    } catch {
      // Enrichment is best-effort by design. A failed PATCH must never
      // block the visitor or surface an error — the lead is already saved.
    }
  }

  const block = "border-t border-line pt-8";

  return (
    <div className="space-y-8">
      <div className={block}>
        <Label>How many bedrooms?</Label>
        <PillGroup
          name="Bedrooms"
          options={BEDROOM_OPTIONS}
          value={bedrooms}
          onChange={(v) => {
            setBedrooms(v);
            void patch({ bedrooms: v });
          }}
          columns={4}
        />
      </div>

      <div className={block}>
        <Label>Monthly budget, per person</Label>
        <PillGroup
          name="Budget"
          options={BUDGET_OPTIONS}
          value={budget}
          onChange={(v) => {
            setBudget(v);
            void patch({ budget: v });
          }}
          columns={4}
        />
      </div>

      <div className={block}>
        <Label>And who&rsquo;s asking?</Label>
        <PillGroup
          name="Renter type"
          options={RENTER_TYPE_OPTIONS}
          value={renterType}
          onChange={(v) => {
            setRenterType(v);
            void patch({ renterType: v });
          }}
          columns={3}
        />
      </div>

      <div className={`${block} bg-paper -mx-5 px-5 py-8 md:-mx-8 md:px-8`}>
        <div className={`flex items-start gap-3 ${reduce ? "" : "animate-rise"}`}>
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-brick"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 fill-none stroke-white"
              strokeWidth={2.5}
            >
              <path d="M4 10.5 L8 14.5 L16 6" strokeLinecap="square" />
            </svg>
          </span>
          <div>
            <p className="text-h3">You&rsquo;re first in line.</p>
            <p className="mt-1.5 max-w-md text-ink-soft">
              Someone from leasing will be in touch. Suites are released to
              this list before they go public.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
