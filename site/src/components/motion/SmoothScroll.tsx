"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll.
 *
 * This is the single largest contributor to a page feeling "designed" rather
 * than assembled — it turns the browser's stepped wheel scroll into an eased,
 * continuous motion, which is what every scroll-linked animation on the page
 * then rides on.
 *
 * Mounted per route, never in the root layout, because §6.2 rule 3 is right:
 * smooth scroll adds perceptual latency to the click you paid for. It runs on
 * / and /residences and is deliberately absent from /l/* and /register.
 *
 * Two integration details that are easy to get wrong:
 *  - Lenis must drive ScrollTrigger's update, or scrubbed animations lag a
 *    frame behind the content they are pinned to.
 *  - Lenis has to be ticked from GSAP's ticker rather than its own rAF loop,
 *    otherwise the two run on separate clocks and scrubbing jitters.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // ~1s to settle. Long enough to read as eased, short enough that the
      // page still feels responsive to a flick.
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Never on touch: it fights the platform's own momentum scrolling and
      // reads as lag on mid-range Android, which is a large share of this
      // audience.
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
  }, []);

  return null;
}
