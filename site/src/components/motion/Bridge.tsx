import { Render } from "@/components/ui/Render";
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
 */
export function Bridge({
  slug,
  from,
  to,
  className = "",
}: {
  slug: string;
  /** Background of the section above — the top of the band fades into it. */
  from: "bone" | "paper" | "espresso" | "night" | "linen";
  /** Background of the section below. */
  to: "bone" | "paper" | "espresso" | "night" | "linen";
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
