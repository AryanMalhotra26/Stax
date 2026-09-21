import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { LeadStatus } from "./leads";

/**
 * The admin panel's read model.
 *
 * Separate from `leadStore.d1.ts`, which exists to write one lead at a time
 * from the capture form and reads only by id or email. This is the other
 * shape entirely: arbitrary filters over the whole table, ordered by
 * recency, paged. Bolting it onto the store would have meant one module
 * serving two callers with nothing in common but a table name.
 *
 * ORDERED NEWEST FIRST, always. Score-ordering is what the routing copy and
 * the autoresponder talk about — "call within the hour" — but a person
 * opening this panel is asking "what came in since I last looked", and that
 * question has one right answer. Score is a filter here, not a sort.
 */

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "tour_booked",
  "toured",
  "applied",
  "leased",
  "lost",
];

/** Mirrors `scoreBand` — see lib/leads.ts. Kept as ranges for SQL. */
const BANDS = {
  hot: { min: 60, max: 1000 },
  warm: { min: 30, max: 59 },
  cold: { min: 0, max: 29 },
} as const;

export type Band = keyof typeof BANDS;

export type LeadFilters = {
  /** Substring match on email or name. */
  q?: string;
  status?: string;
  band?: string;
  moveIn?: string;
  bedrooms?: string;
  budget?: string;
  renterType?: string;
  floorPlanId?: string;
  source?: string;
  campaign?: string;
  landing?: string;
  /** ISO dates, inclusive. */
  from?: string;
  to?: string;
};

function db(): D1Database | null {
  try {
    return getCloudflareContext().env.DB ?? null;
  } catch {
    return null;
  }
}

/**
 * Build the WHERE clause.
 *
 * Every value is bound, never interpolated — the filters arrive from query
 * parameters, and this is a panel over the lead database, which is the single
 * worst place on this site to hand a string to SQLite. The column names are
 * the only thing written into the SQL text and they are literals in this
 * file, never anything a caller supplied.
 */
function where(f: LeadFilters): { sql: string; binds: unknown[] } {
  const clauses: string[] = [];
  const binds: unknown[] = [];

  const eq = (column: string, value: string | undefined) => {
    if (!value) return;
    clauses.push(`${column} = ?`);
    binds.push(value);
  };

  if (f.q) {
    // LIKE with both wildcards. `escape` is not needed for the panel's own
    // search box, but a lead whose name contains % would otherwise match
    // everything, which reads as a broken filter rather than a clever one.
    clauses.push("(email LIKE ? ESCAPE '\\' OR name LIKE ? ESCAPE '\\')");
    const needle = `%${f.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    binds.push(needle, needle);
  }

  eq("status", f.status);
  eq("move_in", f.moveIn);
  eq("bedrooms", f.bedrooms);
  eq("budget", f.budget);
  eq("renter_type", f.renterType);
  eq("floor_plan_id", f.floorPlanId);
  eq("utm_source", f.source);
  eq("utm_campaign", f.campaign);
  eq("landing_slug", f.landing);

  if (f.band && f.band in BANDS) {
    const { min, max } = BANDS[f.band as Band];
    clauses.push("score BETWEEN ? AND ?");
    binds.push(min, max);
  }

  if (f.from) {
    clauses.push("created_at >= ?");
    binds.push(f.from);
  }
  if (f.to) {
    // The caller sends a date, not an instant. Comparing a date against an
    // ISO timestamp excludes everything that arrived on the closing day, so
    // the range is widened to the end of it — otherwise "to: today" returns
    // nothing from today, which reads as data loss.
    clauses.push("created_at <= ?");
    binds.push(`${f.to}T23:59:59.999Z`);
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    binds,
  };
}

export type LeadRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  move_in: string;
  bedrooms: string | null;
  budget: string | null;
  renter_type: string | null;
  floor_plan_id: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  landing_slug: string | null;
  score: number;
  status: string;
  created_at: string;
};

const LIST_COLUMNS = `id, email, name, phone, move_in, bedrooms, budget,
  renter_type, floor_plan_id, utm_source, utm_campaign, landing_slug,
  score, status, created_at`;

export async function listLeads(
  filters: LeadFilters,
  page = 1,
  perPage = 50,
): Promise<{ rows: LeadRow[]; total: number } | null> {
  const DB = db();
  if (!DB) return null;

  const { sql, binds } = where(filters);
  const offset = (Math.max(1, page) - 1) * perPage;

  const [rows, count] = await Promise.all([
    DB.prepare(
      `SELECT ${LIST_COLUMNS} FROM leads ${sql}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
      .bind(...binds, perPage, offset)
      .all<LeadRow>(),
    DB.prepare(`SELECT COUNT(*) AS n FROM leads ${sql}`)
      .bind(...binds)
      .first<{ n: number }>(),
  ]);

  return { rows: rows.results ?? [], total: count?.n ?? 0 };
}

