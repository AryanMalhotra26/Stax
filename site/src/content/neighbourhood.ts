/**
 * Everything in this file is drawn from the client's written copy. Walk and
 * drive times are approximate and flagged as such in the UI — publishing a
 * precise "4 min walk" you cannot defend is a liability, not a selling point.
 *
 * TODO(client): confirm times against the final civic address.
 */

export type Landmark = {
  name: string;
  category: "campus" | "grocery" | "essentials" | "food" | "coffee";
  /* `x` / `y` removed with the schematic map they positioned. The section
     shows a photograph of the neighbourhood now; the walk times beside it
     were always the real content, and they never needed coordinates. */
  time: string;
  mode: "shuttle" | "walk" | "drive";
  /** Position on the schematic map, as % of the plate. */
  featured?: boolean;
};

export const LANDMARKS: Landmark[] = [
  {
    name: "Brock University",
    category: "campus",
    time: "15 min",
    mode: "shuttle",
    featured: true,
  },
  { name: "Starbucks", category: "coffee", time: "2 min", mode: "walk", featured: true },
  { name: "No Frills", category: "grocery", time: "6 min", mode: "walk", featured: true },
  { name: "FreshCo", category: "grocery", time: "9 min", mode: "walk" },
  { name: "Walmart", category: "essentials", time: "8 min", mode: "walk", featured: true },
  { name: "Canadian Tire", category: "essentials", time: "9 min", mode: "walk" },
  { name: "Shoppers Drug Mart", category: "essentials", time: "5 min", mode: "walk" },
  { name: "Pet Valu", category: "essentials", time: "6 min", mode: "walk" },
];

/** Rendered as a plain list under the map — no pin, no coordinates needed. */
export const FOOD_NEARBY = [
  "McDonald's",
  "Subway",
  "Wendy's",
  "Burger King",
  "Arby's",
];

export const NEIGHBOURHOOD_COPY = {
  heading: "Everything you need is close to home",
  body: "Start your morning with Starbucks across the street, pick up groceries at No Frills or FreshCo, and handle everyday errands at Walmart, Canadian Tire, Shoppers Drug Mart and Pet Valu — then take the shuttle to campus and back.",
};
