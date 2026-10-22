/**
 * Everything a suite comes with, in one list.
 *
 * WHY THIS EXISTS SEPARATELY FROM `AMENITIES`. The walkthrough pan needs a
 * photograph per card, so it can only carry things that have been rendered —
 * six of them. The client asked for in-suite laundry and "all other benefits
 * we have previously listed" to be present, and laundry, air conditioning and
 * the bathroom spec have no render. A list that needs no image can carry all
 * of it, which is exactly what page 3 of the A5 flyer does: a plain grid
 * headed "WHAT'S INSIDE!".
 *
 * So this is the print piece's own list, in the print piece's own order of
 * importance, rather than a second opinion about it. Where the flyer and the
 * site disagreed the flyer won — it is the thing a prospect is holding.
 *
 * Deliberately NOT in the hero strip. That strip is scanned in a second and
 * the client picked the six that belong there; ten chips would turn it back
 * into the five-row wall it just stopped being.
 */

export type InsideItem = {
  title: string;
  line: string;
};

export const INSIDE: InsideItem[] = [
  {
    title: "Fully furnished",
    line: "Bed, desk, seating and dining — all of it new, none of it yours to buy. Move in with what fits in a car.",
  },
  {
    title: "In-suite laundry",
    line: "A washer and dryer of your own. No quarter hunting, no laundry-room queue, no carrying anything down a corridor.",
  },
  {
    title: "Air conditioning",
    line: "In every suite, for the warm months at each end of the year and the exam season in between.",
  },
  {
    title: "Free high-speed internet",
    line: "Included in the rent and live on day one. No account to open, no installation window to wait through.",
  },
  {
    title: "Modern kitchens",
    line: "Quartz countertops and stainless steel appliances — a kitchen built for cooking, not for getting by.",
  },
  {
    title: "New bathrooms",
    line: "Quartz vanities and standing showers, in a suite nobody has used before you.",
  },
  {
    title: "Up to 10 ft ceilings",
    line: "Room above your head as well as around you — the thing you notice walking in.",
  },
  {
    title: "Private shuttle to Brock",
    line: "A private service for residents only, both directions through the term, included in your rent.",
  },
  {
    title: "24-hour security cameras",
    line: "Covering the entries, the courtyards and the parking, recording around the clock.",
  },
  {
    title: "248 brand-new suites",
    line: "Never-lived-in homes in a community that was designed, from the ground up, to be exactly this.",
  },
];
