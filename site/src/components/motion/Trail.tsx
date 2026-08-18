"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The trail.
 *
 * to-top.ch threads a dashed amber line down the whole page — a hiking route,
 * with a filled node wherever the journey reaches a new stage. It is the
 * device that makes their sections read as one descent rather than a stack of
 * separate pages, and it is the thing worth taking.
 *
 * Their implementation is a series of inline SVGs:
 *   <line stroke="#EFB300" stroke-width="4" stroke-dasharray="20,14"
 *         stroke-linecap="round" />  plus  <circle r="12" />
 *
 * This is the same idea drawn in the Stax language: brick instead of amber,
 * and square nodes rather than circles, because the wordmark is built from
 * hard-edged stacked blocks and a circle would be the one round thing on the
 * site.
 *
 * Two behaviours make it feel alive rather than decorative:
 *  - The line ahead of you is faint; the line behind you is solid. The
 *    boundary tracks scroll position, so the route draws itself as you
 *    descend.
 *  - A node fills as you reach it.
 *
 * Node positions are measured from the live layout rather than hardcoded, so
 * adding or reordering a section needs no change here.
 */
export function Trail() {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<number[]>([]);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    const measure = () => {
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const sections = [...main.querySelectorAll<HTMLElement>(":scope > section")];
      setHeight(main.offsetHeight);
      setNodes(
        sections
          .map((s) => s.getBoundingClientRect().top + window.scrollY - mainTop)
          // Skip the hero — the trail starts where the story does.
          .filter((y) => y > 200),
      );
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      // Progress of the viewport's midpoint through the page.
      const p = (window.scrollY + window.innerHeight * 0.55 - mainTop) / main.offsetHeight;
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!height) return <div ref={ref} aria-hidden="true" />;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-5 z-20 hidden w-3 lg:block xl:left-8"
      style={{ height, ["--p" as string]: 0 }}
    >
      {/* Route ahead — faint */}
      <span className="trail-line absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 opacity-25" />

      {/* Route travelled — solid, clipped to progress */}
      <span
        className="trail-line absolute inset-x-0 top-0 left-1/2 w-[3px] -translate-x-1/2"
        style={{ height: "calc(100% * var(--p))" }}
      />

      {nodes.map((y) => (
        <span
          key={y}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-[3px] border-brick bg-bone transition-colors duration-300"
          style={{
            top: y,
            // Fills once the travelled line has reached it.
            backgroundColor: `color-mix(in srgb, var(--color-brick) calc(100% * clamp(0, (var(--p) * ${height} - ${y}) * 999, 1)), var(--color-bone))`,
          }}
        />
      ))}
    </div>
  );
}
