"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Section reveal — scroll-linked, not triggered.
 *
 * This used to be a Motion `whileInView` with `once: true`: an animation that
 * fires when an element crosses a threshold and then plays on its own clock.
 * That is what makes a long page feel like a stack of separate blocks — each
 * section announces itself independently of the one before it.
 *
 * It is now driven by `animation-timeline: view()` (see `.sd-rise` in
 * globals.css), so the movement is tied to scroll position: content assembles
 * as you descend and comes apart if you go back, and every element on the page
 * shares one timing model rather than firing at each other.
 *
 * Doing this in CSS rather than GSAP is not just a nicety. A statically
 * imported GSAP gets hoisted by Turbopack into a chunk shared by *every*
 * route — measured at +43KB on the ad landing pages, which never use it. The
 * native timeline costs nothing and behaves identically.
 *
 * `delay` shifts the element's animation range rather than postponing a timer,
 * so staggered siblings still stagger.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}) {
  const Tag = as as ElementType;

  return (
    <Tag
      className={`sd-rise ${className}`}
      style={
        {
          "--rise-delay": `${Math.round(delay * 100)}`,
          "--rise-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Stat counter — scrubbed, not triggered.
 *
 * This used to count once on enter and stop, on the argument that a counter
 * running backwards reads as a bug. That argument loses to the page's one
 * motion law: **scrub everything, trigger nothing** (§7). A counter that
 * fires on a threshold is the only thing on the page running on its own
 * clock, and next to twenty scrubbed elements it is the one that looks wrong
 * — it announces itself while everything around it answers the wheel.
 *
 * Scrubbed, it also does something a triggered counter cannot: scroll up
 * halfway and the number sits at an intermediate value, which makes the
 * figure feel attached to the page rather than played at you.
 *
 * Implemented against the scroll position directly rather than with
 * ScrollTrigger. GSAP is deliberately absent from this route's shared chunk
 * (a statically imported GSAP gets hoisted by Turbopack into a chunk every
 * route pays for, the ad landing pages included) and this is ~20 lines. The
 * tween writes straight to `textContent` through a ref, so several counters
 * at 60fps cost no React renders.
 */
export function CountUp({
  to,
  className = "",
}: {
  to: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = to.toLocaleString();
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Counts across the last third of its approach: from one third of a
      // viewport below the fold, to the point where it sits 65% up the
      // screen. Any longer and the digits are still moving when the reader
      // has started on the next paragraph.
      const start = window.innerHeight * 1.05;
      const end = window.innerHeight * 0.65;
      const p = (start - rect.top) / (start - end);
      const clamped = Math.min(1, Math.max(0, p));
      // expo-out, matching --ease-out-expo, so the count decelerates into its
      // final value instead of arriving at a constant rate.
      const eased = clamped === 1 ? 1 : 1 - Math.pow(2, -10 * clamped);
      el.textContent = Math.round(to * eased).toLocaleString();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [to, reduce]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {to.toLocaleString()}
    </span>
  );
}
