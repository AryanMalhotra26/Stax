import { z } from "zod";
import { D1LeadStore, getD1 } from "@/lib/leadStore.d1";

/**
 * Lead schema + scoring + storage. Mirrors the `leads` table (§5).
 *
 * Storage is deliberately behind an interface. With no environment
 * configured it writes to a local JSON file so the form works end to end in
 * development; when SUPABASE_URL / SUPABASE_SERVICE_KEY are set it will use
 * Postgres instead. Nothing above this layer changes.
 */

export const MOVE_IN_VALUES = [
  "sept_2027",
  "jan_2028",
  "sept_2028",
  "browsing",
] as const;

export const LeadSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  moveIn: z.enum(MOVE_IN_VALUES),

  // Enrichment — all optional, all arriving after the first submit (§7.2)
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  bedrooms: z.string().trim().max(16).optional(),
  budget: z.string().trim().max(24).optional(),
  renterType: z.string().trim().max(24).optional(),
  floorPlanId: z.string().trim().max(64).optional(),

  // Attribution. Without these you are buying ads blind (§5, §9).
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  utmContent: z.string().trim().max(120).optional(),
  utmTerm: z.string().trim().max(120).optional(),
  fbclid: z.string().trim().max(255).optional(),
  gclid: z.string().trim().max(255).optional(),
  landingSlug: z.string().trim().max(120).optional(),
  referrer: z.string().trim().max(500).optional(),

  turnstileToken: z.string().optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export type Lead = Omit<LeadInput, "turnstileToken"> & {
  id: string;
  score: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "tour_booked"
  | "toured"
  | "applied"
  | "leased"
  | "lost";

/**
 * Scoring. Kept as a pure function so it can be unit-tested and so it matches
 * the generated column in Postgres exactly (§5).
 *
 * Weighting differs from the generic plan because this is a pre-construction
 * student lease-up: the term someone names is the strongest signal available,
 * and a group or parent is worth more than a solo browser because they
 * convert a whole suite rather than a bed.
 *
 * Routing: >= 60 call within the hour, 30-59 nurture, < 30 newsletter (§0.3).
 */
export function scoreLead(lead: Partial<LeadInput>): number {
  let score = 0;

  switch (lead.moveIn) {
    case "sept_2027":
      score += 40;
      break;
    case "jan_2028":
      score += 30;
      break;
    case "sept_2028":
      score += 15;
      break;
    default:
      score += 5;
  }

  if (lead.phone) score += 20;
  if (lead.budget) score += 15;
  if (lead.floorPlanId || lead.bedrooms) score += 15;
  if (lead.renterType === "group" || lead.renterType === "parent") score += 10;

  return score;
}

export function scoreBand(score: number): "hot" | "warm" | "cold" {
  if (score >= 60) return "hot";
  if (score >= 30) return "warm";
  return "cold";
}

/* ------------------------------------------------------------------ *
 * Storage
 * ------------------------------------------------------------------ */

export interface LeadStore {
  upsert(input: Omit<LeadInput, "turnstileToken">): Promise<Lead>;
  patch(id: string, patch: Partial<LeadInput>): Promise<Lead | null>;
  list(): Promise<Lead[]>;
}

/**
 * Development sink. Writes newline-delimited JSON to .leads/leads.json so a
 * submitted form is inspectable without any external service configured.
 *
 * Not for production: no concurrency control, and it does not survive a
 * Workers deploy (the filesystem is read-only there). The Supabase adapter
 * replaces it — see `getLeadStore`.
 */
class FileLeadStore implements LeadStore {
  private file = ".leads/leads.json";

  private async read(): Promise<Lead[]> {
    const { readFile } = await import("node:fs/promises");
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as Lead[];
    } catch {
      return [];
    }
  }

  private async write(leads: Lead[]) {
    const { writeFile, mkdir } = await import("node:fs/promises");
    await mkdir(".leads", { recursive: true });
    await writeFile(this.file, JSON.stringify(leads, null, 2), "utf8");
  }

  async upsert(input: Omit<LeadInput, "turnstileToken">): Promise<Lead> {
    const leads = await this.read();
    const now = new Date().toISOString();
    const existing = leads.find((l) => l.email === input.email);

    if (existing) {
      // Merge, never clobber: a returning visitor must not wipe enrichment
      // already captured on an earlier visit (§7.3 step 4).
      const merged: Lead = {
        ...existing,
        ...Object.fromEntries(
          Object.entries(input).filter(([, v]) => v !== undefined && v !== ""),
        ),
        updatedAt: now,
      };
      merged.score = scoreLead(merged);
      const next = leads.map((l) => (l.id === existing.id ? merged : l));
      await this.write(next);
      return merged;
    }

    const lead: Lead = {
      ...input,
      id: crypto.randomUUID(),
      score: scoreLead(input),
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    await this.write([lead, ...leads]);
    return lead;
  }

  async patch(id: string, patch: Partial<LeadInput>): Promise<Lead | null> {
    const leads = await this.read();
    const existing = leads.find((l) => l.id === id);
    if (!existing) return null;

    const merged: Lead = {
      ...existing,
      ...Object.fromEntries(
        Object.entries(patch).filter(([, v]) => v !== undefined && v !== ""),
      ),
      updatedAt: new Date().toISOString(),
    };
    merged.score = scoreLead(merged);
    await this.write(leads.map((l) => (l.id === id ? merged : l)));
    return merged;
  }

  async list(): Promise<Lead[]> {
    const leads = await this.read();
    return leads.sort((a, b) => b.score - a.score || b.createdAt.localeCompare(a.createdAt));
  }
}

let store: LeadStore | null = null;

/**
 * D1 in production, a JSON file in development.
 *
 * The choice is made per call rather than cached across both branches,
 * because the two runtimes are genuinely different processes: `next dev` has
 * no Cloudflare context and must never try to open a binding, while the
 * deployed Worker has no writable filesystem and must never try to open a
 * file. The old unconditional `new FileLeadStore()` was correct locally and a
 * guaranteed 500 in production — `.leads/leads.json` cannot be written on
 * Workers, so every submitted form died at the one step the whole site
 * exists to reach.
 *
 * Supabase is still the destination once there is a leasing team wanting a
 * dashboard; D1 gets there first because it is on the same free tier as the
 * Worker, adds no vendor and no credentials, and the column names match the
 * Postgres schema so that migration stays a change of driver.
 */
export function getLeadStore(): LeadStore {
  const db = getD1();
  if (db) return new D1LeadStore(db);

  if (!store) store = new FileLeadStore();
  return store;
}

/* ------------------------------------------------------------------ *
 * Side effects — every one of these is fire-and-forget (§7.3 step 6).
 * If Resend is slow the visitor still gets an instant confirmation.
 * ------------------------------------------------------------------ */

export async function dispatchLeadSideEffects(lead: Lead): Promise<void> {
  const band = scoreBand(lead.score);
  const tasks: Promise<unknown>[] = [];

  // 1. Internal notification, subject prefixed with the score so the leasing
  //    team can triage from the inbox list without opening anything.
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_TO) {
    tasks.push(
      sendEmail({
        to: process.env.LEAD_NOTIFY_TO,
        subject: `[${lead.score} ${band.toUpperCase()}] New Stax lead — ${lead.email}`,
        text: formatInternalNotification(lead),
      }),
    );
  }

  // 2. Autoresponder with the floor plan pack.
  if (process.env.RESEND_API_KEY) {
    tasks.push(
      sendEmail({
        to: lead.email,
        subject: "Your Stax floor plan pack",
        text: AUTORESPONDER,
      }),
    );
  }

  // 3. Meta CAPI. event_id must match the client pixel or Meta double-counts
  //    and your reported CPL is half the real one (§7.3).
  if (process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN) {
    tasks.push(sendMetaCapi(lead));
  }

  // 4. Redundant sink — when the DB has a bad day you still have the lead.
  if (process.env.SHEETS_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      }),
    );
  }

  await Promise.allSettled(tasks);
}

