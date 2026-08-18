"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Section reveal (motion inventory #2). `whileInView` with `once: true` —
 * Motion rather than ScrollTrigger, because pulling ScrollTrigger in for a
 * fade costs more JS than the fade is worth (§4).
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Stat counter (motion inventory #4). Counts once on enter, then stops.
 *
 * The tween writes straight to `textContent` via a ref rather than through
 * React state — a state update per frame at 60fps for four counters at once
 * is a measurable INP cost for an effect that is pure decoration. Tabular
 * numerals keep the width fixed so the proof strip never reflows mid-count.
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

    // Reset to zero only once we know we can animate — SSR keeps the real
    // value so it is correct with JS off or on reduced motion.
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
      // Restore the true value if we're torn down mid-count — otherwise a
      // navigation away at the wrong moment leaves a stale "0" in the DOM.
      if (!done.current) el.textContent = to.toLocaleString();
    };
  }, [to, duration, reduce]);

  // Server-rendered with the final value, so it is correct with JS disabled
  // and for anyone on reduced motion.
  return (
    <span ref={ref} className={`tnum ${className}`}>
      {to.toLocaleString()}
    </span>
  );
}
