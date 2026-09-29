import { media, type Media } from "./generated/media";

/**
 * Panels for the pinned horizontal pan on the home page (§3.1 §5).
 * Image + one line each — a pan makes a list feel like a walk, but only if
 * each panel is a single idea.
 *
 * THE CLIENT'S OWN LIST, replacing the one this file grew over passes 5 and 6.
 *
 * Three things they previously asked for are not on it: full kitchens, your
 * own front door, and the parking card added at their direction in Pass 6.
 * None of them disappears from the site — the front door is the hero
 * annotation and the whole thesis of the Idea section, the kitchen is in the
 * "What comes with the suite?" answer, and parking is still in its own FAQ —
 * but they are no longer in the list a visitor scans first. Worth confirming
 * that is deliberate rather than an omission.
 *
 * "Up to 10 ft ceilings" is the client's figure and it does not match this
 * repo's plan data, which records `ceilingFt: 9` on all four layouts from the
 * developer's own schedule. "Up to" survives both readings if some units are
 * taller; if the schedule is simply out of date, floorPlans.ts is what needs
 * correcting. Flagged rather than silently reconciled.
 *
 * ORDER IS LOAD-BEARING. `AmenityPan` pairs each panel with a piece of line
 * art and a surface tone by index, so reordering this array reorders those
 * too. Both lists are the same length as this one on purpose.
 */

export type Amenity = {
  id: string;
  title: string;
  /**
   * Two or three words for the hero strip.
   *
   * Separate from `title` because the two are read in different places at
   * different sizes: `title` heads a card somebody has stopped at, `short`
   * is scanned at a glance in a row of six above the fold. "Already
   * furnished" is a good card heading and a poor label; "Furnished" is the
   * reverse.
   *
   * The list below is the client's, supplied 30 Sept 2026, and it is the one
   * place it lands: the hero strip and the walkthrough both read from here.
   */
  short: string;
  line: string;
  media: Media;
};

export const AMENITIES: Amenity[] = [
  {
    id: "furnished",
    title: "Fully furnished, brand new",
    short: "Fully furnished",
    line: "Bed, desk, seating and dining, all of it new and none of it yours to buy. Move in with what fits in a car.",
    media: media("bedroom"),
  },
  {
    id: "security",
    title: "24-hour security cameras",
    short: "24-hour security",
    line: "Cameras covering the entries, the courtyards and the parking, recording around the clock.",
    media: media("exterior-evening"),
  },
  {
    id: "shuttle",
    title: "Free private shuttle to Brock",
    short: "Free private shuttle",
    line: "A private service straight to Brock University, both directions, roughly every fifteen minutes. Residents only, and free.",
    media: media("shuttle"),
  },
  {
    id: "internet",
    title: "Free internet included",
    short: "Free internet",
    line: "In the rent and live on day one. No account to open, no installation window to wait through.",
    media: media("living-upgrade-dining"),
  },
  {
    id: "occupancy",
    title: "Available September 2027",
    short: "September 2027",
    line: "Doors open for the 2027\u201328 academic year. Register and you will have floor plans and lease dates before they are public.",
    media: media("exterior-street"),
  },
  {
    id: "ceilings",
    title: "Up to 10 ft ceilings",
    short: "Up to 10 ft ceilings",
    line: "Room above your head as well as around you \u2014 the thing you notice walking in and stop noticing by October, in the best way.",
    media: media("living-upgrade-island"),
  },
];
