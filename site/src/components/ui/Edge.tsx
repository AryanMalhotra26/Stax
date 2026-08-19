import type { CSSProperties } from "react";

/**
 * Section edges — the device that stops eleven sections reading as eleven
 * slides (§4.5).
 *
 * The rule is absolute: **no two sections may meet at a straight horizontal
 * seam.** The previous page had `bg-bone` butting against `bg-paper` butting
 * against `bg-charcoal` with a hard rule at every join, and the reference
 * never does this once — every boundary is either a gradient bleed or a
 * deliberate torn edge, so its sections read as one continuous environment.
 *
 * Two tools live here, in order of preference.
 */

const STOPS = {
  night: "var(--color-night)",
  espresso: "var(--color-espresso)",
  bark: "var(--color-bark)",
  linen: "var(--color-linen)",
  paper: "var(--color-paper)",
  bone: "var(--color-bone)",
} as const;

export type SeamColor = keyof typeof STOPS;

/**
 * (a) Gradient bleed — the default, and what most joins should use.
 *
 * The neighbouring surface is carried *into* this section as a gradient to
 * transparency, so the boundary belongs to neither section. Stacking one at
 * each end of every section is what makes the page read as one descent.
 *
 * Rendered as an overlay rather than a background-image so a section can
 * carry a texture, a lamp radial and both bleeds without four background
 * layers fighting over one shorthand.
 */
export function Seam({
  edge,
  color,
  size = "22%",
  className = "",
}: {
  edge: "top" | "bottom";
  /** The surface on the other side of the join. */
  color: SeamColor;
  /** How far the neighbour bleeds in. 22–30% is the reference's range. */
  size?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-1 ${
        edge === "top" ? "top-0" : "bottom-0"
      } ${className}`}
      style={
        {
          height: size,
          maxHeight: "34rem",
          background: `linear-gradient(to ${edge === "top" ? "bottom" : "top"}, ${
            STOPS[color]
          }, transparent)`,
        } as CSSProperties
      }
    />
  );
}

/**
 * (b) Torn edge — used **exactly twice** on the whole site.
 *
 * Once where the dark hero meets the first light section, once where the light
 * FAQ meets the dark Register section. The reference uses this device exactly
 * once and it lands hard *because* it is rare; two is the maximum and there is
 * no third.
 *
 * The strip is coloured to match the *incoming* section and sits at the bottom
 * of the outgoing one, so the next surface reads as paper torn over this one.
 * `preserveAspectRatio="none"` stretches one authored 1440px path to any
 * viewport — a tear does not need to keep its aspect ratio, and scaling it is
 * what keeps this at ~1KB instead of a PNG per breakpoint.
 */
const TORN_PATH = "M0,40 L0,12.1 L24.7,11.1 L43.7,11.2 L63.4,3.7 L77.6,35.0 L98.4,37.7 L123.8,13.1 L135.4,30.5 L145.4,6.4 L155.0,9.9 L178.3,13.5 L195.8,10.2 L209.5,19.9 L232.8,7.7 L245.7,3.3 L267.7,17.2 L283.3,17.3 L292.3,18.4 L309.3,9.2 L319.5,16.0 L333.1,27.3 L358.5,4.1 L371.7,23.0 L394.2,12.1 L410.8,15.2 L422.1,4.1 L438.2,6.9 L463.7,7.5 L487.8,9.1 L511.3,3.8 L537.1,6.6 L559.3,7.3 L569.5,31.3 L582.6,8.7 L599.3,10.7 L618.1,5.3 L629.7,16.7 L643.0,15.3 L668.0,19.1 L691.9,9.6 L702.7,37.4 L715.8,6.6 L738.8,7.3 L750.8,3.2 L763.6,17.3 L783.1,18.5 L795.5,26.3 L812.1,24.8 L827.4,4.4 L842.5,19.6 L862.7,12.5 L874.1,22.3 L898.6,19.3 L907.9,10.7 L929.4,20.0 L939.6,15.3 L963.9,14.7 L986.4,8.3 L1007.1,17.7 L1023.2,17.5 L1041.9,8.9 L1060.8,3.4 L1080.7,17.8 L1102.1,15.2 L1120.9,17.1 L1131.4,2.5 L1150.6,6.1 L1171.5,13.1 L1196.1,2.2 L1210.2,5.6 L1222.1,13.9 L1238.6,7.9 L1258.9,9.8 L1281.6,17.8 L1297.2,7.7 L1308.5,17.1 L1331.9,19.1 L1345.6,10.1 L1359.3,9.5 L1378.9,7.7 L1402.2,10.1 L1412.5,36.0 L1422.2,12.3 L1436.4,2.3 L1440,9.5 L1440,40 Z";

export function TornEdge({
  color,
  className = "",
}: {
  /** The surface *below* the tear. */
  color: SeamColor;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 -bottom-px z-2 h-6 w-full md:h-10 ${className}`}
      style={{ fill: STOPS[color] }}
    >
      <path d={TORN_PATH} />
    </svg>
  );
}
