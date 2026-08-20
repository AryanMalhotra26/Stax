import { Render } from "@/components/ui/Render";
import { TrailSegment, type TrailId } from "@/components/ui/Trail";
import { media } from "@/content/generated/media";

/**
 * Tonal bridge between sections.
 *
 * TO TOP never cuts from one background colour straight to another — a
 * full-bleed photograph always sits in the join, so the eye reads a
 * continuous descent rather than a stack of tiles. This is the same device at
 * a height the page can afford: a shallow band carrying a render, with a
 * gradient at each end that dissolves into the section above and below.
 *
 * The image is oversized and drifts on the native scroll timeline, so the
 * band has parallax for no JavaScript.
 *
 * A band can also carry a trail segment. That placement is deliberate: the
 * segment is drawn over the photograph but *under* the band's own dissolve
 * gradients, so the route emerges out of the section above, crosses the
 * render, and is swallowed by the section below. It is the reference's best
 * depth move — their trail passes behind a photographic cutout of a hiker and
 * re-emerges under her backpack — reproduced with the gradient this band
 * already carries instead of with a second cut-out asset. And a decorative
 * band is the one place on the page where a line physically cannot overprint
 * a heading, a paragraph or a button.
 */
export function Bridge({
  slug,
  from,
  to,
  trail,
  className = "",
}: {
  slug: string;
  /** Background of the section above — the top of the band fades into it. */
  from: "bone" | "paper" | "espresso" | "night" | "linen";
  /** Background of the section below. */
  to: "bone" | "paper" | "espresso" | "night" | "linen";
  /** Optional trail segment, drawn between the render and the dissolve. */
  trail?: TrailId;
  className?: string;
}) {
  const stop = {
    bone: "var(--color-bone)",
    paper: "var(--color-paper)",
    linen: "var(--color-linen)",
    espresso: "var(--color-espresso)",
    night: "var(--color-night)",
  };

  return (
    <div
      className={`relative h-[30vh] min-h-44 overflow-clip md:h-[38vh] ${className}`}
      aria-hidden="true"
    >
      <Render
        media={media(slug)}
        sizes="100vw"
        className="sd-drift absolute inset-0 block h-[112%] w-full"
        imgClassName="h-full w-full object-cover"
      />
      {trail && (
        <TrailSegment
          id={trail}
          tone="chalk"
          className="-top-[8%] -left-[6%] w-[112%]"
        />
      )}

      {/* Dissolve into the neighbouring sections so neither edge is a line. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${stop[from]} 0%, transparent 42%, transparent 58%, ${stop[to]} 100%)`,
        }}
      />
    </div>
  );
}
