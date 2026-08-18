import { media, type Media } from "./generated/media";

/**
 * Mirrors the `floor_plans` table (§5). Reading these from Supabase later
 * means replacing `FLOOR_PLANS` with a query — the component contracts below
 * (`FloorPlan`) stay identical.
 *
 * TODO(client): the bedroom mix below is a placeholder that reconciles to the
 * published totals (248 units / 551 beds) but is not the real breakdown.
 * Replace `unitsTotal` per plan with the actual schedule.
 *
 * TODO(client): `startingRent` is intentionally null. The building completes
 * September 2027 and rents are not set. Leaving it null renders
 * "Pricing released Spring 2027" — do not substitute a guess, a wrong rent on
 * a leasing site is a liability.
 */

export type FloorPlanSlug = "studio" | "one-bed" | "two-bed" | "three-bed";

export type FloorPlan = {
  id: string;
  slug: FloorPlanSlug;
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqftMin: number;
  sqftMax: number;
  /** null until pricing is released — renders as a register prompt. */
  startingRent: number | null;
  availableFrom: string;
  unitsTotal: number;
  bedsPerUnit: number;
  exposure: string;
  ceilingFt: number;
  description: string;
  features: string[];
  heroMedia: Media;
  sortOrder: number;
  isPublished: boolean;
};

export const FLOOR_PLANS: FloorPlan[] = [
  {
    id: "fp-studio",
    slug: "studio",
    name: "Studio",
    bedrooms: 0,
    bathrooms: 1,
    sqftMin: 385,
    sqftMax: 440,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 30,
    bedsPerUnit: 1,
    exposure: "South & west facing",
    ceilingFt: 9,
    description:
      "A single, well-planned room where the whole space works. Full kitchen along one wall, a sleeping zone that isn't the couch, and a window big enough to make the square footage irrelevant.",
    features: [
      "Full-size kitchen with dishwasher",
      "Fully furnished",
      "Three-piece bathroom",
      "Internet included",
      "In-suite storage",
    ],
    heroMedia: media("kitchen-standard"),
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "fp-one-bed",
    slug: "one-bed",
    name: "1 Bedroom",
    bedrooms: 1,
    bathrooms: 1,
    sqftMin: 520,
    sqftMax: 610,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 45,
    bedsPerUnit: 1,
    exposure: "Courtyard & street facing",
    ceilingFt: 9,
    description:
      "A separate bedroom with a door that closes. The living area stays a living area, which matters more in a study week than it does in September.",
    features: [
      "Separate bedroom with door",
      "Open kitchen and living area",
      "Fully furnished",
      "Internet included",
      "Private balcony on select units",
    ],
    heroMedia: media("living-upgrade-island"),
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "fp-two-bed",
    slug: "two-bed",
    name: "2 Bedroom",
    bedrooms: 2,
    bathrooms: 2,
    sqftMin: 720,
    sqftMax: 845,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 43,
    bedsPerUnit: 2,
    exposure: "Dual aspect",
    ceilingFt: 9,
    description:
      "Two bedrooms, two bathrooms. Split so neither room is the bad one, and nobody negotiates a shower schedule in February.",
    features: [
      "Two full bathrooms",
      "Split-plan bedrooms",
      "Fully furnished",
      "Internet included",
      "Shared living and dining",
    ],
    heroMedia: media("living-upgrade-dining"),
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "fp-three-bed",
    slug: "three-bed",
    name: "3 Bedroom",
    bedrooms: 3,
    bathrooms: 2,
    sqftMin: 980,
    sqftMax: 1120,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 130,
    bedsPerUnit: 3,
    exposure: "Dual aspect, most with balcony",
    ceilingFt: 9,
    description:
      "The one to take as a group. Three equal bedrooms off a shared living space large enough to actually be shared — and a kitchen that survives three people cooking in the same hour.",
    features: [
      "Three comparably sized bedrooms",
      "Two full bathrooms",
      "Fully furnished",
      "Internet included",
      "Balcony on most units",
      "Per-room leases available",
    ],
    heroMedia: media("bedroom"),
    sortOrder: 4,
    isPublished: true,
  },
];

export const planBySlug = Object.fromEntries(
  FLOOR_PLANS.map((p) => [p.slug, p]),
) as Record<FloorPlanSlug, FloorPlan>;

/** "385–440" — used on cards and in the plan selector. */
export function sqftRange(plan: FloorPlan) {
  return `${plan.sqftMin.toLocaleString()}–${plan.sqftMax.toLocaleString()}`;
}

export function bedroomLabel(plan: FloorPlan) {
  return plan.bedrooms === 0 ? "Studio" : `${plan.bedrooms} bed`;
}
