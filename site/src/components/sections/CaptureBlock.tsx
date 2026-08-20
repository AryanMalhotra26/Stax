import { CaptureForm } from "@/components/lead/CaptureForm";
import { Render } from "@/components/ui/Render";
import { TrailSegment } from "@/components/ui/Trail";
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
  heading = "Get the plans.",
  quiet = "Before anyone else.",
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
      className="relative overflow-clip bg-night text-grey section-y"
    >
      {/* The evening render, lit windows, held right down so it is the room
          you are standing in rather than a picture of one. */}
      <Render
        media={media("exterior-evening")}
        sizes="100vw"
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover opacity-45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgb(232 163 61 / 0.22), transparent 62%), linear-gradient(to bottom, rgb(23 18 16 / 0.74), rgb(23 18 16 / 0.9))",
        }}
      />

      {/* ---- Segment D — the arrival -----------------------------------
          Everything before this has been a route. This is the destination,
          and it is the only segment that ends: in from the top-left
          off-canvas, down, and up to a stop at an X beside the form. The X is
          drawn once on the whole site, here, at the point of conversion.

          Two deliberate departures from the rules that govern A, B and C.

          It does not run off the far edge. The others do, because a route
          should look like it continues past its frame; a *destination* that
          runs off the edge is not a destination.

          And it is lit. Brick is the ink the other three are drawn in — the
          route as something marked on a map — where this one is amber at full
          strength, the site's one light source, spending itself in the one
          place it is worth spending. The X stays in sand: on the night
          surface sand is what ink is, and a mark that glows would be a second
          light source competing with the arrival it is marking.

          It sits at `z-1` — above the render and its gradient, below the
          content at `z-2`. In front of the section's own art is as far
          forward as any segment goes on this site. The old trail was pinned
          at `z-20` above everything and struck through a heading, a plan card
          and the walkthrough, and no amount of emphasis is worth that. */}
      <TrailSegment
        id="d"
        tone="lit"
        className="-top-[12%] -left-[8%] z-1 w-[116%]"
        mobileClassName="top-0 left-0 z-1 w-full"
      />

      <div className="container-stax relative z-2">
        <div className="mx-auto max-w-4xl text-center">
          {/* The largest type on the site. It belongs here, not in the hero:
              this is the sentence the whole page exists to earn. */}
          <h2
            aria-label={`${heading} ${quiet}`}
            className="mx-auto max-w-[22ch] text-hero text-bone"
          >
            <span className="block">
              <SplitLetters text={heading} />
            </span>
            <span className="block text-stone">
              <SplitLetters text={quiet} startIndex={heading.length} />
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl text-lead text-grey/75">{body}</p>

          <dl className="mx-auto mt-10 flex flex-wrap items-end justify-center gap-x-14 gap-y-6">
            <Stat value={SITE.facts.units} label="Suites" />
            <Stat value={SITE.facts.beds} label="Beds" />
            <Stat value={SITE.facts.occupancyShort} label="Move-in" />
          </dl>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-sand/12 bg-bark/70 p-7 shadow-lift backdrop-blur-md md:mt-14 md:p-10">
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
      <dt className="mt-3 font-sans text-eyebrow text-grey/75 uppercase">
        {label}
      </dt>
    </div>
  );
}
