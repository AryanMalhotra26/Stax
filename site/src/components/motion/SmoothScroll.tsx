"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll + the global ScrollTrigger contract (§4.2).
 *
 * Smooth scroll is the single largest contributor to a page feeling designed
 * rather than assembled — it turns the browser's stepped wheel scroll into an
 * eased, continuous motion, which is what every scroll-linked animation then
 * rides on.
 *
 * DURATION IS CAPPED AT 1.4 AND THAT IS DELIBERATE. The reference runs 2.3,
 * the heaviest Lenis setting I have seen in production, and it is a real
 * identity choice for a slow, contemplative consultancy. Stax is a conversion
 * page aimed at students and their parents on phones and laptops: heavy
 * smoothing adds perceived latency to every single interaction and actively
 * fights a fast scroller looking for the price.
 *
 * Desktop only, matching the reference's own width gate — phones get native
 * scroll, which is correct and non-negotiable: smoothing fights the
 * platform's own momentum and reads as lag on mid-range Android, a large
 * share of this audience.
 *
 * Two integration details that are easy to get wrong:
 *  - Lenis must drive ScrollTrigger's update, or scrubbed animations lag a
 *    frame behind the content they are pinned to.
 *  - Lenis has to be ticked from GSAP's ticker rather than its own rAF loop,
 *    otherwise the two run on separate clocks and scrubbing jitters.
 */
export function SmoothScroll() {
  useEffect(() => {
    /**
     * The global ScrollTrigger contract. These are the reference's exact
     * values — 51 of its 64 triggers use precisely this — and they are set
     * once here so no individual animation has to restate them.
     *
     * `scrub` on the default is the important one. **Scrub everything,
     * trigger nothing**: every animation ties to scroll position, so
     * scrolling back up reverses it. That is what makes the page feel like a
     * camera you are driving rather than a slideshow that fires once.
     *
     * The `clamp()` wrapper is what stops an element that is already in view
     * on load from appearing mid-animation. Do not drop it.
     */
    ScrollTrigger.defaults({
      start: "clamp(top bottom)",
      end: "clamp(bottom 90%)",
      scrub: 0.8,
    });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Never on touch: it fights the platform's own momentum scrolling.
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
