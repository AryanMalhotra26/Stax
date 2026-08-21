/**
 * Single source of truth for the facts that repeat across pages and JSON-LD.
 * Mirrors the `site_settings` table (§5) — moving this to the DB later means
 * changing where `SITE` is read from, not where it is used.
 */

export const SITE = {
  name: "Stax",
  legalName: "Stax Living",
  tagline: "Student Living Reimagined",
  description:
    "Brand-new student rentals near Brock University, designed for convenience, comfort, and community. 248 units, 551 beds, September 2027.",

  // Confirmed with the client, 21 Aug 2026: this is the registered domain on
  // the GoDaddy account. It drives every canonical tag, the sitemap, robots
  // and all OG metadata, so it is the one value here that cannot be a guess.
  url: "https://staxliving.ca",

  // TODO(client): replace with the real leasing contact details.
  email: "leasing@staxliving.ca",
  phone: "+1 (905) 000-0000",
  phoneHref: "tel:+19050000000",

  /**
   * TODO(client): CONFIRM. Sphere's own site lists 455 Welland Avenue,
   * St. Catharines as a purpose-built rental community of urban townhomes with
   * 248 residential units and 12 commercial units — the unit count matches Stax
   * exactly, and the ground-floor retail matches the street render. Treated as
   * the Stax address on that basis, but it is an inference, not something the
   * brand pack states. Verify before this goes live: the address drives the
   * local SEO schema and the neighbourhood walk times.
   */
  address: {
    street: "455 Welland Avenue",
    city: "St. Catharines",
    region: "ON",
    postalCode: "L2M 5V6",
    country: "CA",
  },

  geo: { lat: 43.1846, lng: -79.2201 },

  /** Developed by Sphere Developments — see content/about.ts. */
  developer: {
    name: "Sphere Developments",
    url: "https://spheredevelopments.ca",
    email: "contact@spheredevelopments.ca",
  },

  social: {
    instagram: "https://instagram.com/staxliving",
    tiktok: "https://tiktok.com/@staxliving",
  },

  /** The numbers that appear in the proof strip and the schema markup. */
  facts: {
    units: 248,
    beds: 551,
    blocks: 8,
    shuttleMinutes: 15,
    occupancy: "September 2027",
    occupancyShort: "Sept 2027",
  },
} as const;

/** Move-in intent options. Drives lead scoring — see `scoreLead`. */
export const MOVE_IN_OPTIONS = [
  { value: "sept_2027", label: "Sept 2027" },
  { value: "jan_2028", label: "Jan 2028" },
  { value: "sept_2028", label: "Sept 2028" },
  { value: "browsing", label: "Just looking" },
] as const;

export type MoveIn = (typeof MOVE_IN_OPTIONS)[number]["value"];

export const BEDROOM_OPTIONS = [
  { value: "studio", label: "Studio" },
  { value: "1", label: "1 bed" },
  { value: "2", label: "2 bed" },
  { value: "3", label: "3 bed" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under_1000", label: "Under $1,000" },
  { value: "1000_1400", label: "$1,000–1,400" },
  { value: "1400_1800", label: "$1,400–1,800" },
  { value: "1800_plus", label: "$1,800+" },
] as const;

export const RENTER_TYPE_OPTIONS = [
  { value: "student", label: "I'm a student" },
  { value: "parent", label: "I'm a parent" },
  { value: "group", label: "Group of friends" },
] as const;
