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
    "Brand-new student rentals near Brock University — furnished suites with your own front door, a private shuttle to campus, and internet included. Opening September 2027.",

  // Confirmed with the client, 21 Aug 2026: this is the registered domain on
  // the GoDaddy account. It drives every canonical tag, the sitemap, robots
  // and all OG metadata, so it is the one value here that cannot be a guess.
  url: "https://staxliving.ca",

  /**
   * Email only. The phone number is gone from the site entirely (Pass 6
   * §1.2) — it was a `000-0000` placeholder, so removing it is a cleanup as
   * much as a policy change, and a leasing address that is answered beats a
   * number that is not. Nothing here should grow a `phone` field back
   * without a real, staffed line behind it.
   */
  email: "info@staxliving.ca",

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

  /**
   * TODO(client): TikTok is deliberately absent. The link on the site was
   * `https://tiktok.com/@staxliving`, built on the same guessed handle that
   * turned out to be wrong for Instagram — and an unverified social link in
   * the footer is worse than no link, because it is a dead end on the one
   * element of the page that exists to prove the project is real. Supply the
   * real handle and add `tiktok` back here; the footer and the JSON-LD both
   * read from this object.
   */
  social: {
    instagram: "https://www.instagram.com/stax_living/",
  },

  /**
   * The numbers that appear in the proof strip and the schema markup.
   *
   * NO BED COUNT. `beds: 551` is gone at the client's direction — the site is
   * to read as the experience of living here rather than as a development
   * prospectus, and a bed count is the most prospectus-shaped number on it.
   * Suite count stays because it is what a renter is choosing between; the
   * bed total only answers a question an investor asks.
   *
   * NO SHUTTLE TIMING, of any kind. There is no journey time here and no
   * headway either, and that is deliberate rather than an omission waiting
   * to be filled.
   *
   * The site has now published two different fifteens — "fifteen minutes
   * each way" as a journey, then "every fifteen minutes" as a frequency —
   * and been corrected on both. An operating schedule for a building that
   * opens in September 2027 is not a fact yet; it is an intention, and a
   * leasing site is the wrong place to discover the difference. The claim is
   * that the shuttle is private, direct and included, all three of which are
   * true today and none of which depends on a timetable.
   *
   * Do not add a number back without an operator and a schedule behind it.
   */
  facts: {
    units: 248,
    blocks: 10,
    occupancy: "September 2027",
    occupancyShort: "Sept 2027",
  },

  /**
   * The published milestones, in one place because they appear in seven.
   *
   * They have already moved once — the site shipped with pricing in Spring
   * 2027 and leasing in Summer 2027, both of which were wrong by the time
   * anyone read them — and a date that lives in seven string literals moves
   * six of them. The About timeline holds the same values in narrative form;
   * these are the ones the rest of the site quotes.
   *
   * Note the order: pricing publishes BEFORE the interest list opens. That is
   * intentional and it is why the Register copy promises plans and lease
   * dates ahead of the public listing, not pricing.
   */
  /* `pricingReleased` and `registrationOpens` are gone, not updated.
     Both were in the past by Oct 2026 — the site was promising a pricing
     release that had already not happened, and advertising that the list
     "opens" in Fall 2026 while the form at the bottom of the page had been
     taking registrations for months. A date that has passed is worse than no
     date: it is the page telling a reader something they can check.

     Nothing replaced the pricing one, because there is no new date to give.
     The copy that quoted it now says pricing is not public yet, which is both
     true and the thing the client asked the rent answer to say. */
  dates: {
    leasingOpens: "Jan 2027",
  },
} as const;

/** Move-in intent options. Drives lead scoring — see `scoreLead`. */
/**
 * What the form offers. NOT the same list as `MOVE_IN_VALUES` in lib/leads.ts,
 * and the difference is deliberate.
 *
 * `jan_2028` is gone at the client's direction — there is no January lease
 * start, so offering one collects a preference that cannot be honoured. It
 * stays a valid value in the schema because leads captured before today
 * chose it, and a stored row has to keep validating and keep filtering in the
 * admin panel. Removing it here removes the button; removing it there would
 * orphan real people.
 */
export const MOVE_IN_OPTIONS = [
  { value: "sept_2027", label: "Sept 2027" },
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
