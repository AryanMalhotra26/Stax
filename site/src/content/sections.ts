import { FEATURES } from "@/config/features";

/**
 * The home page's numbered sections, in the order they are read.
 *
 * The eyebrow numerals used to be string literals in six components —
 * `02 · Floor plans`, `03 · The neighbourhood`, and so on — which is fine
 * until a section is removed. Hiding Floor Plans behind a flag would then
 * leave the page counting `01, 03, 04, 05, 06`, and the reader is being told
 * a section is missing at exactly the moment nobody wants them thinking
 * about it.
 *
 * Deriving the numerals from one array makes the sequence a consequence of
 * the page's shape rather than something to remember. Flip the flag and the
 * page renumbers itself.
 *
 * Two sections are deliberately absent. The Idea holds slot 01 but renders no
 * numeral — its masthead is a hand-written question, not an eyebrow — and it
 * is listed here because it is what makes Floor Plans 02. The walkthrough
 * carries an unnumbered eyebrow by design: it is the interior of the
 * building, not another stop on the argument.
 */
export const HOME_SECTIONS = [
  { id: "idea", label: "The Idea" },
  ...(FEATURES.floorPlans ? [{ id: "plans", label: "Floor plans" }] : []),
  { id: "neighbourhood", label: "The neighbourhood" },
  { id: "gallery", label: "Gallery" },
  { id: "commitments", label: "What you can hold us to" },
  { id: "faq", label: "FAQ" },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

/**
 * The two-digit eyebrow numeral for a section. Falls back to an empty string
 * rather than throwing: a section that has been flagged off should not be
 * able to take the page down from a stale reference.
 */
export function sectionIndex(id: HomeSectionId | string): string {
  const i = HOME_SECTIONS.findIndex((s) => s.id === id);
  return i === -1 ? "" : String(i + 1).padStart(2, "0");
}
