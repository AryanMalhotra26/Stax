"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layered hero parallax.
 *
 * The device is lifted from to-top.ch, which stacks six mountain plates and
 * drives them from one scrubbed timeline at different `yPercent` values — the
 * near plate tracks the page exactly, the far plates translate *down* as the
 * page scrolls *up* so they lag. That differential is the whole illusion.
 *
 * Stax has one flat render rather than a separated plate stack, so depth is
 * built from the elements that already sit at different z-heights: the render
 * behind, the scrim over it, then the badge, headline, lede and CTA in front.
 * Layers are declared in the markup as `data-px="…"` and read here, so adding
 * a hero element is a markup change, not a code change.
 *
 * Sign convention, matching the reference: positive lags (pushes back),
 * negative leads (pulls forward).
 *
 * Two deliberate improvements on the source. It gates with a one-time
 * `window.innerWidth >= 990` read, so a desktop browser that starts narrow
 * never gets the effect and a resize never re-evaluates; this uses
 * `gsap.matchMedia`, which re-runs on resize and reverts cleanly. And it takes
 * `prefers-reduced-motion` as a media condition, which the source never checks
 * at all.
 *
 * The render is the LCP element, so it carries no *entrance* animation — this
 * only ever moves it in response to scroll, after first paint (§6.2 rule 1).
 */

/**
 * Travel is a fraction of the HERO's height, not of each plate's own height.
 *
 * The reference expresses these as `yPercent`, which is a percentage of the
 * element being moved — fine there, because its mountain plates are thin
 * ridge strips. Applied to plates that fill the viewport it means a "40%"
 * layer travels 40% of a full screen and tears itself off its own container,
 * so the numbers have to be re-expressed against a common reference. The
 * ratios below are the reference's; the units are the hero's.
 *
 * Sign convention: POSITIVE LAGS (pushes back), NEGATIVE LEADS (pulls
 * forward). Everything in the environment lags; everything in the copy leads.
 * That opposition is what creates depth — parallax where all the plates move
 * the same way still reads flat.
 */
const LAYERS: { attr: string; factor: number }[] = [
  // The environment, back to front.
  { attr: "sky", factor: 0 },
  { attr: "sun", factor: 0.04 },
  { attr: "blocks", factor: 0.13 },
  { attr: "near", factor: 0.3 },
  { attr: "scrim", factor: 0.05 },

  // Counter-motion.
  { attr: "badge", factor: -0.17 },
  { attr: "headline", factor: -0.13 },
  { attr: "hand", factor: -0.11 },
  { attr: "lede", factor: -0.09 },
  { attr: "cta", factor: -0.06 },

  // Faster than the nearest plate in the scene, so the one glowing object
  // sinks decisively as you leave.
  { attr: "sun-circle", factor: 0.42 },
];

/**
 * Phones get the same effect at 45% amplitude rather than no effect at all.
 *
 * The reference switches everything off below 990px, which is the wrong call
 * on a student-housing site where most of the traffic is a phone — and it is
 * not a performance argument either, since these are compositor transforms.
 * What does not survive a small screen is the *travel*: 38% of a headline is
 * most of a phone viewport, so the type would leave before it was read.
 * Reducing the amplitude keeps the depth and loses the overshoot.
 *
 * Kept in step with the markup: the render wrapper is oversized to 12% below
 * `md` and 20% at and above it, and each tier's travel is checked against its
 * own overhang so no edge is exposed at either size.
 */
const MOBILE_SCALE = 0.45;

export function ParallaxHero() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        // `isMobile` is not redundant. gsap.matchMedia only invokes the
        // callback when at least one of its conditions matches, so a phone
        // with motion enabled — isDesktop false, reduce false — would never
        // run it at all. This guarantees exactly one size condition is always
        // true, and it is how the tier is chosen below.
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767.98px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as {
          isDesktop: boolean;
          reduce: boolean;
        };
        // A reduced-motion visitor asked for none of this. Everyone else gets
        // it, phone included — only the amplitude changes.
        if (reduce) return;
        const scale = isDesktop ? 1 : MOBILE_SCALE;

        const section = document.querySelector<HTMLElement>("[data-px-root]");
        if (!section) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            // Matches the reference's 1.2 — heavy enough to read as weight
            // rather than as the layers snapping to the scrollbar.
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        for (const layer of LAYERS) {
          const el = section.querySelector<HTMLElement>(
            `[data-px="${layer.attr}"]`,
          );
          if (!el || layer.factor === 0) continue;
          el.style.willChange = "transform";
          tl.to(
            el,
            {
              // Resolved as a function so a resize or an orientation change
              // recomputes the travel against the new hero height rather
              // than keeping a stale pixel value.
              y: () => section.offsetHeight * layer.factor * scale,
              ease: "none",
            },
            0,
          );
        }

        // Second timeline on its own range: the foreground dims as it leaves
        // so the type never fights the section underneath it.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "35% top",
              end: "bottom top",
              scrub: 1.2,
            },
          })
          .to(
            section.querySelectorAll("[data-px-fade]"),
            { opacity: 0.25, ease: "none" },
            0,
          );
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
