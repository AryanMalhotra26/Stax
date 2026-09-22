import Link from "next/link";
import type { ReactNode } from "react";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitWords";
import { MagneticLabel } from "@/components/motion/MagneticLabel";
import { FEATURES } from "@/config/features";
import { media } from "@/content/generated/media";
import { sectionIndex } from "@/content/sections";

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
 *
 * WHILE THE PLANS ARE HIDDEN, NOTHING HERE IS A LINK.
 *
 * Every image in this section pointed at /residences#gallery, and that route
 * redirects while `FEATURES.floorPlans` is off — six clickable renders, all
 * of them dead ends, on the one section of the page whose entire job is to
 * make the building feel real. So the frames become plain figures and the
 * one destination left is the register form.
 *
 * The copy under the rail changes with them, because "See all 10 renders"
 * would be a promise the page cannot keep. What replaces it is the truth and
 * it happens to be the strongest version of the pitch: the rest of the
 * gallery goes to the list. Pass 6 §6.5 — hiding the plans strengthens
 * "get them before anyone else", it does not weaken it.
 */

/**
 * The magnetic cursor follower, but only over a live link. Falls back to a
 * plain positioned box so the sun-circle above it still has something to be
 * absolutely positioned against.
 */
function Wrap({ children }: { children: ReactNode }) {
  return FEATURES.floorPlans ? (
    <MagneticLabel label="View gallery">{children}</MagneticLabel>
  ) : (
    <div className="relative">{children}</div>
  );
}

/**
 * A render frame. A link to the gallery when there is a gallery to link to,
 * and otherwise the same box with no anchor on it.
 *
 * Written as one wrapper rather than as a ternary at each of the six call
 * sites so the hover treatment, the radius and the mask cannot drift apart
 * between the two states — and so turning the flag back on is one boolean
 * rather than six edits.
 */
function Frame({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return FEATURES.floorPlans ? (
    <Link href="/residences#gallery" className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

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
      className="relative overflow-clip bg-night text-grey pt-tight pb-tight"
    >
      {/* No strips. The band above already dissolves bone into night,
          and the linen strip that used to sit at the bottom of this section
          was the worst seam on the site: it finished a near-black section in
          cream, directly above a light section that opened in near-black.
          Commitments now owns that boundary from its own top edge. */}

      <div className="container-stax relative z-2">
        <div className="relative border-t border-sand/15 pt-5 md:pt-6">
          <div className="relative z-2 flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
            <div>
              <Eyebrow className="text-grey/75">
                <span className="tnum">{sectionIndex("gallery")}</span> · Gallery
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
          {/* The magnetic cursor label only appears where there is something
              to click. Passing it an empty string is not the fix — the
              follower is a filled brick disc and it would still track the
              pointer across the render, saying nothing. An affordance that
              lies is worse than none, so the whole wrapper goes. */}
          <Wrap>
            <Frame className="sd-mask group relative block aspect-4/3 overflow-clip rounded-md bg-bark md:aspect-21/9">
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
                className="hand absolute bottom-5 left-6 text-hand text-brick-light md:bottom-8 md:left-10"
                style={{ ["--hand-tilt" as string]: "-5deg" }}
              >
                september, about 7pm
              </p>
            </Frame>
          </Wrap>

          {/* The second and last sun-circle on the site. Tilted the other way
              from the hero's so the pair reads as a rhyme rather than a
              repeat, and it un-tilts toward upright on hover like everything
              else that is rotated.

              It goes with the gallery rather than being re-pointed at
              /register. There is already a Register sun-circle on this page,
              in the hero, and two of the same lamp saying the same thing is
              how a device stops being one. The page keeps its rhyme when the
              plans come back. */}
          {FEATURES.floorPlans && (
            <Link
              href="/residences#gallery"
              className="sun-circle absolute -top-10 right-4 z-10 hidden lg:grid"
              style={{ ["--sun-tilt" as string]: "11deg" }}
            >
              View gallery
            </Link>
          )}
        </Reveal>

        {/* ---- The rest ------------------------------------------------ */}
        <Reveal delay={0.12}>
          <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-5 md:gap-4">
            {THUMBS.map((slug) => (
              <Frame
                key={slug}
                className="group relative aspect-4/3 overflow-clip rounded-sm bg-bark"
              >
                <Render
                  media={media(slug)}
                  sizes="(max-width: 767px) 50vw, 18vw"
                  className="block h-full w-full opacity-55 transition-opacity duration-600 group-hover:opacity-100"
                  imgClassName="h-full w-full object-cover transition-transform duration-600 group-hover:scale-104"
                />
              </Frame>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 text-[0.9375rem] text-grey/75">
            <Link
              href={FEATURES.floorPlans ? "/residences#gallery" : "/register"}
              className="group -my-3 inline-flex items-center gap-2 rounded-xs py-3 font-medium text-grey transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light"
            >
              {FEATURES.floorPlans
                ? "See all 10 renders"
                : "The rest of the gallery goes to the list"}
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
