import type { Media } from "@/content/generated/media";
import { asset } from "@/lib/asset";

type Props = {
  media: Media;
  /** `sizes` attribute — always set it; a wrong one costs more than a big image. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Only the LCP image gets this. Everything else stays lazy. */
  priority?: boolean;
  /** Overrides the authored alt — use for decorative repeats only. */
  alt?: string;
};

/**
 * Renders a pre-generated AVIF/WebP set as a plain <picture>.
 *
 * Deliberately not `next/image`: the variants are already built at deploy time
 * (scripts/process-images.mjs), so the optimizer would be re-doing finished
 * work — and on Cloudflare Workers image resizing is a paid add-on and would
 * blow the 10ms CPU budget per request (§4.1). A static <picture> is free,
 * cacheable at the edge forever, and ships zero JS.
 *
 * The LQIP is a ~400-byte base64 WebP painted as a background, so the box is
 * never empty and never shifts. width/height are always set → CLS stays at 0.
 */
export function Render({
  media,
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  alt,
}: Props) {
  const widths = Object.keys(media.variants.avif)
    .map(Number)
    .sort((a, b) => a - b);

  const srcset = (format: "avif" | "webp") =>
    widths.map((w) => `${asset(media.variants[format][String(w)])} ${w}w`).join(", ");

  const largest = widths[widths.length - 1];
  const fallback = asset(media.variants.webp[String(largest)]);

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={fallback}
        alt={alt ?? media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        // fetchPriority high on the LCP image only — using it everywhere is
        // the same as using it nowhere.
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={{
          backgroundImage: `url(${media.placeholder})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </picture>
  );
}
