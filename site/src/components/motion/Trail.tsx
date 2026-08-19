"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The trail (§4.4).
 *
 * The reference threads a dashed line down the whole page — a hiking route,
 * with a filled node wherever the journey reaches a new stage. It is the
 * device that makes eleven sections read as one descent rather than a stack
 * of separate pages, and it was already the best thing on this site.
 *
 * Four upgrades over the straight dashed rule it replaces:
 *
 * 1. IT CURVES. The reference's trail is a hand-drawn path that meanders, not
 *    a rule. A straight vertical line at the edge of a viewport reads as a
 *    scrollbar; a line that wanders reads as a route. This is the single most
 *    characterful thing on the page and it costs one SVG.
 *
 * 2. IT DRAWS AS YOU DESCEND. The route ahead is faint; the route behind is
 *    solid brick. The boundary tracks scroll position.
 *
 * 3. THE WAYPOINTS ACTIVATE, and each one carries a label in the hand —
 *    *the street*, *your door*, *inside*. That is what turns a decoration
 *    into the metaphor: the page is a walk home and the trail says where you
 *    are on it.
 *
 * 4. IT MOVES INBOARD. `left: 20px` sat close enough to the viewport edge to
 *    read as browser chrome.
 *
 * Waypoints are declared in the markup with `data-trail`, so adding or
 * reordering a section needs no change here — and a section that should not
 * carry a stop simply does not have the attribute.
 */

type Node = { y: number; label: string };

/** Width of the meander, in the SVG's own coordinates. */
const W = 140;

export function Trail() {
  const ref = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    const measure = () => {
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const stops = [...main.querySelectorAll<HTMLElement>("[data-trail]")];
      setHeight(main.offsetHeight);
      setNodes(
        stops.map((el) => {
          const box = el.getBoundingClientRect();
          return {
            // The stop sits at the section's vertical midpoint.
            y: box.top + window.scrollY - mainTop + box.height / 2,
            label: el.dataset.trail ?? "",
          };
        }),
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
      const p =
        (window.scrollY + window.innerHeight * 0.55 - mainTop) /
        main.offsetHeight;
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

  if (!height || !nodes.length) return <div ref={ref} aria-hidden="true" />;

  /**
   * The meander. The path swings between the two sides of its 140px column,
   * turning at each waypoint — so every curve has a reason and the dots
   * always sit on the line rather than near it.
   */
  const x = (i: number) => (i % 2 === 0 ? W * 0.28 : W * 0.72);
  let d = `M ${x(0)} 0`;
  nodes.forEach((node, i) => {
    const prevY = i === 0 ? 0 : nodes[i - 1].y;
    const mid = (prevY + node.y) / 2;
    d += ` C ${x(i - 1)} ${mid}, ${x(i)} ${mid}, ${x(i)} ${node.y}`;
  });
  d += ` C ${x(nodes.length - 1)} ${(nodes[nodes.length - 1].y + height) / 2}, ${x(nodes.length)} ${(nodes[nodes.length - 1].y + height) / 2}, ${x(nodes.length)} ${height}`;

  const route = (className: string) => (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      width={W}
      height={height}
      preserveAspectRatio="none"
      className={`absolute top-0 left-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="14 10"
      />
    </svg>
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-[clamp(20px,4vw,72px)] z-20 hidden lg:block"
      style={{ height, width: W, ["--p" as string]: 0 }}
    >
      {/* The route ahead — faint. */}
      {route("stroke-brick opacity-20")}

      {/* The route travelled — solid, clipped to progress. Clipping a wrapper
          rather than animating `stroke-dashoffset` is what keeps the dashes
          stationary: offsetting a repeating dash makes it march along the
          path instead of the path arriving. */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: "calc(100% * var(--p))" }}
      >
        {route("stroke-brick")}
      </div>

      {nodes.map((node, i) => (
        <div
          key={`${node.label}-${i}`}
          className="absolute"
          style={{
            top: node.y,
            left: x(i),
            // 1 once the travelled line has passed this stop, 0 before it.
            ["--on" as string]: `clamp(0, (var(--p) * ${height} - ${node.y}) * 999, 1)`,
          }}
        >
          {/* The lamp behind an active stop. Amber emits; brick is built —
              so the dot is brick and the glow around it is amber. */}
          <span
            className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber transition-opacity duration-300"
            style={{ opacity: "calc(var(--on) * 0.22)" }}
          />
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brick transition-[width,height,background-color] duration-300 ease-[var(--ease-out-expo)]"
            style={{
              width: "calc(8px + var(--on) * 4px)",
              height: "calc(8px + var(--on) * 4px)",
              backgroundColor: `color-mix(in srgb, var(--color-brick) calc(100% * var(--on)), transparent)`,
            }}
          />

          {node.label && (
            <span
              className="hand absolute top-1/2 left-6 -translate-y-1/2 text-hand-sm whitespace-nowrap text-brick transition-opacity duration-300 xl:block"
              style={{
                ["--hand-tilt" as string]: "-6deg",
                opacity: "var(--on)",
              }}
            >
              {node.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
