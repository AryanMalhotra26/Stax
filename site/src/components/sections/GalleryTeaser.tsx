import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { Seam } from "@/components/ui/Edge";
import { MagneticLabel } from "@/components/motion/MagneticLabel";
import { media } from "@/content/generated/media";

/**
 * "04 — Gallery" — settled (§5.6).
 *
 * The arrival moment of the page: the whole community at dusk with the
 * windows lit. Everything before this has been moving inward and warmer, and
 * this is where it lands.
 *
 * It was a seven-tile mosaic on white — a contact sheet. The renders are the
 * strongest emotional asset the project has and a mosaic is the one layout
 * that guarantees none of them lands: seven images at thumbnail size compete
 * with each other and win nothing. One render at full width, with the rest
 * demoted to a thumbnail rail beneath it, is the same information and a
 * completely different experience.
 */

const THUMBS = [
  "living-upgrade-island",
  "bedroom",
  "kitchen-standard",
  "bathroom",
  "exterior-garden",
] as const;

export function GalleryTeaser() {
  return (
    <section
      className="relative overflow-clip bg-night text-grey section-y"
    >
      <Seam edge="top" color="espresso" size="16%" />
      <Seam edge="bottom" color="linen" size="18%" />

      <div className="container-stax relative z-2">
        <div className="relative border-t border-sand/15 pt-5 md:pt-6">
          <div className="relative z-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <Eyebrow className="text-grey/75">
                <span className="tnum">04</span> · Gallery
              </Eyebrow>
              <h2 className="mt-6 text-h1 md:mt-8">
                <span className="text-bone">
                  <SplitWords text="What it looks like" />
                </span>{" "}
                <span className="text-stone">
                  <SplitWords text="when the lights come on." />
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* ---- The arrival render -------------------------------------- */}
        <Reveal delay={0.06} className="relative mt-10 md:mt-12">
          <MagneticLabel label="View gallery">
            <Link
              href="/residences#gallery"
              className="sd-mask group relative block aspect-4/3 overflow-clip rounded-md bg-bark md:aspect-21/9"
            >
              <Render
                media={media("exterior-evening")}
                sizes="(max-width: 1439px) 100vw, 1312px"
                className="sd-zoom absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />

              {/* Enough scrim for the annotation to read, and no more — the
                  lit windows are the point of this image. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgb(23 18 16 / 0.6), transparent 45%)",
                }}
              />

              <p
                className="hand absolute bottom-5 left-6 text-hand text-amber md:bottom-8 md:left-10"
                style={{ ["--hand-tilt" as string]: "-5deg" }}
              >
                september, about 7pm
              </p>
            </Link>
          </MagneticLabel>

          {/* The second and last sun-circle on the site. Tilted the other way
              from the hero's so the pair reads as a rhyme rather than a
              repeat, and it un-tilts toward upright on hover like everything
              else that is rotated. */}
          <Link
            href="/residences#gallery"
            className="sun-circle absolute -top-10 right-4 z-10 hidden lg:grid"
            style={{ ["--sun-tilt" as string]: "11deg" }}
          >
            View gallery
          </Link>
        </Reveal>

        {/* ---- The rest ------------------------------------------------ */}
        <Reveal delay={0.12}>
          <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-5 md:gap-4">
            {THUMBS.map((slug) => (
              <Link
                key={slug}
                href="/residences#gallery"
                className="group relative aspect-4/3 overflow-clip rounded-sm bg-bark"
              >
                <Render
                  media={media(slug)}
                  sizes="(max-width: 767px) 50vw, 18vw"
                  className="block h-full w-full opacity-55 transition-opacity duration-600 group-hover:opacity-100"
                  imgClassName="h-full w-full object-cover transition-transform duration-600 group-hover:scale-104"
                />
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 text-[0.9375rem] text-grey/75">
            <Link
              href="/residences#gallery"
              className="group -my-3 inline-flex items-center gap-2 rounded-xs py-3 font-medium text-grey transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
            >
              See all 10 renders
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
