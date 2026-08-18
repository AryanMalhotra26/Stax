"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { animate, useReducedMotion } from "motion/react";

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
 * Stat counter (motion inventory #4). Counts once on enter, then stops.
 *
 * Deliberately still triggered rather than scrubbed: a counter that runs
 * backwards when you scroll up reads as a bug, not a flourish. The tween
 * writes straight to `textContent` via a ref, so several counters at 60fps
 * cost no React renders.
 */
export function CountUp({
  to,
  duration = 1.4,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (reduce || !ref.current || done.current) return;
    const el = ref.current;
    let controls: { stop: () => void } | null = null;

    el.textContent = "0";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        controls = animate(0, to, {
          duration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            el.textContent = Math.round(v).toLocaleString();
          },
          onComplete: () => {
            done.current = true;
            el.textContent = to.toLocaleString();
          },
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
      if (!done.current) el.textContent = to.toLocaleString();
    };
  }, [to, duration, reduce]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {to.toLocaleString()}
    </span>
  );
}
