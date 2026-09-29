import type { ComponentProps } from "react";
import { asset } from "@/lib/asset";

/**
 * The STAX Living wordmark.
 *
 * Supplied as a PNG, and rendered as a MASK rather than as an `<img>`.
 *
 * The reason is the one the previous inline SVG solved with `currentColor`:
 * this mark appears on the dark nav, the night footer, the espresso admin
 * chrome AND on two light pages — /thank-you and the 404 — and the client
 * supplied a single light colourway (#ECECEC / #F0EAE9). Dropped in as an
 * image it would be invisible on the light pages, and asking for a second
 * file only moves the problem to whoever forgets to update both.
 *
 * A mask uses the file's alpha channel as a stencil and paints it with
 * `currentColor`, so the wordmark takes the colour of whatever it sits in —
 * exactly the old behaviour, one asset, and `hover:text-brick-light` in the
 * nav keeps working without a second thought.
 *
 * What it costs: the two-tone. The supplied art sets "stax" a hair cooler
 * than "Living" — 236,236,236 against 240,234,233, a difference of four
 * points in one channel that is not perceptible at any size this renders at.
 * Worth trading for a mark that is legible everywhere.
 *
 * TODO(client): an SVG would be better than a 586px PNG — it would scale
 * without limit and drop the asset to about a kilobyte. Ask for the vector
 * when there is a moment; nothing here changes but the URL.
 */

/** The trimmed artwork's own proportions. Width follows height from this. */
const ASPECT = "586 / 129";

export function Logo({
  className = "",
  title = "Stax Living",
  ...rest
}: ComponentProps<"span"> & { title?: string }) {
  const src = asset("/brand/stax-living.png");

  return (
    <span
      role="img"
      aria-label={title}
      className={`block ${className}`}
      style={{
        aspectRatio: ASPECT,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
      {...rest}
    />
  );
}

export function StaxMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 121 103"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="68" width="54" height="35" fill="currentColor" />
      <rect x="18" y="0" width="35" height="35" fill="currentColor" />
      <rect x="55" y="34" width="32" height="35" fill="currentColor" />
      <rect x="86" y="0" width="35" height="35" fill="currentColor" />
      <rect x="86" y="68" width="35" height="35" fill="currentColor" />
    </svg>
  );
}
