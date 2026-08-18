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

const LAYERS: { attr: string; yPercent: number }[] = [
  { attr: "render", yPercent: 12 },
  { attr: "scrim", yPercent: 8 },
  { attr: "badge", yPercent: -22 },
  { attr: "headline", yPercent: -38 },
  { attr: "lede", yPercent: -28 },
  { attr: "cta", yPercent: -18 },
  { attr: "cue", yPercent: 64 },
];

export function ParallaxHero() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, reduce } = ctx.conditions as {
          isDesktop: boolean;
          reduce: boolean;
        };
        // Pinning depth onto a phone fights the platform's own scroll, and a
        // reduced-motion visitor asked for none of this.
        if (!isDesktop || reduce) return;

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
          },
        });

        for (const layer of LAYERS) {
          const el = section.querySelector<HTMLElement>(
            `[data-px="${layer.attr}"]`,
          );
          if (!el) continue;
          el.style.willChange = "transform";
          tl.to(el, { yPercent: layer.yPercent, ease: "none" }, 0);
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
