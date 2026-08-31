import { media, type Media } from "./generated/media";

/**
 * Panels for the pinned horizontal pan on the home page (§3.1 §5).
 * Image + one line each — a pan makes a list feel like a walk, but only if
 * each panel is a single idea.
 *
 * SIX, NOT SEVEN (Pass 6 §3.5). Two changes and both are consequences of the
 * floor plans coming down:
 *
 * "Two baths, mostly" is removed rather than rewritten. It is the best-written
 * line on the site — *it matters more in February than it does in September* —
 * and it only means anything to a reader who can see that the 2- and
 * 3-bedroom plans exist. With the plans hidden it is a claim about layouts
 * nobody can look at. It comes back with them; the line is recorded in
 * `config/features.ts` so it does.
 *
 * "Room outside" becomes parking, at the client's direction. The courtyards
 * survive inside the new card, which is where the phrase *parking kept to the
 * perimeter* now lives — it used to appear here AND on the About site plan
 * caption, describing the same thing twice.
 *
 * ORDER IS LOAD-BEARING. `AmenityPan` pairs each panel with a piece of line
 * art and a surface tone by index, so reordering this array reorders those
 * too. Both lists are the same length as this one on purpose.
 */

export type Amenity = {
  id: string;
  title: string;
  line: string;
  media: Media;
};

export const AMENITIES: Amenity[] = [
  {
    id: "shuttle",
    title: "The shuttle",
    line: "A private round-trip service to Brock, running all day. Fifteen minutes each way, included in your rent — no fare, no transfer.",
    media: media("exterior-street"),
  },
  {
    id: "furnished",
    title: "Already furnished",
    line: "Bed, desk, seating, dining. Move in with what fits in a car and nothing else.",
    media: media("bedroom"),
  },
  {
    id: "internet",
    title: "Internet included",
    line: "In the rent, live on day one. No account to open, no installation window to wait through.",
    media: media("living-upgrade-dining"),
  },
  {
    id: "kitchens",
    title: "Full kitchens",
    line: "Full-size fridge, range and dishwasher in every suite — not a bar fridge and a microwave.",
    media: media("kitchen-standard"),
  },
  {
    id: "entries",
    title: "Your own front door",
    line: "Stacked-townhouse blocks with private entries and balconies. A corridor is not the first thing you walk into.",
    media: media("exterior-garden"),
  },
  {
    id: "parking",
    title: "Lots of parking",
    line: "Surface parking for residents and visitors, kept to the perimeter so the courtyards stay for people. No permit lottery, no circling the block.",
    media: media("exterior-lawn"),
  },
];
