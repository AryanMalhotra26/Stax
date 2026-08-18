"use client";

import { useEffect, useRef } from "react";

/**
 * The connective thread.
 *
 * TO TOP runs a dashed hiking trail down the whole page — one continuous line
 * that crosses every section boundary, which is most of why the sections read
 * as one journey instead of separate pages. The Stax equivalent is drawn from
 * the logo rather than borrowed: a vertical stack of blocks in the left
 * gutter that fills with brick as you descend.
 *
 * Uses a scroll-linked CSS custom property updated from a passive listener on
 * rAF, so it costs one style write per frame and no layout.
 *
 * Decorative and desktop-only — on a phone the gutter does not exist, and a
 * progress rail there is clutter rather than structure.
 */
export function ScrollSpine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-3 z-30 hidden h-dvh w-1.5 xl:block"
      style={{ ["--p" as string]: 0 }}
    >
      <div className="absolute inset-y-24 left-1/2 w-px -translate-x-1/2 bg-ink/12" />
      <div
        className="absolute left-1/2 w-1.5 -translate-x-1/2 bg-brick transition-none"
        style={{
          top: "6rem",
          height: "calc((100dvh - 12rem) * var(--p))",
        }}
      />
      {/* Leading node — the block motif, riding the head of the fill. */}
      <div
        className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 bg-ink"
        style={{ top: "calc(6rem + (100dvh - 12rem) * var(--p))" }}
      />
    </div>
  );
}
