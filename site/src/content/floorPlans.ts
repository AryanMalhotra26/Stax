import { media, type Media } from "./generated/media";

/**
 * Mirrors the `floor_plans` table (§5). Reading these from Supabase later
 * means replacing `FLOOR_PLANS` with a query — the component contracts below
 * (`FloorPlan`) stay identical.
 *
 * The unit mix, areas and bathroom counts below are the REAL schedule, taken
 * from the developer's own "455 Welland Floor Plans with Unit Mix" package
 * (Sphere Developments, June 2026). They replace a placeholder breakdown that
 * reconciled to the published totals without being the actual split.
 *
 * The published totals survived the check: the eleven plans sum to exactly
 * 248 units and 551 beds. Every square footage did not — each of the four
 * ranges here was wrong, the one-bedroom by 60-150 sq ft, which is the kind
 * of number a prospect measures furniture against.
 *
 * Each row below is a CATEGORY, not a plan. The real package names eleven
 * individual layouts and the site groups them into four, because four sticky
 * cards is the section's design and eleven would be a list. The names and
 * per-layout areas are carried in `layouts` so nothing is lost and a plan
 * detail page can use them later:
 *
 *   Studio   Harmony 371 x25 · Nature 403 x5 · Bliss 442 x8          = 38
 *   1 bed    Oasis 453 x17 · Luxe 463 x5                             = 22
 *   2 bed    Aura 794 x61 · Blossom 834 x12                          = 73
 *   3 bed    Nirvana 899 x86 · Grace 979 x5 · Radiance 987 x12
 *            · Zenith 1076 x12                                       = 115
 *
 * TODO(client): the package is branded ZENSCAPE throughout, not Stax. Confirm
 * whether that is the townhome product line, an earlier name, or a different
 * project at the same address before any of these layout names go on the site.
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
  /** The individual named layouts this category groups. */
  layouts: { name: string; sqft: number; units: number; baths: number }[];
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
    sqftMin: 371,
    sqftMax: 442,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 38,
    bedsPerUnit: 1,
    layouts: [
      { name: "Harmony", sqft: 371, units: 25, baths: 1 },
      { name: "Nature", sqft: 403, units: 5, baths: 1 },
      { name: "Bliss", sqft: 442, units: 8, baths: 1 },
    ],
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
    sqftMin: 453,
    sqftMax: 463,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 22,
    bedsPerUnit: 1,
    layouts: [
      { name: "Oasis", sqft: 453, units: 17, baths: 1 },
      { name: "Luxe", sqft: 463, units: 5, baths: 1 },
    ],
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
    sqftMin: 794,
    sqftMax: 834,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 73,
    bedsPerUnit: 2,
    layouts: [
      { name: "Aura", sqft: 794, units: 61, baths: 2 },
      { name: "Blossom", sqft: 834, units: 12, baths: 2 },
    ],
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
    bathrooms: 2.5,
    sqftMin: 899,
    sqftMax: 1076,
    startingRent: null,
    availableFrom: "2027-09-01",
    unitsTotal: 115,
    bedsPerUnit: 3,
    layouts: [
      { name: "Nirvana", sqft: 899, units: 86, baths: 2 },
      { name: "Grace", sqft: 979, units: 5, baths: 2.5 },
      { name: "Radiance", sqft: 987, units: 12, baths: 2.5 },
      { name: "Zenith", sqft: 1076, units: 12, baths: 2.5 },
    ],
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
