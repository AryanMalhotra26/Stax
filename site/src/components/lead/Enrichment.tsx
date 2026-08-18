"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Label, PillGroup } from "@/components/ui";
import { BEDROOM_OPTIONS, BUDGET_OPTIONS, RENTER_TYPE_OPTIONS } from "@/lib/site";
import { track } from "@/lib/attribution";
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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [holdState, setHoldState] = useState<"idle" | "sending" | "done">("idle");

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

  async function handleHold(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() && !phone.trim()) return;
    setHoldState("sending");
    await patch({ name: name.trim(), phone: phone.trim() });
    track("enrich_complete", { leadId, hasPhone: !!phone.trim() });
    setHoldState("done");
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
        {holdState === "done" ? (
          <div
            className={`flex items-start gap-3 ${reduce ? "" : "animate-rise"}`}
          >
            <span
              className="shrink-0 w-9 h-9 bg-brick flex items-center justify-center mt-0.5"
              aria-hidden="true"
            >
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-none stroke-white" strokeWidth={2.5}>
                <path d="M4 10.5 L8 14.5 L16 6" strokeLinecap="square" />
              </svg>
            </span>
            <div>
              <p className="text-h3">You&rsquo;re first in line.</p>
              <p className="text-ink-soft mt-1.5 max-w-md">
                Someone from leasing will be in touch. Suites are released to
                this list before they go public.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleHold} className="space-y-5">
            <div>
              <p className="text-h3">Want first access when suites are released?</p>
              <p className="text-ink-soft mt-1.5 max-w-md">
                Leave a number and the leasing team will reach you before the
                public release.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enrich-name">Name</Label>
                <Input
                  id="enrich-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                />
              </div>
              <div>
                <Label htmlFor="enrich-phone">Phone</Label>
                <Input
                  id="enrich-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(905) 555-0142"
                />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={holdState === "sending"}>
              {holdState === "sending" ? "Saving…" : "Put me first in line"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
