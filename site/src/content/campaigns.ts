import { media, type Media } from "./generated/media";

/**
 * Mirrors the `campaigns` table (§5). Each row is a `/l/[slug]` ad
 * destination with its own headline, bullets and hero.
 *
 * The point of this table is that a new ad angle is a row, not a deploy
 * (§3.5). Right now the rows live here; once the admin panel is wired to
 * Supabase, `getCampaign` becomes a query and nothing else changes.
 *
 * Four starting angles, one per audience the copy implies: the student who
 * knows they're coming, the group, the parent, and the shuttle-led
 * convenience pitch.
 */

export type Campaign = {
  slug: string;
  headline: string;
  subhead: string;
  bullets: string[];
  heroMedia: Media;
  ctaLabel: string;
  /** Message-matched trust line under the second form. */
  trustLine: string;
  isActive: boolean;
};

export const CAMPAIGNS: Campaign[] = [
  {
    slug: "brock-2027",
    headline: "New student housing at Brock. September 2027.",
    subhead:
      "248 furnished suites with a complimentary shuttle to campus. Registration is open — floor plans and pricing go to the list first.",
    bullets: [
      "Complimentary round-trip shuttle to Brock, about 15 minutes",
      "Fully furnished suites with internet included",
      "Studio, 1, 2 and 3 bedroom options",
    ],
    heroMedia: media("exterior-street"),
    ctaLabel: "Get floor plans & pricing",
    trustLine: "No spam, no obligation. Unsubscribe from any email in one click.",
    isActive: true,
  },
  {
    slug: "shuttle",
    headline: "Fifteen minutes to campus. No car, no bus pass.",
    subhead:
      "Stax runs a complimentary round-trip shuttle to Brock University, included in your rent. Register for pricing and lease dates.",
    bullets: [
      "Free round-trip shuttle, both directions, no fare",
      "Starbucks across the street, groceries a short walk away",
      "Fully furnished with internet included",
    ],
    heroMedia: media("exterior-evening"),
    ctaLabel: "Get pricing & shuttle times",
    trustLine: "Registering takes 15 seconds and commits you to nothing.",
    isActive: true,
  },
  {
    slug: "roommates",
    headline: "Three bedrooms. Two bathrooms. One group chat.",
    subhead:
      "Three-bedroom suites built for groups, with per-room leases so you aren't chasing anyone for rent. Opening September 2027 near Brock.",
    bullets: [
      "Three comparably sized bedrooms — no bad room",
      "Two full bathrooms in every three-bedroom suite",
      "Lease by the room or as a group",
    ],
    heroMedia: media("living-upgrade-dining"),
    ctaLabel: "Get the 3-bedroom plans",
    trustLine: "One person registers, everyone gets the floor plans. Unsubscribe anytime.",
    isActive: true,
  },
  {
    slug: "parents",
    headline: "Student housing you don't have to worry about.",
    subhead:
      "Brand-new, furnished, and a complimentary shuttle to Brock so there's no late-night walk home. Register for floor plans and pricing.",
    bullets: [
      "Purpose-built and brand new for September 2027",
      "Complimentary round-trip shuttle to campus",
      "Furnished suites with internet included — nothing to buy",
    ],
    heroMedia: media("exterior-lawn"),
    ctaLabel: "Get floor plans & pricing",
    trustLine: "We'll email you the plan pack. No calls unless you ask for one.",
    isActive: true,
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug && c.isActive);
}

export const activeCampaignSlugs = CAMPAIGNS.filter((c) => c.isActive).map(
  (c) => c.slug,
);
