"use client";

import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

/**
 * The page-load curtain (§4.1).
 *
 * A full-screen dark panel with the wordmark, which wipes upward and hands
 * off to the hero's letter cascade. Total ~2.6s — but nothing important waits
 * on it, and that is the whole design of this component:
 *
 *  - IT NEVER GATES LCP. The hero H1 is in the server HTML and painted
 *    underneath from the first frame. The curtain is an overlay that leaves,
 *    not a loader the content waits behind.
 *  - IT IS `pointer-events: none` THROUGHOUT, so a visitor who wants to click
 *    Register at 200ms can.
 *  - IT RUNS ONCE PER SESSION, not once per navigation. Seeing a brand
 *    animation on the way back from the FAQ is how a nice opening becomes an
 *    obstacle.
 *  - UNDER `prefers-reduced-motion` IT DOES NOT RUN AT ALL. Not shortened —
 *    skipped, along with the delay it hands to the headline.
 *
 * The animation itself is CSS keyframes rather than a GSAP timeline. It is
 * four opacity/transform steps on two elements; a timeline library for that
 * would mean pulling GSAP into the critical path of the first paint, which is
 * the one place on this site it must never be.
 *
 * The panel ships in the HTML with `hidden`, which is `display: none` — it
 * never paints and so cannot enter the LCP calculation — and the effect
 * simply un-hides it. That is a DOM write rather than a state change, which
 * is what an effect is actually for; toggling React state here would render
 * the whole page a second time to reveal an overlay.
 */
const SEEN_KEY = "stax:curtain";

export function Curtain() {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode with storage disabled: treat it as seen and skip. A
      // brand animation is not worth a thrown exception on first paint.
      seen = true;
    }

    if (reduce || seen) return;

    const el = ref.current;
    if (!el) return;

    // The hero cascade waits for the curtain to clear. Set as a custom
    // property so the hand-off is declarative rather than a second timer that
    // can drift out of step with this one.
    document.documentElement.style.setProperty("--reveal-delay", "1400ms");
    el.hidden = false;

    const t = window.setTimeout(() => {
      el.hidden = true;
    }, 2400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={ref} hidden className="curtain" aria-hidden="true">
      <div className="curtain-logo">
        <Logo className="h-9 w-auto text-bone md:h-12" />
        <p className="mt-4 text-eyebrow text-grey/45 uppercase">
          A {SITE.developer.name} community
        </p>
      </div>
    </div>
  );
}
