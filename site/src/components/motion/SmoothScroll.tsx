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

      /**
       * In-page anchors, routed through Lenis.
       *
       * REQUIRED THE MOMENT THE NAV GAINED SECTION LINKS. Lenis owns the
       * scroll position while it is running, so a native hash jump sets
       * `scrollTop` underneath it and Lenis immediately animates back to
       * where it thought it was — the page lurches and returns. The symptom
       * reads as "the menu does not work", and it only appears on desktop,
       * because Lenis is not created below 1024px or under reduced motion.
       * Native anchors are correct everywhere Lenis is absent, which is why
       * this lives inside the matchMedia branch rather than in the Nav.
       *
       * Delegated at the document so every anchor on the page is covered,
       * not only the ones in the menu.
       *
       * The modifier checks keep the browser's own behaviour intact:
       * cmd-click still opens a new tab, and a handler that has already
       * called preventDefault still wins.
       */
      const onAnchorClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const anchor = (e.target as Element | null)?.closest?.("a");
        const href = anchor?.getAttribute("href");
        if (!href || href === "#" || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        // The nav is fixed and ~88px tall, so a heading scrolled to 0 lands
        // underneath it.
        lenis.scrollTo(target as HTMLElement, { offset: -96 });
        history.pushState(null, "", href);
      };

      document.addEventListener("click", onAnchorClick);

      return () => {
        document.removeEventListener("click", onAnchorClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
