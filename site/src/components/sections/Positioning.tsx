import { Render } from "@/components/ui/Render";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * The one idea the building is about (§3.1 §3). Split layout, text left.
 *
 * The render sits in an overflow-hidden frame with a scroll-driven mask reveal
 * and a slow parallax drift — both native CSS `animation-timeline`, so they
 * cost no JS and degrade to a static image where unsupported.
 */
export function Positioning() {
  return (
    <section className="bg-bone">
      <div className="container-stax section-y relative">
        <SectionHead
          index="01"
          eyebrow="The idea"
          heading="Close enough to campus. Far enough to feel like your own place."
        />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="max-w-lg space-y-4 text-lead text-ink-soft">
            <p>
              Student housing usually asks you to choose: a room in a house that
              was never meant to be one, or a residence hall where a corridor is
              the first thing you walk into every day.
            </p>
            <p>
              Stax is {SITE.facts.blocks} purpose-built blocks in a
              stacked-townhouse form — private entries, real kitchens, balconies
              — with a complimentary shuttle that removes the reason anyone puts
              up with the alternative.
            </p>

            <dl className="grid grid-cols-3 gap-4 border-t border-ink/15 pt-6 text-base">
              <Fact k="Blocks" v={SITE.facts.blocks} />
              <Fact k="Suites" v={SITE.facts.units} />
              <Fact k="Beds" v={SITE.facts.beds} />
            </dl>
          </Reveal>

          <div className="sd-mask relative aspect-3/2 overflow-hidden bg-grey">
            <Render
              media={media("exterior-garden")}
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="sd-drift absolute inset-0 block h-[108%] w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ k, v }: { k: string; v: number }) {
  return (
    <div>
      <dd className="text-h3 tnum text-ink">{v.toLocaleString()}</dd>
      <dt className="mt-1.5 text-eyebrow uppercase text-ink-faint">{k}</dt>
    </div>
  );
}
