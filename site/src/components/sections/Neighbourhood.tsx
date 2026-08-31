import { SectionHead } from "@/components/ui";
import { Render } from "@/components/ui/Render";
import { media } from "@/content/generated/media";
import { Reveal } from "@/components/motion/Reveal";
import {
  FOOD_NEARBY,
  LANDMARKS,
  NEIGHBOURHOOD_COPY,
} from "@/content/neighbourhood";
import { sectionIndex } from "@/content/sections";

/**
 * "03 — The Neighbourhood" (§5.5).
 *
 * The reference has no equivalent to this section — it is Stax's own, and it
 * is the best original idea on the site. So it gets a light touch: surfaces,
 * type voice and one motion, and nothing restructured.
 *
 * Deliberately not an embedded Google Maps iframe: those are ~800KB, set
 * third-party cookies (which would drag a consent banner onto the site and
 * with it a conversion tax), and block the main thread on mobile. A schematic
 * plate carries the same information — relative position and walk time — at
 * about 3KB and zero third parties.
 *
 * What changes is that the plate now reads as *drawn* rather than generated:
 * the grid recedes to a whisper, every destination becomes a lit point, the
 * shuttle route draws itself as the section arrives, and the two labels that
 * are asides rather than data move to the hand.
 */
export function Neighbourhood() {

  return (
    <section
      className="relative overflow-clip bg-espresso text-grey pt-tight pb-normal"
    >
      {/* Neither end needs one. Above is the walkthrough, also espresso —
          bleeding espresso into espresso paints nothing. Below is an image
          band that already ends in night. */}

      <div className="container-stax relative z-2">
        <SectionHead
          index={sectionIndex("neighbourhood")}
          eyebrow="The neighbourhood"
          heading={NEIGHBOURHOOD_COPY.heading}
          tone="dark"
        />

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="max-w-lg text-lead text-grey/75">
              {NEIGHBOURHOOD_COPY.body}
            </p>

            <ul className="mt-8 border-t border-sand/12">
              {LANDMARKS.map((landmark) => (
                <li
                  key={landmark.name}
                  className="group flex items-baseline justify-between gap-4 border-b border-sand/12 px-3 py-2.5 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:bg-brick/10"
                >
                  <span
                    className={
                      landmark.featured
                        ? "font-medium text-bone"
                        : "text-grey/75"
                    }
                  >
                    {landmark.name}
                  </span>
                  <span className="shrink-0 text-sm tnum whitespace-nowrap text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] group-hover:text-brick-light">
                    {landmark.time}{" "}
                    {landmark.mode === "shuttle"
                      ? "shuttle"
                      : landmark.mode === "walk"
                        ? "walk"
                        : "drive"}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-grey/75">
              Plus {FOOD_NEARBY.slice(0, -1).join(", ")} and {FOOD_NEARBY.at(-1)},
              along with local restaurants and bars.
            </p>
            <p className="mt-3 text-xs text-grey/75">
              Times are approximate and provided for guidance only.
            </p>

            {/* The section's one annotation — and the only line on the page
                that admits what the neighbourhood is actually for. */}
            <p
              className="hand mt-9 max-w-[24ch] text-hand text-brick"
              style={{ ["--hand-tilt" as string]: "-7deg" }}
            >
              you will use the Starbucks more than the library
            </p>

          </Reveal>

          {/* A photograph, where a schematic used to be.

              The schematic was a grey grid with a rounded red chip labelled
              STAX and four dots on it, and it was the weakest thing on the
              page: hard rectangle, even grid lines, a UI component standing
              in for a place. It read as a wireframe placeholder rather than
              as a map, in the one section whose whole argument is what the
              surroundings are like — and it contained no evidence the
              neighbourhood exists at all.

              This is Welland Avenue from the air, June 2024: the plazas, the
              strip, the streets behind it. The walk times live in the table
              beside it, which is where the actual data always was. A drawn
              map showed where things are; the photograph shows what it is
              like, and that is the thing a student is deciding on. */}
          <Reveal delay={0.1}>
            <figure>
              <div className="overflow-clip rounded-md">
                <Render
                  media={media("neighbourhood-aerial")}
                  sizes="(max-width: 1023px) 100vw, 52vw"
                  className="sd-drift block w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 font-sans text-xs tracking-wide text-grey/75 uppercase">
                Welland Avenue, looking east
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
