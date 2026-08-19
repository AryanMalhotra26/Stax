import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam, TornEdge } from "@/components/ui/Edge";
import { ArtUnderline } from "@/components/ui/LineArt";
import type { Faq } from "@/content/faqs";
import { publishedFaqs } from "@/content/faqs";
import { SITE } from "@/lib/site";

/**
 * "06 — FAQ" (§5.8).
 *
 * The reference has no equivalent and the accordion works, so this is a
 * restyle rather than a rebuild: the toggle becomes a circle whose plus
 * rotates into a cross, the panel opens on `grid-template-rows` instead of
 * `max-height`, and the sign-off moves to the hand.
 *
 * The panel animates its real height, never `max-height`. `max-height` has to
 * be set to a guess above the true height, so the easing curve applies to a
 * distance the content never travels — the panel snaps open early and then
 * waits, and the easing is effectively a lie. `::details-content` plus
 * `interpolate-size: allow-keywords` animates the actual height, and where
 * that is unsupported the panel simply opens instantly, which is the native
 * behaviour and perfectly fine.
 *
 * Built on native <details>/<summary>: correct keyboard and screen-reader
 * behaviour for free, works before hydration, ships no JS. Two columns rather
 * than one, because ten rows in a single column ran over a full screen of
 * height and read as a wall — and because each column is its own flow,
 * opening an item pushes only that column.
 */
export function FaqSection({
  items = publishedFaqs,
  heading = "Questions people",
  quiet = "actually ask.",
  eyebrow = "FAQ",
  index = "06",
  tone = "light",
}: {
  items?: Faq[];
  heading?: string;
  quiet?: string;
  eyebrow?: string;
  index?: string;
  tone?: "light" | "paper";
}) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <section
      id="faq"
      className={`relative overflow-clip section-y ${tone === "paper" ? "bg-paper" : "bg-bone"}`}
      aria-labelledby="faq-heading"
    >
      <Seam edge="top" color="linen" size="14%" />

      <div className="container-stax relative z-2">
        <SectionHead
          index={index}
          eyebrow={eyebrow}
          heading={heading}
          quiet={quiet}
          headingId="faq-heading"
          action={
            <p className="relative text-ink-soft">
              <span
                className="hand mr-1.5 inline-block text-hand-sm text-brick"
                style={{ ["--hand-tilt" as string]: "-2deg" }}
              >
                still stuck?
              </span>
              <span className="relative inline-block">
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-medium text-ink transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick"
                >
                  Just email us
                </a>
                <ArtUnderline className="absolute -bottom-2 left-0 h-2 w-full text-brick/60" />
              </span>{" "}
              and a person will answer.
            </p>
          }
        />

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-x-14 md:grid-cols-2">
            {columns.map((column, col) => (
              <div
                key={col}
                // Stacked on mobile the second column sits directly under the
                // first, so its top rule would double the last item's bottom
                // rule. It only earns a top border once the columns are side
                // by side.
                className={
                  col === 0 ? "border-t border-line" : "md:border-t md:border-line"
                }
              >
                {column.map((faq, i) => (
                  <Item key={faq.id} faq={faq} n={col * half + i + 1} />
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Torn edge 2 of 2 on the whole site: the light of the commitment
          sections tearing open onto the lamplit interior of Register. There
          is no third. */}
      <TornEdge color="night" />
    </section>
  );
}

function Item({ faq, n }: { faq: Faq; n: number }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <span className="shrink-0 text-eyebrow tnum text-ink-faint uppercase transition-colors duration-150 group-open:text-brick">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="flex-1 font-sans text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] transition-colors duration-150 ease-[var(--ease-out-soft)] group-hover:text-brick">
          {faq.question}
        </h3>

        {/* Plus rotates 45° into a cross; the circle fills amber when open —
            the lamp coming on beside the answer. */}
        <span
          aria-hidden="true"
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-[background-color,border-color] duration-300 group-open:border-transparent group-open:bg-amber"
        >
          <span className="absolute h-[1.5px] w-3.5 bg-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:bg-night" />
          <span className="absolute h-[1.5px] w-3.5 rotate-90 bg-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:bg-night" />
        </span>
      </summary>

      <p className="pr-10 pb-5 pl-9 text-[0.9375rem] leading-relaxed text-ink-soft">
        {faq.answer.replace(/^\[DRAFT\]\s*/, "")}
      </p>
    </details>
  );
}
