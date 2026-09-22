import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { Render } from "@/components/ui/Render";
import { ArtBus } from "@/components/ui/LineArt";
import { media } from "@/content/generated/media";
import { sectionIndex } from "@/content/sections";
import { SITE } from "@/lib/site";

/**
 * The shuttle, on its own.
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
      className="relative overflow-clip bg-linen pt-tight pb-normal"
    >
      {/* espresso → linen is the site's second-biggest tonal jump, so the
          longest ramp. Same treatment the Commitments section uses for the
          same Δ. */}
      <Seam edge="top" color="espresso" size="lg" />

      <div className="container-stax relative z-2">
        <SectionHead
          index={sectionIndex("shuttle")}
          eyebrow="Getting to campus"
          heading="A shuttle every fifteen minutes."
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
              <figcaption className="mt-3 font-sans text-eyebrow text-ink-faint uppercase">
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
                A private service between Stax and Brock, for residents only —
                not a public route you share with the city, and nothing to buy.
                A vehicle leaves roughly every{" "}
                <span className="font-medium text-ink">
                  {SITE.facts.shuttleEveryMinutes} minutes
                </span>{" "}
                in both directions through the academic term.
              </p>

              <ul className="relative z-2 mt-8 border-t border-line">
                <Point title="Included in the rent">
                  No fare, no pass to buy, no partner service billed
                  separately.
                </Point>
                <Point title="Both directions, all day">
                  It runs back as often as it runs out, so a late lecture is
                  not a walk home.
                </Point>
                {/*
                  The bus pass, added at the client's direction, and phrased as
                  a companion rather than a substitute. It also replaces the
                  old "not a bus pass" line on concern card 02 — that framing
                  dismissed the very thing now being offered, and the page
                  cannot both disparage a transit pass and hand you one.
                */}
                <Point title="A transit pass as well">
                  For the nights the shuttle has finished, and for everywhere
                  in St. Catharines that is not campus.
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
