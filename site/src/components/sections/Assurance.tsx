import Link from "next/link";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { ArtArrow, ArtDoorKey, ArtKey, ArtWifi } from "@/components/ui/LineArt";
import { Render } from "@/components/ui/Render";
import { ABOUT_TEAM } from "@/content/about";
import { headshotBySlug, media } from "@/content/generated/media";
import { asset } from "@/lib/asset";
import { SITE } from "@/lib/site";

/**
 * "05 — What you can hold us to" (§5.7).
 *
 * Occupies the social-proof slot — but not with testimonials. Nobody has
 * lived here yet. Resident quotes for an unbuilt building would be
 * fabricated, and a leasing site is exactly the wrong place for that. The
 * honest substitute is commitments a prospect can hold us to, plus the
 * developer's real track record, which is the strongest trust asset that
 * exists pre-construction.
 *
 * The Sphere block borrows the reference's best human device directly:
 * circular portrait cutouts with hand-written names beside them and a small
 * drawn arrow pointing at one. Two headshots is the difference between a
 * legal disclaimer and a moment where somebody is accountable for the thing
 * you are about to sign.
 */

const COMMITMENTS = [
  {
    title: "The shuttle is included",
    body: "Round-trip to Brock, in the rent. Not a discounted pass, not a partner service you pay separately — included.",
    Art: ArtWifi,
    tilt: "-1deg",
  },
  {
    title: "Furnished means furnished",
    body: "Bed, desk, seating and dining are in the suite on day one, along with a full-size kitchen. You are not buying a couch in August.",
    Art: ArtKey,
    tilt: "0.8deg",
  },
  {
    title: "Pricing when it's real",
    body: "We publish rents in Spring 2027, when they are set. You will not find a number on this site today that changes before you can sign.",
    Art: ArtDoorKey,
    tilt: "-0.6deg",
  },
] as const;

/** The two principals with supplied headshots. Real photos or none (§3.3). */
const FACES = ABOUT_TEAM.filter((m) => m.photo).slice(0, 2);

export function Assurance() {
  return (
    <section
      data-trail="in writing"
      className="relative overflow-hidden bg-linen section-y"
    >
      <Seam edge="top" color="night" size="14%" />
      <Seam edge="bottom" color="paper" size="16%" />

      <div className="container-stax relative z-2">
        <SectionHead
          index="05"
          eyebrow="What you can hold us to"
          heading="Three commitments,"
          quiet="in writing, before you give us anything."
        />

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {COMMITMENTS.map(({ title, body, Art, tilt }, i) => (
            <Reveal key={title} delay={i * 0.08} as="article">
              <div
                className="card block-pad h-full bg-bone"
                style={{ ["--tilt" as string]: tilt }}
              >
                <Art className="pointer-events-none absolute -right-8 -bottom-10 h-[55%] w-auto text-ink opacity-7" />

                {/* Sits inside the card, not bled off it.
                
                    The ghost numerals at section level are cropped on
                    purpose — that is what makes them read as texture. At card
                    level the same move just looks broken: the card clips its
                    own overflow, so a numeral hung off the corner loses its
                    top half and reads as a rendering fault rather than a
                    device. Small type earns its crop only when there is
                    enough of it left to name. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-0 font-display text-[5.5rem] leading-[0.9] text-amber/40 select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative z-2 pt-20">
                  <h3 className="text-h3">{title}</h3>
                  <p className="mt-3.5 leading-relaxed text-ink-soft">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ---- The developer ------------------------------------------- */}
        <Reveal delay={0.1}>
          <div className="relative mt-16 overflow-hidden rounded-md bg-sand/35 md:mt-24">
            {/* A completed Sphere project behind the whole block at low
                contrast — evidence, not decoration. */}
            <Render
              media={media("exterior-garden")}
              sizes="(max-width: 1439px) 100vw, 1312px"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover opacity-25"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linen/55"
            />

            <div className="relative z-2 flex flex-col gap-10 p-8 md:flex-row md:items-center md:justify-between md:gap-14 md:p-14">
              <div className="max-w-2xl">
                <p className="text-lead text-ink-soft text-balance">
                  Stax is built by{" "}
                  <span className="font-medium text-ink">
                    {SITE.developer.name}
                  </span>
                  , whose leadership team has decades of combined experience
                  across purpose-built rental communities, stacked townhomes and
                  high-rise towers.
                </p>

                <Link
                  href="/about"
                  className="group mt-6 inline-flex items-center gap-2 font-medium text-ink underline-offset-4 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick"
                >
                  Meet the team
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>

              <div className="relative flex shrink-0 items-center gap-6">
                {FACES.map((member, i) => {
                  const shot = member.photo
                    ? headshotBySlug[member.photo]
                    : undefined;
                  if (!shot) return null;
                  return (
                    <figure key={member.name} className="relative">
                      <div
                        className="h-28 w-28 overflow-hidden rounded-full border border-bone/60 shadow-card md:h-36 md:w-36"
                        style={{
                          transform: `rotate(${i % 2 ? 2 : -2}deg)`,
                        }}
                      >
                        <picture>
                          <source
                            type="image/avif"
                            srcSet={`${asset(shot.variants.avif["400"])} 400w, ${asset(shot.variants.avif["800"])} 800w`}
                            sizes="144px"
                          />
                          <img
                            src={asset(shot.variants.webp["400"])}
                            alt={`${member.name}, ${member.role}`}
                            width={400}
                            height={500}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            style={{
                              backgroundImage: `url(${shot.placeholder})`,
                              backgroundSize: "cover",
                            }}
                          />
                        </picture>
                      </div>
                      <figcaption
                        className="hand mt-2 text-center text-hand-sm text-brick"
                        style={{
                          ["--hand-tilt" as string]: i % 2 ? "3deg" : "-4deg",
                        }}
                      >
                        {member.name.split(" ")[0]}
                      </figcaption>
                    </figure>
                  );
                })}

                <ArtArrow
                  className="absolute -top-8 -left-10 hidden h-10 w-14 rotate-12 text-brick/45 lg:block"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
