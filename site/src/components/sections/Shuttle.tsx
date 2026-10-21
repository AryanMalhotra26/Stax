import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { Render } from "@/components/ui/Render";
import { ArtBus } from "@/components/ui/LineArt";
import { media } from "@/content/generated/media";
import { sectionIndex } from "@/content/sections";

/**
 * The shuttle, on its own.
 *
 * NO TIMETABLE ANYWHERE IN IT. The site has published two different
 * fifteens — a journey time, then a headway — and been corrected on both. A
 * schedule for a building opening in September 2027 is an intention rather
 * than a fact, and this is the wrong page to learn the difference on. What
 * is claimed instead is true today and needs no operator to confirm it: the
 * service is private, it is direct, and it is included.
 *
 * It had been a line in the walkthrough and a line on a commitment card —
 * true in both places and load-bearing in neither. It is the single thing
 * about this building that no competitor near Brock can answer, so at the
 * client's direction it gets a section, a photograph and a number.
 *
 * THE PHOTOGRAPH IS THE ARGUMENT. Every other image on this site is a render
 * of a building that does not exist yet; this is the one asset that is a
 * photograph of a real object with the brand on the side. Placed large, it
 * does something no amount of copy can: it makes the service look like it
 * already exists, because it does.
 *
 * Light, deliberately. It follows two dark sections — the walkthrough and the
 * neighbourhood — and a third would turn the top third of the page into one
 * undifferentiated dark slab. It is also the only daylight photograph in the
 * sequence, so a light surface is the one that does not fight it.
 */
export function Shuttle() {
  return (
    <section
      id="shuttle"
      className="relative overflow-clip bg-linen pt-seam-lg pb-normal"
    >
      {/* espresso → linen is the site's second-biggest tonal jump, so the
          longest ramp. Same treatment the Commitments section uses for the
          same Δ. */}
      <Seam edge="top" color="espresso" size="lg" />

      <div className="container-stax relative z-2">
        <SectionHead
          index={sectionIndex("shuttle")}
          eyebrow="Getting to campus"
          heading="A private shuttle to Brock."
          quiet="Both directions, included in your rent."
        />

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <figure>
              <div className="sd-mask relative overflow-clip rounded-md bg-sand/40">
                <Render
                  media={media("shuttle")}
                  sizes="(max-width: 1023px) 100vw, 56vw"
                  className="block w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              {/* `ink-soft`, not `ink-faint`. The faint tone measures 4.33:1
                  on linen, and an 11px caption needs 4.5 — it clears the bar
                  on bone, which is where the rest of the site uses it, and
                  misses it here. Soft measures 6.81 on the same surface. */}
              <figcaption className="mt-3 font-sans text-eyebrow text-ink-soft uppercase">
                The Stax shuttle
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative">
              <ArtBus
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 -right-6 hidden h-28 w-auto text-ink opacity-6 lg:block"
              />

              <p className="relative z-2 text-lead text-ink-soft">
                A private service between Stax and Brock, for{" "}
                <span className="font-medium text-ink">residents only</span> —
                not a public route you share with the city, nothing to buy, and
                nothing to tap. It runs in both directions through the academic
                term.
              </p>

              <ul className="relative z-2 mt-8 border-t border-line">
                <Point title="Included in the rent">
                  No fare, no pass to buy, no partner service billed
                  separately.
                </Point>
                <Point title="Both directions">
                  It brings you back as readily as it takes you, so getting
                  home is never the part you have to plan around.
                </Point>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b border-line py-4">
      <p className="font-sans text-[1.0625rem] font-medium text-ink">{title}</p>
      <p className="mt-1.5 leading-relaxed text-ink-soft">{children}</p>
    </li>
  );
}
