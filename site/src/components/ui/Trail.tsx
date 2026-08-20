/**
 * The trail (§4.4, rebuilt).
 *
 * What this replaces was a scroll-progress indicator: one continuous SVG,
 * 140px wide and 15,718px tall — an aspect ratio of 1:112 — pinned to the
 * left gutter at `z-index: 20`. At that ratio a Bézier has 61px of horizontal
 * travel to spend over the height of the entire page, so it could not curve;
 * it read as a dashed vertical rule that struck through the hero headline,
 * the 1-Bedroom card and the pinned walkthrough. A line that overprints
 * content reads as a registration error, not as decoration.
 *
 * The reference is not doing that. to-top.ch draws SIX separate hand-drawn
 * artworks, each sized to its own section, each at a different depth: their
 * z-indices run −1, 0, 0, 1, 6, auto, so the route emerges from behind a
 * card, crosses the page, and disappears behind a photographic cutout of a
 * hiker before re-emerging under her backpack. It is a route drawn on a map,
 * not a progress bar — and a progress bar answers a question the scrollbar
 * has already answered.
 *
 * Five rules, all of them measured off the reference rather than guessed:
 *
 * 1. IT IS A MAP, NOT A PROGRESS BAR. Hence the X at the terminus, the
 *    topographic ground under the Commitments, the path-not-taken beside
 *    segment B, and the compass on the neighbourhood plate.
 *
 * 2. IT USES THE FULL WIDTH. Every segment is `w-full` on its section. Width
 *    is what makes a line a gesture; a gutter only lets it twitch.
 *
 * 3. IT WEAVES THROUGH DEPTH. Every host section puts its content at `z-2`
 *    and the segment at `z-0`, so the route runs *behind* the cards and
 *    reappears past them. Note that a negative z-index would be wrong here
 *    and not merely unnecessary: `.relative` does not open a stacking
 *    context, so `-z-10` would drop the segment behind its own section's
 *    background colour and it would vanish.
 *
 * 4. IT IS INTERMITTENT. Four segments across eleven sections. The hero, the
 *    Idea, the walkthrough, the Gallery and the FAQ carry no trail at all.
 *    A line that is always present stops being read as a device.
 *
 * 5. THE PATHS ARE DRAWN FAR LARGER THAN THE FRAME, THEN CROPPED. Every `d`
 *    below starts and ends outside its own viewBox — `M -260 200`,
 *    `C … 1860 880` — so the visible line is a slice of a much longer curve.
 *    That is why it always looks like it is coming from somewhere and going
 *    somewhere. A path drawn to fit its box exactly always looks like it
 *    starts and stops. The negative `top` offsets at the call sites are the
 *    other half of the same trick.
 *
 * And one rule about what NOT to do. Pass 1 called for scrubbing
 * `stroke-dashoffset` to scroll so the route draws itself. Measured against
 * the live reference that was simply wrong: their segments carry
 * `transform: none`, `opacity: 1` and no interaction binding — there is zero
 * scroll animation on the trail. The beauty is entirely in the drawing and
 * the placement. Nothing here animates, and if a path ever needs animation to
 * look good the path is wrong.
 */

/**
 * Stroke language.
 *
 * Amber is light and brick is material (§ palette rule 1), and a route drawn
 * on a map is neither — so the tone is chosen by surface, not by meaning.
 * Brick is the ink of the light sections; on the dark tiers brick at 55% goes
 * muddy against espresso, so sand stands in as ink there.
 *
 * `lit` is the exception, and it exists exactly once: the final segment
 * arrives at the Register form in amber at full strength. One colour change,
 * once, at the point of conversion — the same trick as the sun-circle hover.
 */
const TONES = {
  ink: { stroke: "var(--color-brick)", opacity: 0.55, mark: "var(--color-ink)" },
  chalk: { stroke: "var(--color-sand)", opacity: 0.4, mark: "var(--color-sand)" },
  lit: { stroke: "var(--color-amber)", opacity: 1, mark: "var(--color-sand)" },
} as const;

export type TrailTone = keyof typeof TONES;

type Segment = {
  viewBox: string;
  /** 3–6 cubic Béziers, zero straight segments, both ends off-frame. */
  d: string;
  /**
   * The path not taken (§ map vocabulary). A thinner, fainter route running
   * a few hundred units away that leaves the frame and goes nowhere. It is
   * what makes the main route read as *chosen* rather than as the only line
   * that happens to be drawn.
   */
  ghost?: string;
  /**
   * Where the route ends, for the segment that ends. Only `d` carries one.
   */
  terminus?: { x: number; y: number };
  /**
   * The window onto the same path used below `lg`.
   *
   * A wide sweeping curve needs width: at 375px every one of these
   * compresses back into the vertical line this rebuild exists to delete.
   * Only the arriving segment survives on a phone, and only its last
   * stretch — which is a crop of the same path, not a second drawing.
   *
   * It is a wide letterbox rather than a scaled-down copy of the desktop
   * window for a specific reason. A phone column has no margins: every
   * horizontal band of a mobile section is full of type, except the
   * section's own top padding. So the mobile crop is drawn to the
   * proportions of that padding — the one place a mark can land without
   * crossing a heading.
   */
  crop?: string;
};

