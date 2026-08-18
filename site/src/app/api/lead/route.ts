import { after } from "next/server";
import {
  LeadSchema,
  dispatchLeadSideEffects,
  getLeadStore,
  scoreBand,
} from "@/lib/leads";

/**
 * POST /api/lead — the whole revenue path (§7.3).
 *
 *   1. Verify Turnstile              → 403
 *   2. Zod validate + normalise      → 400
 *   3. Rate limit by IP              → 429
 *   4. Upsert on lower(email)        → never lose existing enrichment
 *   5. Return 200 fast
 *   6. Side effects after the response, never blocking it
 *
 * Step 6 uses `after()` — the Next equivalent of ctx.waitUntil(). If Resend
 * is slow the visitor still sees an instant confirmation.
 */

export const runtime = "nodejs";

/** In-memory limiter. Fine for one instance; swap for Workers KV on deploy. */
const hits = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured yet — allow through so the form is testable before keys
  // exist. Turnstile is mandatory before ads run: paid traffic attracts bot
  // fills, and those poison the conversion data you optimise against (§4).
  if (!secret) return true;
  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    },
  );
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
        field: parsed.error.issues[0]?.path[0],
      },
      { status: 400 },
    );
  }

  const { turnstileToken, ...input } = parsed.data;

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return Response.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const lead = await getLeadStore().upsert(input);

  // Everything below runs after the response is flushed.
  after(async () => {
    try {
      await dispatchLeadSideEffects(lead);
    } catch (err) {
      console.error("[lead] side effects failed", err);
    }
  });

  return Response.json({
    ok: true,
    id: lead.id,
    score: lead.score,
    band: scoreBand(lead.score),
  });
}

/**
 * PATCH /api/lead — progressive enrichment from the thank-you page (§7.2).
 * Every answer patches on click. There is no submit button gating this, which
 * is the entire point: a partial answer still enriches the record.
 */
export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { id, ...rest } = (body ?? {}) as { id?: string } & Record<string, unknown>;
  if (!id || typeof id !== "string") {
    return Response.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const parsed = LeadSchema.partial().safeParse(rest);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid field" }, { status: 400 });
  }

  const lead = await getLeadStore().patch(id, parsed.data);
  if (!lead) return Response.json({ ok: false }, { status: 404 });

  return Response.json({ ok: true, score: lead.score, band: scoreBand(lead.score) });
}
