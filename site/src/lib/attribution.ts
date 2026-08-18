"use client";

/**
 * Attribution capture (§9 item 3).
 *
 * The non-obvious part is persistence. Someone lands on /l/brock-2027, reads
 * it, clicks through to /residences, and converts there. Reading UTMs from
 * `location.search` at submit time would attribute that lead to nothing.
 * First-touch values are stashed in sessionStorage on first load and reused
 * for the rest of the session.
 */

const KEY = "stax_attr";

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  gclid?: string;
  landingSlug?: string;
  referrer?: string;
};

const PARAM_MAP: Record<string, keyof Attribution> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  fbclid: "fbclid",
  gclid: "gclid",
};

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Attribution;
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};

  for (const [param, field] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) fresh[field] = value.slice(0, 255);
  }

  // Landing route is recorded on the first page of the session only.
  if (!stored.landingSlug) {
    fresh.landingSlug = window.location.pathname;
  }
  if (!stored.referrer && document.referrer) {
    // Ignore self-referrals — an internal navigation is not a referrer.
    try {
      const ref = new URL(document.referrer);
      if (ref.host !== window.location.host) {
        fresh.referrer = document.referrer.slice(0, 500);
      }
    } catch {
      /* malformed referrer, ignore */
    }
  }

  // First touch wins: never let a later pageview overwrite the ad that paid
  // for the session.
  const merged = { ...fresh, ...stored };

  try {
    sessionStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* private mode — attribution degrades, form still works */
  }

  return merged;
}

/**
 * Funnel events (§9). The gap between `form_start` and `lead_submit` is the
 * abandonment rate, and it's the only number that says whether the form or
 * the offer is the problem (§7.1).
 */
export type FunnelEvent =
  | "form_start"
  | "lead_submit"
  | "enrich_complete"
  | "register_click";

export function track(event: FunnelEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Meta pixel, when present. event_id must match what the server sends to
  // CAPI or Meta counts the lead twice (§7.3).
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  if (fbq && event === "lead_submit") {
    fbq("track", "Lead", { value: payload.score ?? 0, currency: "CAD" }, {
      eventID: payload.id,
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[funnel] ${event}`, payload);
  }
}