const SEGMENTS = {
  /**
   * A — Floor Plans. The route leaves the street and heads for the door.
   * Enters top-right off-canvas, sweeps left across the full width, loops
   * once, and exits bottom-left off-canvas. The loop is a genuine
   * self-crossing teardrop rather than a lens: the return curve passes over
   * the outbound one, which is the single detail that separates a drawn
   * route from a wire bent into a shape.
   */
  a: {
    viewBox: "0 0 1600 1200",
    d: "M1780 -210 C1400 90 1150 330 820 400 C560 455 300 400 250 570 C195 755 470 830 590 700 C700 580 480 520 300 640 C90 780 -20 1080 -240 1400",
  },

  /**
   * B — the bridge into the Gallery. A wide shallow S across the render band,
   * drawn under the band's own dissolve gradients so it emerges out of the
   * espresso above and is swallowed by the night below. That is the
   * reference's hiker move — their route disappears behind a photographic
   * cutout and re-emerges under her backpack — done with the gradient the
   * band already carries rather than with a second cut-out asset.
   */
  b: {
    // Letterboxed at 4:1 rather than the 16:9 the others use, because the
    // band it lives in is 4:1. A tall frame in a shallow host shows one
    // narrow horizontal slice of the drawing, which is a crop, not a route —
    // the shape has to be drawn for the window it will be seen through.
    viewBox: "0 0 1600 400",
    d: "M-280 60 C180 -60 460 300 800 310 C1060 318 1180 150 1390 190 C1580 226 1690 350 1900 480",
    ghost: "M-240 300 C220 250 540 390 940 360 C1220 338 1340 270 1820 320",
  },

  /**
   * C — Commitments. Quiet connective tissue: a single shallow arc, low
   * contrast, running behind all three cards. It is the segment you should
   * never consciously notice, and it is there so the gap between the Gallery
   * and the FAQ does not read as two thousand pixels with no route on them.
   */
  c: {
    viewBox: "0 0 1600 700",
    d: "M-260 560 C200 290 540 170 880 220 C1120 255 1260 400 1420 400 C1580 400 1700 320 1880 180",
  },

  /**
   * D — Register. The arrival, and the only segment that ends.
   *
   * Every other path here leaves its frame at both ends because a route
   * should look like it continues. This one deliberately does not: it enters
   * top-left off-canvas and stops, at an X, beside the form. That is the
   * whole point of the section, so the rule that governs the other three is
   * the wrong rule for this one — a destination that runs off the edge is not
   * a destination.
   */
  d: {
    viewBox: "0 0 1600 1100",
    // The descent hugs the far left. Register's copy sits in a centred
    // `max-w-4xl` column and its form in a `max-w-2xl` one, so the only
    // vertical corridor a route can take without crossing type is the left
    // margin — the first curve is drawn to stay in it, then the path runs
    // beneath the form and rises to the mark on the open right-hand side.
    d: "M-300 -180 C60 60 205 300 235 570 C265 830 520 995 810 1015 C1010 1029 1195 930 1300 800",
    terminus: { x: 1300, y: 800 },
    crop: "1000 730 700 175",
  },
} satisfies Record<string, Segment>;

export type TrailId = keyof typeof SEGMENTS;

/**
 * `stroke-linecap: round` is not a detail. It is the single property that
 * makes a dashed line read as drawn by a hand rather than plotted by a
 * machine, and the previous trail did not have it.
 */
const STROKE_WIDTH = 4.5;
const DASH = "14 14";

export function TrailSegment({
  id,
  tone = "ink",
  className = "",
  mobileClassName = "",
}: {
  id: TrailId;
  tone?: TrailTone;
  /**
   * Placement only: width, position, offset, z-index, breakpoint.
   *
   * Width is deliberately NOT defaulted here. Two competing `w-*` utilities
   * on one element resolve by stylesheet order rather than by the order they
   * appear in the class attribute, so a `w-full` baked in below would
   * silently win or lose against a caller's `w-[128%]` depending on how
   * Tailwind happened to emit them. Every call site states its own width.
   */
  className?: string;
  /** Placement for the cropped phone window, which needs its own. */
  mobileClassName?: string;
}) {
  const segment: Segment = SEGMENTS[id];
  const { stroke, opacity, mark } = TONES[tone];

  const route = (viewBox: string, extra: string) => (
    <svg
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute h-auto select-none ${extra}`}
      style={{ opacity }}
    >
      {segment.ghost && (
        <path
          d={segment.ghost}
          stroke={stroke}
          strokeWidth={2}
          strokeDasharray="10 12"
          strokeLinecap="round"
          opacity={0.45}
        />
      )}

      <path
        d={segment.d}
        stroke={stroke}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={DASH}
        strokeLinecap="round"
      />

      {/* X marks the spot. Drawn once on the whole site, at the point of
          conversion, and drawn inside the segment's own coordinate space so
          it lands exactly on the terminus at every viewport width rather
          than being positioned against it and drifting.

          It takes the tone's `mark` colour rather than its stroke. On the
          night surface at Register the route is amber — it is arriving, and
          arriving is the one thing on this site worth lighting — but the X
          is sand, because sand is what ink is on a dark surface. A mark that
          glowed would be a second light source competing with the very
          thing it marks.

          Two crossed strokes rather than a glyph, and neither is straight —
          each has a slight bow, because a hand does not draw a straight
          line and a perfectly straight X reads as a close button. */}
      {segment.terminus && (
        <g
          transform={`translate(${segment.terminus.x} ${segment.terminus.y}) rotate(-6)`}
          stroke={mark}
          strokeWidth={9}
          strokeLinecap="round"
        >
          <path d="M-30 -28 C-8 -6 8 8 30 30" />
          <path d="M30 -30 C8 -6 -8 8 -30 28" />
        </g>
      )}
    </svg>
  );

  // One path, two windows onto it. The phone gets the last stretch of the
  // arriving route and nothing else — placed on its own terms, because the
  // desktop offsets are calculated against margins a phone does not have.
  if (segment.crop) {
    return (
      <>
        {route(segment.crop, `lg:hidden ${mobileClassName}`)}
        {route(segment.viewBox, `hidden lg:block ${className}`)}
      </>
    );
  }

  return route(segment.viewBox, `hidden lg:block ${className}`);
}
