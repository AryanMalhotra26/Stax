"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BEDROOM_OPTIONS,
  BUDGET_OPTIONS,
  MOVE_IN_OPTIONS,
  RENTER_TYPE_OPTIONS,
} from "@/lib/site";
import { FLOOR_PLANS } from "@/content/floorPlans";

/**
 * The leads table.
 *
 * Newest first, always — a person opening this is asking "what came in since
 * I last looked", and that question has one right answer. Score is a filter
 * here rather than a sort.
 *
 * Client-side because every control on it is interactive and the whole view
 * is per-request data that must never be cached. There is no SEO argument
 * and no first-paint argument for a page nobody can reach without signing in.
 */

type Row = {
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

type Facets = { sources: string[]; campaigns: string[]; landings: string[] };

/** What /api/admin/leads returns. `facets` only on page 1 — see the route. */
type LeadsResponse = {
  rows: Row[];
  total: number;
  page: number;
  perPage: number;
  facets: Facets | null;
};

const STATUSES = [
  "new",
  "contacted",
  "tour_booked",
  "toured",
  "applied",
  "leased",
  "lost",
] as const;

const BANDS = [
  { value: "hot", label: "Hot (60+)" },
  { value: "warm", label: "Warm (30–59)" },
  { value: "cold", label: "Cold (<30)" },
];

const EMPTY = {
  q: "",
  status: "",
  band: "",
  moveIn: "",
  bedrooms: "",
  budget: "",
  renterType: "",
  floorPlanId: "",
  source: "",
  campaign: "",
  landing: "",
  from: "",
  to: "",
};

type Filters = typeof EMPTY;

const label = (s: string) =>
  s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function LeadsPanel() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [rows, setRows] = useState<Row[]>([]);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 50;

  const query = useMemo(() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) p.set(k, v);
    return p;
  }, [filters]);

  /**
   * One in-flight request at a time.
   *
   * Typing in the search box fires a request per keystroke-burst, and
   * responses do not necessarily arrive in order — without this, a slow
   * early response can land after a fast later one and repaint the table
   * with results for a query the box no longer contains.
   */
  const inflight = useRef(0);

  const load = useCallback(
    async (p: number) => {
      const ticket = ++inflight.current;
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams(query);
        qs.set("page", String(p));
        qs.set("perPage", String(perPage));
        const res = await fetch(`/api/admin/leads?${qs}`, {
          credentials: "same-origin",
        });
        // The session ended mid-use. Middleware answers JSON here rather than
        // redirecting, so the reload is ours to trigger.
        if (res.status === 401) {
          window.location.replace("/admin/login");
          return;
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = (await res.json()) as LeadsResponse;
        if (ticket !== inflight.current) return;
        setRows(data.rows);
        setTotal(data.total);
        if (data.facets) setFacets(data.facets);
      } catch {
        if (ticket === inflight.current) setError("Could not load leads.");
      } finally {
        if (ticket === inflight.current) setLoading(false);
      }
    },
    [query],
  );

  // Debounced, because `q` changes on every keystroke and the others do not.
  // 250ms is below the threshold where a filter feels laggy and above the one
  // where typing a word costs five round trips.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1);
    }, 250);
    return () => clearTimeout(t);
  }, [load]);

  const set = (k: keyof Filters, v: string) =>
    setFilters((f) => ({ ...f, [k]: v }));

  const active = Object.values(filters).filter(Boolean).length;
  const pages = Math.max(1, Math.ceil(total / perPage));

  async function changeStatus(id: string, status: string) {
    const previous = rows;
    // Optimistic: the round trip is a single UPDATE and the dropdown feeling
    // instant is worth more than the half-second of certainty. Reverted below
    // if the write actually failed.
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setRows(previous);
      setError("Could not update that lead.");
    }
  }

  return (
    <div>
      {/* ---- Filters ------------------------------------------------- */}
      <div className="rounded-md border border-sand/15 bg-bark/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <input
            type="search"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search email or name"
            aria-label="Search email or name"
            className="min-h-10 w-full max-w-xs rounded-sm border border-sand/25 bg-espresso px-3 text-[0.9375rem] text-bone outline-none placeholder:text-grey/50 focus:border-brick-light sm:w-auto"
          />
          <div className="flex items-center gap-4">
            {active > 0 && (
              <button
                type="button"
                onClick={() => setFilters(EMPTY)}
                className="text-[0.9375rem] text-grey/75 underline underline-offset-4 hover:text-brick-light"
              >
                Clear {active} filter{active === 1 ? "" : "s"}
              </button>
            )}
            <a
              href={`/api/admin/leads/export?${query}`}
              className="min-h-10 rounded-full bg-brick px-5 py-2 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-bone hover:bg-brick-dark"
            >
              Export CSV
            </a>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Status" value={filters.status} onChange={(v) => set("status", v)}
            options={STATUSES.map((s) => ({ value: s, label: label(s) }))} />
          <Select label="Score" value={filters.band} onChange={(v) => set("band", v)}
            options={BANDS} />
          <Select label="Move-in" value={filters.moveIn} onChange={(v) => set("moveIn", v)}
            options={MOVE_IN_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          <Select label="Bedrooms" value={filters.bedrooms} onChange={(v) => set("bedrooms", v)}
            options={BEDROOM_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          <Select label="Budget" value={filters.budget} onChange={(v) => set("budget", v)}
            options={BUDGET_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          <Select label="Renter type" value={filters.renterType} onChange={(v) => set("renterType", v)}
            options={RENTER_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
          <Select label="Floor plan" value={filters.floorPlanId} onChange={(v) => set("floorPlanId", v)}
            options={FLOOR_PLANS.map((p) => ({ value: p.id, label: p.name }))} />
          <Select label="Source" value={filters.source} onChange={(v) => set("source", v)}
            options={(facets?.sources ?? []).map((s) => ({ value: s, label: s }))} />
          <Select label="Campaign" value={filters.campaign} onChange={(v) => set("campaign", v)}
            options={(facets?.campaigns ?? []).map((s) => ({ value: s, label: s }))} />
          <Select label="Landing page" value={filters.landing} onChange={(v) => set("landing", v)}
            options={(facets?.landings ?? []).map((s) => ({ value: s, label: s }))} />
          <Field label="From">
            <input type="date" value={filters.from} onChange={(e) => set("from", e.target.value)}
              className="min-h-10 w-full rounded-sm border border-sand/25 bg-espresso px-3 text-[0.9375rem] text-bone outline-none focus:border-brick-light" />
          </Field>
          <Field label="To">
            <input type="date" value={filters.to} onChange={(e) => set("to", e.target.value)}
              className="min-h-10 w-full rounded-sm border border-sand/25 bg-espresso px-3 text-[0.9375rem] text-bone outline-none focus:border-brick-light" />
          </Field>
        </div>
      </div>

      {/* ---- Results ------------------------------------------------- */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-[0.9375rem] text-grey/75" aria-live="polite">
          {loading ? "Loading…" : `${total} lead${total === 1 ? "" : "s"}`}
          {active > 0 && !loading && " matching"}
        </p>
        {pages > 1 && (
          <div className="flex items-center gap-3 text-[0.9375rem] text-grey/75">
            <button type="button" disabled={page <= 1}
              onClick={() => { const p = page - 1; setPage(p); load(p); }}
              className="rounded-xs px-2 py-1 hover:text-brick-light disabled:opacity-40">
              ← Prev
            </button>
            <span className="tnum">{page} / {pages}</span>
            <button type="button" disabled={page >= pages}
              onClick={() => { const p = page + 1; setPage(p); load(p); }}
              className="rounded-xs px-2 py-1 hover:text-brick-light disabled:opacity-40">
              Next →
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-sm border border-brick-light/40 bg-brick/15 px-4 py-3 text-[0.9375rem] text-bone">
          {error}
        </p>
      )}

      {!loading && rows.length === 0 && !error && (
        <p className="mt-10 text-grey/60">
          {active > 0 ? "No leads match those filters." : "No leads yet."}
        </p>
      )}

      {rows.length > 0 && (
        // The table is wider than a laptop at these column counts, so it
        // scrolls inside its own box. The page itself must never scroll
        // sideways.
        <div className="mt-4 overflow-x-auto rounded-md border border-sand/15">
          <table className="w-full min-w-[60rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-sand/15 bg-bark/40">
                {["Received", "Email", "Name", "Phone", "Move-in", "Score", "Source", "Status"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-sans text-eyebrow uppercase text-light-grey">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-sand/10 last:border-0 hover:bg-bark/30">
                  <td className="px-4 py-3 whitespace-nowrap tnum text-grey/75">
                    {new Date(r.created_at).toLocaleDateString(undefined, {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${r.email}`} className="text-bone underline decoration-transparent underline-offset-4 hover:decoration-brick-light">
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-grey/75">{r.name || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-grey/75">
                    {r.phone ? <a href={`tel:${r.phone}`} className="hover:text-brick-light">{r.phone}</a> : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-grey/75">
                    {MOVE_IN_OPTIONS.find((o) => o.value === r.move_in)?.label ?? r.move_in}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><ScoreBadge score={r.score} /></td>
                  <td className="px-4 py-3 text-grey/75">
                    {r.utm_source || r.landing_slug || "direct"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      aria-label={`Status for ${r.email}`}
                      onChange={(e) => changeStatus(r.id, e.target.value)}
                      className="min-h-9 rounded-sm border border-sand/25 bg-espresso px-2 text-[0.875rem] text-bone outline-none focus:border-brick-light"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{label(s)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Mirrors `scoreBand` in lib/leads.ts — hot 60+, warm 30–59, cold below. */
function ScoreBadge({ score }: { score: number }) {
  const band = score >= 60 ? "hot" : score >= 30 ? "warm" : "cold";
  const tone =
    band === "hot"
      ? "bg-brick text-white"
      : band === "warm"
        ? "bg-sand/25 text-bone"
        : "bg-sand/10 text-grey/75";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-eyebrow uppercase ${tone}`}>
      <span className="tnum">{score}</span> {band}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-eyebrow uppercase text-grey/60">{label}</span>
      {children}
    </label>
  );
}

function Select({
  label: name, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={name}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options.length === 0}
        className="min-h-10 w-full rounded-sm border border-sand/25 bg-espresso px-2.5 text-[0.9375rem] text-bone outline-none focus:border-brick-light disabled:opacity-40"
      >
        {/* "Any", not an empty string with no label — a blank first option
            reads as a bug rather than as the absence of a filter. */}
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}
