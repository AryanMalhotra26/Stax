import type { LeadFilters } from "@/lib/adminLeads";

/**
 * Query string → filters, shared by the list and the export.
 *
 * One parser for both, so an export can never quietly cover a different set
 * of rows than the table the person was looking at when they pressed the
 * button. That mismatch is the kind of bug nobody reports, because the file
 * looks plausible.
 */
export function filtersFromUrl(url: URL): LeadFilters {
  const p = url.searchParams;
  const get = (k: string) => p.get(k)?.trim() || undefined;
  return {
    q: get("q"),
    status: get("status"),
    band: get("band"),
    moveIn: get("moveIn"),
    bedrooms: get("bedrooms"),
    budget: get("budget"),
    renterType: get("renterType"),
    floorPlanId: get("floorPlanId"),
    source: get("source"),
    campaign: get("campaign"),
    landing: get("landing"),
    from: get("from"),
    to: get("to"),
  };
}

/** A compact, loggable description of what an export actually covered. */
export function describeFilters(f: LeadFilters): string {
  const parts = Object.entries(f)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`);
  return parts.length ? parts.join(" ") : "all";
}
