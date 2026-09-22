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
 *
 * TWO RULES THESE ROWS HAVE TO KEEP, because ad copy is the easiest place on
 * a site for a claim to survive after the site has stopped making it:
 *
 * NEVER SAY REGISTRATION IS OPEN. The interest list opens Fall 2026 and the
 * client has said so explicitly. `brock-2027` claimed it was open already.
 *
 * "PRIVATE" IS THE DIFFERENTIATOR, "INCLUDED" IS THE PROMISE. Anyone can
 * offer a bus pass; a residents-only route running all day is the thing
 * nobody else near Brock has. Where a bullet is describing what you get for
 * your rent it still says included, because that is the commitment.
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
      "248 furnished suites with a private shuttle to campus, running all day. Join the interest list and floor plans and lease dates go to it first.",
    bullets: [
      "Private shuttle to Brock roughly every 15 minutes, included",
      "Fully furnished suites with internet included",
      "Studio, 1, 2 and 3 bedroom options",
    ],
    heroMedia: media("exterior-street"),
    ctaLabel: "Get the floor plans",
    trustLine: "No spam, no obligation. Unsubscribe from any email in one click.",
    isActive: true,
  },
  {
    slug: "shuttle",
    headline: "A shuttle every fifteen minutes. No car required.",
    subhead:
      "Stax runs a private shuttle to Brock University roughly every fifteen minutes, both directions, included in your rent. Register for floor plans and lease dates.",
    bullets: [
      "Private shuttle roughly every 15 minutes, both directions",
      "Starbucks across the street, groceries a short walk away",
      "Fully furnished with internet included",
    ],
    heroMedia: media("exterior-evening"),
    ctaLabel: "Get plans & shuttle times",
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
      "Brand-new, furnished, and a private shuttle to Brock so there's no late-night walk home. Register for floor plans and lease dates.",
    bullets: [
      "Purpose-built and brand new for September 2027",
      "Private round-trip shuttle to campus, included",
      "Furnished suites with internet included — nothing to buy",
    ],
    heroMedia: media("exterior-lawn"),
    ctaLabel: "Get the floor plans",
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