async function sendEmail(msg: { to: string; subject: string; text: string }) {
  // Resend caps the free tier at 100/day, which a campaign spike will hit
  // (§4.1). Queue and drain rather than blasting when that becomes real.
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Stax <leasing@staxliving.ca>",
      ...msg,
    }),
  });
}

async function sendMetaCapi(lead: Lead) {
  const hashed = await sha256(lead.email);
  return fetch(
    `https://graph.facebook.com/v21.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_TOKEN}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: lead.id, // dedupes against the client pixel
            action_source: "website",
            user_data: {
              em: [hashed],
              ...(lead.fbclid ? { fbc: lead.fbclid } : {}),
            },
            custom_data: { value: lead.score, currency: "CAD" },
          },
        ],
      }),
    },
  );
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function formatInternalNotification(lead: Lead) {
  const rows: [string, string | undefined][] = [
    ["Email", lead.email],
    ["Move-in", lead.moveIn],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Bedrooms", lead.bedrooms],
    ["Budget", lead.budget],
    ["Renter type", lead.renterType],
    ["Plan", lead.floorPlanId],
    ["Source", lead.utmSource],
    ["Campaign", lead.utmCampaign],
    ["Landing", lead.landingSlug],
    ["Referrer", lead.referrer],
  ];
  const body = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const action =
    scoreBand(lead.score) === "hot"
      ? "CALL WITHIN THE HOUR — odds of qualifying drop 21x by the 30 minute mark."
      : scoreBand(lead.score) === "warm"
        ? "Add to the nurture sequence."
        : "Newsletter only.";

  return `${action}\n\nScore: ${lead.score}\n\n${body}\n`;
}

const AUTORESPONDER = `Thanks for registering with Stax.

You're on the list. As each piece is released you'll get it before it goes
public — floor plans first, then pricing, then lease dates for September 2027.

In the meantime:
- 248 suites, 551 beds, eight blocks
- Complimentary round-trip shuttle to Brock, about 15 minutes
- Fully furnished, internet included
- Studio, 1, 2 and 3 bedroom options

Reply to this email with any question and a person will answer it.

— The Stax leasing team
`;