/**
 * The distinct values actually present, for the attribution filters.
 *
 * Source, campaign and landing page cannot be a fixed list the way move-in
 * and bedrooms can — they are whatever the ads team put in a URL last week.
 * Offering a dropdown of what the table really contains beats a free-text box
 * that silently returns nothing when somebody guesses the spelling wrong.
 */
export async function leadFacets(): Promise<{
  sources: string[];
  campaigns: string[];
  landings: string[];
} | null> {
  const DB = db();
  if (!DB) return null;

  const distinct = async (column: string) => {
    const r = await DB.prepare(
      `SELECT DISTINCT ${column} AS v FROM leads
        WHERE ${column} IS NOT NULL AND ${column} != ''
        ORDER BY v LIMIT 100`,
    ).all<{ v: string }>();
    return (r.results ?? []).map((x) => x.v);
  };

  const [sources, campaigns, landings] = await Promise.all([
    distinct("utm_source"),
    distinct("utm_campaign"),
    distinct("landing_slug"),
  ]);

  return { sources, campaigns, landings };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<string | null> {
  const DB = db();
  if (!DB) return null;

  const before = await DB.prepare(`SELECT status FROM leads WHERE id = ?`)
    .bind(id)
    .first<{ status: string }>();
  if (!before) return null;

  await DB.prepare(`UPDATE leads SET status = ?, updated_at = ? WHERE id = ?`)
    .bind(status, new Date().toISOString(), id)
    .run();

  return before.status;
}

/* ------------------------------------------------------------------------ *
 * Export
 * ------------------------------------------------------------------------ */

/** Every column, because an export that drops attribution is half an export. */
const EXPORT_COLUMNS = [
  "id", "email", "name", "phone", "move_in", "bedrooms", "budget",
  "renter_type", "floor_plan_id", "utm_source", "utm_medium", "utm_campaign",
  "utm_content", "utm_term", "fbclid", "gclid", "landing_slug", "referrer",
  "score", "status", "created_at", "updated_at",
] as const;

export async function exportLeads(
  filters: LeadFilters,
): Promise<{ csv: string; count: number } | null> {
  const DB = db();
  if (!DB) return null;

  const { sql, binds } = where(filters);
  const r = await DB.prepare(
    `SELECT ${EXPORT_COLUMNS.join(", ")} FROM leads ${sql}
     ORDER BY created_at DESC`,
  )
    .bind(...binds)
    .all<Record<string, unknown>>();

  const rows = r.results ?? [];
  const lines = [
    EXPORT_COLUMNS.join(","),
    ...rows.map((row) =>
      EXPORT_COLUMNS.map((c) => csvCell(row[c])).join(","),
    ),
  ];

  return { csv: lines.join("\r\n"), count: rows.length };
}

/**
 * One CSV cell.
 *
 * The leading apostrophe on anything starting =, +, - or @ is the formula
 * injection guard. Without it a lead whose "name" is
 * `=HYPERLINK("http://evil","click")` becomes a live formula the moment the
 * export is opened in Excel — and this export is a file that lands on the
 * leasing team's laptops, built from strings typed by strangers on a public
 * form. The apostrophe is how spreadsheets are told "this is text".
 */
function csvCell(value: unknown): string {
  if (value == null) return "";
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/* ------------------------------------------------------------------------ *
 * Audit
 * ------------------------------------------------------------------------ */

export async function audit(
  actor: string,
  action: string,
  detail: string | null,
  ip: string | null,
): Promise<void> {
  const DB = db();
  if (!DB) return;
  await DB.prepare(
    `INSERT INTO admin_audit (actor, action, detail, ip, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5)`,
  )
    .bind(actor, action, detail, ip, new Date().toISOString())
    .run();
}
