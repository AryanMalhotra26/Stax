import { media, type Media } from "./generated/media";

/**
 * Panels for the pinned horizontal pan on the home page (§3.1 §5).
 * Image + one line each — a pan makes a list feel like a walk, but only if
 * each panel is a single idea.
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
    line: "Complimentary round-trip service to Brock. Fifteen minutes, both directions, no fare, no transfer.",
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
    id: "bathrooms",
    title: "Two baths, mostly",
    line: "Every two- and three-bedroom suite has a second full bathroom. It matters more in February than it does in September.",
    media: media("bathroom"),
  },
  {
    id: "entries",
    title: "Your own front door",
    line: "Stacked-townhouse blocks with private entries and balconies. A corridor is not the first thing you walk into.",
    media: media("exterior-garden"),
  },
  {
    id: "courtyards",
    title: "Room outside",
    line: "Eight blocks arranged around landscaped courtyards, with parking kept to the perimeter.",
    media: media("exterior-lawn"),
  },
];
