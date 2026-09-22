import { FEATURES } from "@/config/features";

/**
 * The home page's numbered sections, in the order they are read.
 *
 * The eyebrow numerals used to be string literals in six components, which is
 * fine until a section moves. Pass 7 moved four of them at once — amenities
 * to the top, the neighbourhood above the property story, a new shuttle
 * section in between — and deriving the numerals from one array is what made
 * that a reordering rather than a renumbering exercise.
 *
 * THE ORDER HERE IS THE PAGE'S ARGUMENT: what you get, where you are, how you
 * reach campus, why this rather than the alternative. Development statistics
 * come last or not at all.
 *
 * Two sections are deliberately absent. The Idea — "Close enough to campus" —
 * opens on a hand-written question rather than an eyebrow, and numbering it
 * would mean giving up the one masthead on the page that is not a label. Its
 * absence is invisible because no numeral is skipped: the array IS the
 * sequence, so what renders is always 01, 02, 03 with nothing missing.
 * Floor Plans is absent for a different reason — it is behind a flag.
 */
export const HOME_SECTIONS = [
  { id: "included", label: "What's included" },
  { id: "neighbourhood", label: "The neighbourhood" },
  { id: "shuttle", label: "Getting to campus" },
  ...(FEATURES.floorPlans ? [{ id: "plans", label: "Floor plans" }] : []),
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
