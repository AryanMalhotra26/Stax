import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  scoreLead,
  type Lead,
  type LeadInput,
  type LeadStatus,
  type LeadStore,
} from "@/lib/leads";

/**
 * The production lead store: Cloudflare D1.
 *
 * `FileLeadStore` writes to `.leads/leads.json`, which is correct in
 * development and impossible in production — Workers has no writable
 * filesystem, so every submit returned a 500 the moment the site was deployed.
 * That is not a degraded form; it is the entire conversion path down.
 *
 * D1 rather than Supabase, for now. The interface was written with Supabase in
 * mind and that is still the right destination once there is a leasing team
 * with a dashboard to log into — but D1 is on the same free tier as the Worker
 * itself, needs no second vendor, no second set of credentials and no network
 * hop from the request path, and the column names below match the Postgres
 * schema exactly so the migration is a change of driver rather than of shape.
 */

/** Snake_case row, matching migrations/0001_leads.sql and the SQL schema. */
type Row = {
  id: string;
  email: string;
  move_in: string;
  name: string | null;
  phone: string | null;
  bedrooms: string | null;
  budget: string | null;
  renter_type: string | null;
  floor_plan_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  fbclid: string | null;
  gclid: string | null;
  landing_slug: string | null;
  referrer: string | null;
  score: number;
  status: string;
  created_at: string;
  updated_at: string;
};

/** Undefined, not null, so object spread merges behave like the file store. */
const opt = (v: string | null) => (v == null ? undefined : v);

function toLead(r: Row): Lead {
  return {
    id: r.id,
    email: r.email,
    moveIn: r.move_in as Lead["moveIn"],
    name: opt(r.name),
    phone: opt(r.phone),
    bedrooms: opt(r.bedrooms),
    budget: opt(r.budget),
    renterType: opt(r.renter_type),
    floorPlanId: opt(r.floor_plan_id),
    utmSource: opt(r.utm_source),
    utmMedium: opt(r.utm_medium),
    utmCampaign: opt(r.utm_campaign),
    utmContent: opt(r.utm_content),
    utmTerm: opt(r.utm_term),
    fbclid: opt(r.fbclid),
    gclid: opt(r.gclid),
    landingSlug: opt(r.landing_slug),
    referrer: opt(r.referrer),
    score: r.score,
    status: r.status as LeadStatus,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const COLUMNS = [
  "id", "email", "move_in", "name", "phone", "bedrooms", "budget",
  "renter_type", "floor_plan_id", "utm_source", "utm_medium", "utm_campaign",
  "utm_content", "utm_term", "fbclid", "gclid", "landing_slug", "referrer",
  "score", "status", "created_at", "updated_at",
] as const;

function values(lead: Lead) {
  return [
    lead.id, lead.email, lead.moveIn, lead.name ?? null, lead.phone ?? null,
    lead.bedrooms ?? null, lead.budget ?? null, lead.renterType ?? null,
    lead.floorPlanId ?? null, lead.utmSource ?? null, lead.utmMedium ?? null,
    lead.utmCampaign ?? null, lead.utmContent ?? null, lead.utmTerm ?? null,
    lead.fbclid ?? null, lead.gclid ?? null, lead.landingSlug ?? null,
    lead.referrer ?? null, lead.score, lead.status, lead.createdAt,
    lead.updatedAt,
  ];
}

export class D1LeadStore implements LeadStore {
  constructor(private db: D1Database) {}

  private async write(lead: Lead): Promise<Lead> {
    const cols = COLUMNS.join(", ");
    const marks = COLUMNS.map(() => "?").join(", ");
    // Every column except the identity and the creation stamp is replaced.
    const updates = COLUMNS.filter(
      (c) => c !== "id" && c !== "email" && c !== "created_at",
    )
      .map((c) => `${c} = excluded.${c}`)
      .join(", ");

    await this.db
      .prepare(
        `INSERT INTO leads (${cols}) VALUES (${marks})
         ON CONFLICT(email) DO UPDATE SET ${updates}`,
      )
      .bind(...values(lead))
      .run();
    return lead;
  }

  async upsert(input: Omit<LeadInput, "turnstileToken">): Promise<Lead> {
    const now = new Date().toISOString();
    const existing = await this.db
      .prepare("SELECT * FROM leads WHERE email = ?")
      .bind(input.email)
      .first<Row>();

    if (existing) {
      // Merge, never clobber: a returning visitor must not wipe enrichment
      // captured on an earlier visit (§7.3 step 4). Same rule as the file
      // store, and the reason the upsert cannot be a plain INSERT OR REPLACE.
      const merged: Lead = {
        ...toLead(existing),
        ...Object.fromEntries(
          Object.entries(input).filter(([, v]) => v !== undefined && v !== ""),
        ),
        updatedAt: now,
      };
      merged.score = scoreLead(merged);
      return this.write(merged);
    }

    const lead: Lead = {
      ...input,
      id: crypto.randomUUID(),
      score: scoreLead(input),
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    return this.write(lead);
  }

  async patch(id: string, patch: Partial<LeadInput>): Promise<Lead | null> {
    const row = await this.db
      .prepare("SELECT * FROM leads WHERE id = ?")
      .bind(id)
      .first<Row>();
    if (!row) return null;

    const merged: Lead = {
      ...toLead(row),
      ...Object.fromEntries(
        Object.entries(patch).filter(([, v]) => v !== undefined && v !== ""),
      ),
      updatedAt: new Date().toISOString(),
    };
    merged.score = scoreLead(merged);
    return this.write(merged);
  }

  async list(): Promise<Lead[]> {
    const { results } = await this.db
      .prepare("SELECT * FROM leads ORDER BY score DESC, created_at DESC")
      .all<Row>();
    return results.map(toLead);
  }
}

/**
 * The binding, or null when there isn't one.
 *
 * Returns null rather than throwing so `getLeadStore()` can fall back to the
 * file store in `next dev`, where there is no Cloudflare context at all.
 */
export function getD1(): D1Database | null {
  try {
    return getCloudflareContext().env.DB ?? null;
  } catch {
    return null;
  }
}
