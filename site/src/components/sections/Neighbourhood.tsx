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
      id="neighbourhood"
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

        {/* ---- The map ------------------------------------------------
            THE CLIENT'S OWN ARTWORK, lifted from page 2 of the A5 flyer at
            600dpi, in place of the drone photograph that was here.

            The photograph was defensible and it was still wrong for this
            section. An aerial proves a neighbourhood exists and shows what it
            looks like; it cannot show you that Starbucks is two minutes away
            and the Walmart is nine. This section's entire argument is where
            things are, and the client asked for the map they already print
            for exactly that reason — so a prospect holding the flyer and a
            prospect on the phone are looking at the same picture.

            FULL WIDTH, AND ABOVE THE LIST. It used to sit in the right-hand
            column at roughly half the measure, which is survivable for a
            photograph and not for a map: every label on this one is set at
            about 9pt in the original. It now takes the whole column and the
            copy runs underneath it.

            On a phone it is put in a scroller at a 46rem minimum rather than
            squeezed to 335px, where the pin labels stop being readable at
            all. A map you can push around with a thumb is worth more than a
            map that fits. */}
        <Reveal delay={0.05}>
          <figure className="mt-10 md:mt-14">
            <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-0">
              <div className="min-w-[46rem] overflow-clip rounded-md md:min-w-0">
                <Render
                  media={media("neighbourhood-map")}
                  sizes="(max-width: 767px) 736px, 92vw"
                  className="block w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 font-sans text-xs tracking-wide text-grey/75 uppercase">
              455 Welland Avenue, and what is within a walk of it
            </figcaption>
          </figure>
        </Reveal>

        {/* Copy left, the walk times right.

            With the map lifted out of this row it had one child in a
            two-column grid, so the list ran at half the measure beside an
            empty column. The intro and the annotation are prose and the
            table is data: splitting them along that line fills the row and
            puts the numbers beside the picture they describe. */}
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="max-w-lg text-lead text-grey/75">
              {NEIGHBOURHOOD_COPY.body}
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

          <Reveal delay={0.1}>
            <ul className="border-t border-sand/12">
              {LANDMARKS.map((landmark) => (
                <li
                  key={landmark.name}
                  className="group flex items-baseline justify-between gap-4 border-b border-sand/12 px-3 py-2.5 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:bg-brick/10"
                >
                  {/* Every name in bone, none of them bolder than another.

                      `featured` used to make four of the eight medium-weight
                      bone and leave the rest grey, which the client read —
                      correctly — as an inconsistency rather than as a
                      hierarchy. It was never carrying real meaning: Walmart
                      was featured and Canadian Tire, nine minutes from the
                      same door, was not. A list of places near a building is
                      a list, not a ranking, and the walk time beside each one
                      is the only thing that distinguishes them. */}
                  <span className="text-bone">{landmark.name}</span>
                  <span className="shrink-0 text-sm tnum whitespace-nowrap text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] group-hover:text-brick-light">
                    {landmark.mode === "shuttle" ? (
                      <>private shuttle</>
                    ) : (
                      <>
                        {landmark.time}{" "}
                        {landmark.mode === "walk" ? "walk" : "drive"}
                      </>
                    )}
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
