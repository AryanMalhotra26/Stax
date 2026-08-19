import { CaptureForm } from "@/components/lead/CaptureForm";
import { Render } from "@/components/ui/Render";
import { SplitLetters } from "@/components/motion/SplitWords";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * "Register" — the arrival (§5.9).
 *
 * The reference goes *light* at its summit because its metaphor is a
 * mountaintop at dawn. Stax's metaphor is arriving home, so this goes dark
 * and warm instead: the lamp is on, you are inside, and the biggest type on
 * the site is here rather than in the hero. Same structural move — a decisive
 * luminance flip that says "you have arrived" — in the opposite direction.
 *
 * Two fields, and it stays two fields. The reference's form is four with two
 * required and that restraint is why it converts; phone, name and program all
 * belong on the thank-you page, asked of somebody who has already said yes
 * once.
 */
export function CaptureBlock({
  heading = "Get the plans",
  quiet = "before anyone else.",
  body = "Register and you'll receive plans, pricing and lease dates for September 2027 as each is released — ahead of the public listing.",
  ctaLabel,
  floorPlanId,
}: {
  heading?: string;
  quiet?: string;
  body?: string;
  ctaLabel?: string;
  floorPlanId?: string;
}) {
  return (
    <section
      id="register"
      data-trail="move-in"
      className="relative overflow-hidden bg-night text-grey section-y-lg"
    >
      {/* The evening render, lit windows, held right down so it is the room
          you are standing in rather than a picture of one. */}
      <Render
        media={media("exterior-evening")}
        sizes="100vw"
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover opacity-35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgb(232 163 61 / 0.22), transparent 62%), linear-gradient(to bottom, rgb(23 18 16 / 0.82), rgb(23 18 16 / 0.94))",
        }}
      />

      <div className="container-stax relative z-2">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="hand inline-block text-hand text-amber"
            style={{ ["--hand-tilt" as string]: "-4deg" }}
          >
            one form. fifteen seconds.
          </p>

          {/* The largest type on the site. It belongs here, not in the hero:
              this is the sentence the whole page exists to earn. */}
          <h2
            aria-label={`${heading} ${quiet}`}
            className="mt-7 text-mega text-bone"
          >
            <span className="block">
              <SplitLetters text={heading} />
            </span>
            <span className="block text-stone">
              <SplitLetters text={quiet} startIndex={heading.length} />
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lead text-grey/65">{body}</p>

          <dl className="mx-auto mt-12 flex flex-wrap items-end justify-center gap-x-14 gap-y-8">
            <Stat value={SITE.facts.units} label="Suites" />
            <Stat value={SITE.facts.beds} label="Beds" />
            <Stat value={SITE.facts.occupancyShort} label="Move-in" />
          </dl>
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-lg border border-sand/12 bg-bark/70 p-7 shadow-lift backdrop-blur-md md:mt-20 md:p-10">
          <CaptureForm onDark ctaLabel={ctaLabel} floorPlanId={floorPlanId} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <dd className="font-display text-stat tnum text-amber">
        {typeof value === "number" ? value.toLocaleString() : value}
      </dd>
      <dt className="mt-3 font-sans text-eyebrow text-grey/45 uppercase">
        {label}
      </dt>
    </div>
  );
}
