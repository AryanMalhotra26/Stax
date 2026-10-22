import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { INSIDE } from "@/content/inside";
import { sectionIndex } from "@/content/sections";

/**
 * What is actually in the suite, as a list.
 *
 * WHY IT EXISTS. The client's note was that in-suite laundry and "all other
 * benefits we have previously listed" barely appear on the site. They were
 * right: the walkthrough carries six amenities because a pan needs a
 * photograph per card, and laundry, air conditioning, the kitchen spec and
 * the bathroom spec have never been rendered. Those four were therefore
 * invisible on a page selling a furnished suite, while page 3 of the printed
 * flyer leads with them.
 *
 * So this is the flyer's own "WHAT'S INSIDE!" grid, in the flyer's order,
 * carried onto the site. No images, which is the point — a list that needs no
 * render can hold everything, and the things with no render are precisely the
 * ones that were missing.
 *
 * IT TAKES THE SLOT THE TWO POSITIONING CARDS VACATED, and that is a tonal
 * decision as much as an editorial one. Bone between the linen shuttle
 * section and the image band into night is the step the page was already
 * built around; dropping the cards and putting nothing here would have left
 * linen running straight into the bridge. It also replaces an argument with
 * an inventory, which is what the client asked for in the same breath — the
 * cards asked the reader to agree that a house share is bad, this tells them
 * what they get.
 *
 * Two columns, not three. Ten items in threes leaves a row of one, and each
 * line is a sentence rather than a label — at three across the measure drops
 * under forty characters and every item wraps to four lines.
 */
export function Inside() {
  return (
    <section
      id="inside"
      className="relative overflow-clip bg-bone pt-loose pb-normal"
    >
      {/* linen → bone is the smallest step on the page, so the shortest ramp:
          a long gradient across a Δ this small reads as a smudge. Same
          treatment the section this replaces used for the same boundary. */}
      <Seam edge="top" color="linen" size="sm" />

      <div className="container-stax relative z-2">
        <SectionHead
          index={sectionIndex("inside")}
          eyebrow="Inside every suite"
          heading="Furnished, connected, and yours."
          quiet="Laundry, air conditioning and internet included — not extras."
        />

        <ul className="mt-10 grid gap-x-10 gap-y-0 md:mt-14 md:grid-cols-2 md:gap-x-16">
          {INSIDE.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06} as="li">
              {/* The rule is on the top of every item rather than the bottom
                  of all but the last, so the two columns start level and the
                  grid reads as a table rather than as a pile. */}
              <div className="border-t border-line py-5 md:py-6">
                <p className="font-sans text-[1.0625rem] font-medium text-ink">
                  {item.title}
                </p>
                <p className="mt-1.5 max-w-prose leading-relaxed text-ink-soft">
                  {item.line}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
