"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The magnetic label (§5.4.5, and the reference's `.cursor-area` device).
 *
 * A circle that follows the pointer inside a defined area on a manual rAF
 * lerp — always easing *toward* the cursor rather than pinned to it. The lag
 * is the whole effect: it makes the label feel weighted instead of glued, and
 * it makes an image area read as enterable rather than decorative.
 *
 * Three fixes over the source:
 *  - it starts its rAF loop unconditionally and never cancels, so every area
 *    leaks a permanent frame loop; this starts on enter and cancels on leave
 *    and unmount.
 *  - it reads `getBoundingClientRect()` once at init, so the follower starts
 *    in the wrong place after any reflow; this measures on enter.
 *  - it runs on touch, where there is no cursor at all. This is pointer-gated,
 *    and gated on reduced motion too.
 *
 * Purely decorative: the follower is aria-hidden and the wrapper keeps
 * whatever semantics the caller gave it.
 */
export function MagneticLabel({
  label,
  children,
  className = "",
  tone = "amber",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  /** Amber emits, brick is built — pick by what the area is (§3.1). */
  tone?: "amber" | "brick";
}) {
  const area = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = area.current;
    const follower = dot.current;
    if (!el || !follower) return;

    // No cursor to follow, or the visitor asked for stillness.
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let targetX = 0,
      targetY = 0,
      x = 0,
      y = 0;
    const EASE = 0.1; // same coefficient as the reference

    const tick = () => {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;
      follower.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    const onEnter = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // Seed at the entry point so it eases outward from the cursor rather
      // than flying in from a stale centre.
      targetX = x = e.clientX - r.left;
      targetY = y = e.clientY - r.top;
      follower.style.opacity = "1";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      targetX = e.clientX - r.left;
      targetY = e.clientY - r.top;
    };

    const onLeave = () => {
      follower.style.opacity = "0";
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={area} className={`relative ${className}`}>
      {children}
      <span
        ref={dot}
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-20 grid h-[10ch] w-[10ch] place-items-center rounded-full text-center text-eyebrow uppercase opacity-0 transition-opacity duration-300 will-change-transform ${
          tone === "amber"
            ? "bg-amber text-night shadow-glow"
            : "bg-brick text-bone"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
