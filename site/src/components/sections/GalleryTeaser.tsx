import Link from "next/link";
import { Render } from "@/components/ui/Render";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { media } from "@/content/generated/media";

/**
 * Asymmetric grid → /residences#gallery (§3.1 §7). Feeds the visual buyers
 * without making them scroll a second full gallery on the home page.
 *
 * Asymmetric rather than a uniform grid so the section reads differently from
 * the plan cards above it — the layout-family rule (§3.1) means no two
 * adjacent sections should share a shape.
 */
/**
 * A deliberate 6-column × 4-row composition that tessellates exactly, so
 * there are no orphan gaps at any breakpoint:
 *
 *   rows 1–2   [ A A A A ][ B B ]      rows 3–4   [ D D ][ E E E E ]
 *              [ A A A A ][ C C ]                 [ D D ][ F F ][ G G ]
 *
 * Below `md` the grid collapses to 4 columns and heights come from aspect
 * ratios instead of fixed rows.
 */
const TILES = [
  { slug: "living-upgrade-island", span: "col-span-4 aspect-4/3 md:aspect-auto md:row-span-2" },
  { slug: "bedroom", span: "col-span-2 aspect-square md:aspect-auto" },
  { slug: "bathroom", span: "col-span-2 aspect-square md:aspect-auto" },
  { slug: "kitchen-standard", span: "col-span-2 aspect-square md:aspect-auto md:row-span-2" },
  { slug: "exterior-evening", span: "col-span-2 aspect-square md:col-span-4 md:aspect-auto" },
  { slug: "exterior-lawn", span: "col-span-2 aspect-square md:aspect-auto" },
  { slug: "living-upgrade-dining", span: "col-span-2 aspect-square md:aspect-auto" },
] as const;

export function GalleryTeaser() {
  return (
    <section className="bg-bone">
      <div className="container-stax section-y">
        <SectionHead
          index="04"
          eyebrow="Gallery"
          heading="What it looks like."
          action={
            <Link
              href="/residences#gallery"
              className="text-[0.9375rem] font-semibold underline underline-offset-4 transition-colors hover:text-brick"
            >
              See all 10 renders →
            </Link>
          }
        />

        <Reveal delay={0.08}>
          <div className="mt-9 grid grid-cols-4 md:grid-cols-6 gap-2.5 md:gap-3.5 md:auto-rows-[8.5rem] lg:auto-rows-[9.25rem]">
            {TILES.map((tile) => (
              <Link
                key={tile.slug}
                href="/residences#gallery"
                className={`${tile.span} sd-mask group relative overflow-hidden bg-grey`}
              >
                <Render
                  media={media(tile.slug)}
                  sizes="(max-width: 767px) 50vw, 33vw"
                  className="block w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-600 ease-[var(--ease-out-expo)] group-hover:scale-104"
                />
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
