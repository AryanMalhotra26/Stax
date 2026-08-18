import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import type { Faq } from "@/content/faqs";
import { publishedFaqs } from "@/content/faqs";
import { SITE } from "@/lib/site";

/**
 * Objection-ordered FAQ (§3.1 §9) — kills the reasons people leave.
 *
 * Two columns rather than one. The previous version stacked ten rows in a
 * single column beside an empty half-width heading block, which ran over a
 * full screen of height and read as a wall. Splitting into two columns halves
 * the height without dropping a single answer, and puts the dead left column
 * to work.
 *
 * Reading order stays vertical within each column, so the objection ordering
 * survives: the questions most likely to end the visit sit at the top of
 * column one.
 *
 * Built on native <details>/<summary> — correct keyboard and screen-reader
 * behaviour for free, works before hydration, ships no JS. Because each column
 * is its own flow, opening an item pushes only that column, so the other one
 * never jumps under the cursor.
 */
export function FaqSection({
  items = publishedFaqs,
  heading = "Questions people actually ask",
  eyebrow = "FAQ",
  index = "06",
  tone = "light",
}: {
  items?: Faq[];
  heading?: string;
  eyebrow?: string;
  index?: string;
  tone?: "light" | "paper";
}) {
  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <section
      id="faq"
      className={`grid-rules ${tone === "paper" ? "bg-paper" : "bg-bone"}`}
      aria-labelledby="faq-heading"
    >
      <div className="container-stax section-y">
        <SectionHead
          index={index}
          eyebrow={eyebrow}
          heading={heading}
          headingId="faq-heading"
          action={
            <p className="text-ink-soft">
              Still stuck?{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-ink underline underline-offset-4 transition-colors hover:text-brick"
              >
                Email us
              </a>{" "}
              and a person will answer.
            </p>
          }
        />

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-x-14 md:grid-cols-2">
            {columns.map((column, col) => (
              <div
                key={col}
                // Stacked on mobile the second column sits directly under the
                // first, so its top rule would double the last item's bottom
                // rule. It only earns a top border once the columns are
                // side by side.
                className={col === 0 ? "border-t border-line" : "md:border-t md:border-line"}
              >
                {column.map((faq, i) => (
                  <Item key={faq.id} faq={faq} n={col * half + i + 1} />
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Item({ faq, n }: { faq: Faq; n: number }) {
  return (
    <details className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-eyebrow tnum shrink-0 text-ink-faint transition-colors group-open:text-brick">
          {String(n).padStart(2, "0")}
        </span>
        <h3 className="flex-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em]">
          {faq.question}
        </h3>
        <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0" aria-hidden="true">
          <span className="absolute top-1/2 left-0 h-[1.5px] w-3.5 -translate-y-1/2 bg-ink" />
          <span className="absolute top-1/2 left-0 h-[1.5px] w-3.5 -translate-y-1/2 rotate-90 bg-ink transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-0" />
        </span>
      </summary>
      <p className="pr-8 pb-5 pl-9 text-[0.9375rem] leading-relaxed text-ink-soft">
        {faq.answer.replace(/^\[DRAFT\]\s*/, "")}
      </p>
    </details>
  );
}
