import { Eyebrow } from "@/components/ui";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { Render } from "@/components/ui/Render";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * Last chance before the footer (§3.1 §10). Dark, full-width, one job.
 *
 * The capture component appears in three places on every journey — hero CTA,
 * an inline block mid-page, and this one. "Email collection page" was never a
 * page (§0.1).
 */
export function CaptureBlock({
  heading = "Get the floor plans before anyone else.",
  body = "Register and you'll receive plans, pricing and lease dates for September 2027 as each is released — ahead of the public listing.",
  eyebrow = "Register your interest",
  ctaLabel,
  floorPlanId,
}: {
  heading?: string;
  body?: string;
  eyebrow?: string;
  ctaLabel?: string;
  floorPlanId?: string;
}) {
  return (
    <section id="register" className="relative bg-charcoal text-grey overflow-hidden">
      <Render
        media={media("exterior-street")}
        sizes="100vw"
        className="absolute inset-0 block"
        imgClassName="w-full h-full object-cover opacity-18"
      />
      <div className="absolute inset-0 bg-charcoal/72" aria-hidden="true" />

      <div className="container-stax relative section-y">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <div>
            <Eyebrow className="text-brick">{eyebrow}</Eyebrow>
            <h2 className="text-h2 mt-6 text-white text-balance max-w-lg">
              {heading}
            </h2>
            <p className="mt-7 text-lead text-grey/65 max-w-md">{body}</p>

            <dl className="mt-9 grid grid-cols-3 gap-6 max-w-sm">
              <Mini value={SITE.facts.units} label="Suites" />
              <Mini value={SITE.facts.beds} label="Beds" />
              <Mini value={SITE.facts.occupancyShort} label="Move-in" />
            </dl>
          </div>

          <div className="lg:pt-3">
            <CaptureForm onDark ctaLabel={ctaLabel} floorPlanId={floorPlanId} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <dd className="text-h3 text-white tnum">
        {typeof value === "number" ? value.toLocaleString() : value}
      </dd>
      <dt className="text-eyebrow uppercase mt-2 text-grey/40">{label}</dt>
    </div>
  );
}
