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

/**
 * The four below the lead, and the lead itself, are the four interiors on
 * page 3 of the A5 flyer plus the dusk exterior.
 *
 * That is the whole of the client's "not consistent with the interior
 * renderings we are using in other creatives" note. The teaser was showing
 * `living-upgrade-island` and `exterior-garden`, neither of which appears in
 * any printed piece, and leading on an exterior. Both are gone; what is left
 * is the set a prospect has already seen.
 *
 * Two columns, not five. At `md:grid-cols-5` these were 18vw tiles held at
 * 55% opacity — "the interior images are too small", and they were also
 * deliberately dimmed, which is a strange thing to do to the images the
 * client says people buy on.
 */
const THUMBS = [
  "bedroom",
  "kitchen-standard",
  "bathroom",
  "exterior-evening",
] as const;

export function GalleryTeaser() {
  return (
    <section
      id="gallery"
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
                {/* "when the lights come on" was written for a dusk
                    exterior lead and the lead is now a daylight interior, so
                    it described a picture that is no longer the first one.
                    The furniture is the better half of the sentence anyway —
                    it is the thing in every one of these renders and the
                    thing the suite is actually sold on. */}
                <span className="text-stone">
                  <SplitWords text="with the furniture already in." />
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
            <Frame className="sd-mask group relative block aspect-4/3 overflow-clip rounded-md bg-bark md:aspect-16/9">
              {/* THE LEAD IS AN INTERIOR NOW, at the client's direction:
                  "people will be buying into the interior renderings more
                  than the exterior renderings". This section opened on a dusk
                  exterior at 21:9 and put every interior in a 18vw thumbnail
                  underneath it, which is the ranking inverted.

                  The dusk exterior has not been dropped — it is the last of
                  the four below, where an establishing shot belongs once the
                  rooms have been seen. */}
              <Render
                media={media("living-upgrade-dining")}
                sizes="(max-width: 1439px) 100vw, 1312px"
                className="sd-zoom absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
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
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5">
            {THUMBS.map((slug) => (
              <Frame
                key={slug}
                className="group relative aspect-4/3 overflow-clip rounded-md bg-bark"
              >
                <Render
                  media={media(slug)}
                  sizes="(max-width: 639px) 100vw, 46vw"
                  className="block h-full w-full"
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
              {/* "The rest of the gallery goes to the list" was internal
                  shorthand — the remaining renders are released to the
                  registration list — and the client's note was simply that
                  it does not parse. It is a link to /register, so it now says
                  what clicking it does. */}
              {FEATURES.floorPlans
                ? "See all 10 renders"
                : "Register to see the full gallery"}
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
