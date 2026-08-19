import type { SVGProps } from "react";

/**
 * Line art — the watermarks, doodles and arrows (§8.4).
 *
 * Every card on the site carries one of these at 7–9% opacity, sized to
 * roughly 60% of the card's height and overflowing an edge. That single
 * element is what stops a card looking like a `<div>`, and it is the cheapest
 * character on the page: the whole set below is a few KB of inline path data
 * against 60KB budgeted, with no icon font, no sprite sheet and no request.
 *
 * They are drawn rather than borrowed on purpose. An icon-font glyph is a
 * filled shape at 24px optical size; blown up to 400px it reads as a UI
 * control that someone scaled. These are single-weight open paths with
 * deliberately imperfect symmetry, so at watermark scale they read as
 * something drawn by a person — which is the same register as the Caveat
 * annotations they sit beside.
 *
 * Sizing and colour are the caller's job: everything here is `stroke:
 * currentColor`, `fill: none`, and a 100×100 viewBox unless noted.
 */

type Props = SVGProps<SVGSVGElement>;

function Line({ children, ...props }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** §5.2 card 01 — the house that was never a house. */
export function ArtKey(props: Props) {
  return (
    <Line {...props}>
      <circle cx="30" cy="38" r="17" />
      <circle cx="30" cy="38" r="7.5" />
      <path d="M43.5 48 L78 79" />
      <path d="M64 68 L58.5 76" />
      <path d="M72.5 75 L67 83" />
    </Line>
  );
}

/** §5.2 card 02 — the corridor. */
export function ArtDoor(props: Props) {
  return (
    <Line {...props}>
      <path d="M24 12 L24 88 L76 88 L76 12 Z" />
      <path d="M31 19.5 L31 80.5 L69 80.5 L69 19.5 Z" />
      <path d="M38 30 L62 30 L62 52 L38 52 Z" />
      <circle cx="63" cy="62" r="2.6" />
      <path d="M16 88 L84 88" />
    </Line>
  );
}

/** §5.4 01 — the shuttle. */
export function ArtBus(props: Props) {
  return (
    <Line {...props}>
      <path d="M10 32 L78 32 Q88 32 90 42 L92 62 Q92 70 84 70 L14 70 Q10 70 10 64 Z" />
      <path d="M18 40 L36 40 L36 54 L18 54 Z" />
      <path d="M44 40 L62 40 L62 54 L44 54 Z" />
      <path d="M70 40 L84 40 L86.5 54 L70 54 Z" />
      <circle cx="28" cy="70" r="8" />
      <circle cx="74" cy="70" r="8" />
      <path d="M10 62 L18 62" />
    </Line>
  );
}

/** §5.4 02 — already furnished. */
export function ArtBedLamp(props: Props) {
  return (
    <Line {...props}>
      <path d="M12 74 L12 42 Q12 38 16 38 L20 38 Q24 38 24 42 L24 56" />
      <path d="M24 56 L82 56 Q88 56 88 62 L88 74" />
      <path d="M12 66 L88 66" />
      <path d="M28 56 Q28 47 37 47 L50 47 Q56 47 56 53" />
      <path d="M64 40 L76 40 L82 26 L70 26 Z" />
      <path d="M76 40 L76 56" />
    </Line>
  );
}

/** §5.4 03 — internet included. */
export function ArtWifi(props: Props) {
  return (
    <Line {...props}>
      <path d="M14 44 Q50 8 86 44" />
      <path d="M27 57 Q50 33 73 57" />
      <path d="M39 69 Q50 57 61 69" />
      <circle cx="50" cy="80" r="3.4" />
    </Line>
  );
}

/** §5.4 04 — full kitchens. */
export function ArtRange(props: Props) {
  return (
    <Line {...props}>
      <path d="M18 40 L82 40 L82 86 L18 86 Z" />
      <path d="M18 52 L82 52" />
      <path d="M28 58 L72 58" />
      <path d="M26 68 L74 68 L74 80 L26 80 Z" />
      <circle cx="31" cy="45.5" r="3.4" />
      <circle cx="45" cy="45.5" r="3.4" />
      <path d="M56 26 Q56 16 66 16 L78 16" />
      <path d="M52 32 L74 32" />
    </Line>
  );
}

/** §5.4 05 — two baths, mostly. */
export function ArtShower(props: Props) {
  return (
    <Line {...props}>
      <path d="M22 14 L22 30 Q22 36 30 36" />
      <path d="M30 30 L74 30 Q80 30 80 36 L80 40 Q80 44 74 44 L36 44 Q30 44 30 40 Z" />
      <path d="M40 54 L36 68" />
      <path d="M52 54 L49 72" />
      <path d="M64 54 L61 66" />
      <path d="M46 62 L43 80" />
      <path d="M70 60 L68 74" />
    </Line>
  );
}

/** §5.4 06 — your own front door. */
export function ArtDoorKey(props: Props) {
  return (
    <Line {...props}>
      <path d="M22 14 L22 86 L64 86 L64 14 Z" />
      <path d="M29 22 L29 78 L57 78 L57 22 Z" />
      <circle cx="52" cy="50" r="2.4" />
      <path d="M52 52 L52 58" />
      <circle cx="78" cy="42" r="8" />
      <path d="M78 50 L78 74" />
      <path d="M78 62 L85 62" />
      <path d="M78 69 L84 69" />
    </Line>
  );
}

/** §5.4 07 — room outside. */
export function ArtTreeBench(props: Props) {
  return (
    <Line {...props}>
      <path d="M34 62 Q16 60 18 44 Q10 30 24 24 Q28 10 44 14 Q56 6 64 20 Q80 22 76 38 Q84 50 68 60 Z" />
      <path d="M50 60 L50 84" />
      <path d="M50 72 L40 64" />
      <path d="M56 78 L82 78" />
      <path d="M56 84 L82 84" />
      <path d="M60 72 L60 90" />
      <path d="M78 72 L78 90" />
      <path d="M56 72 L82 72" />
    </Line>
  );
}

/**
 * §5.2 — the fork. The reference spends a 2.2MB WebGL Spline scene on a 3D
 * signpost; this is the same idea as a flat composition at about 1KB, and at
 * a glance it reads identically. The arms take the labels.
 */
export function ArtSignpost({
  className = "",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M100 26 L100 146" />
      <path d="M84 140 Q100 133 117 140" />
    </svg>
  );
}

/**
 * Hand-drawn curved arrow. Roughly half the annotations should carry one of
 * these or the underline below (§6.5) — an aside with a mark pointing at what
 * it is about reads as a margin note; without one it reads as a stray label.
 */
export function ArtArrow({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 90 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 8 Q30 2 52 18 Q72 33 80 50" />
      <path d="M66 44 Q75 47 81 51" />
      <path d="M78 34 Q81 44 81 52" />
    </svg>
  );
}

/** Hand-drawn underline. Two passes, because one stroke reads as a border. */
export function ArtUnderline({
  className = "",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 6 Q54 1.5 104 5 Q152 8.5 196 4" />
      <path d="M10 10.5 Q60 7 108 9.5 Q150 11.5 190 9" opacity={0.55} />
    </svg>
  );
}
