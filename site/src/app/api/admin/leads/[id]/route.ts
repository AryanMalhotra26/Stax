import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";
import { LEAD_STATUSES, audit, updateLeadStatus } from "@/lib/adminLeads";
import type { LeadStatus } from "@/lib/leads";

/**
 * PATCH /api/admin/leads/[id] — move a lead along the pipeline.
 *
 * The only write the panel makes. Audited like the export, because a status
 * is the leasing team's record of what happened to a person and "who marked
 * this lost" is a real question.
 */
export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = request.headers.get(VERIFIED_USER_HEADER);
  if (!actor) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;

  // Checked against the list rather than cast. The value arrives as JSON from
  // a browser, and `status` is written straight into the row — an unchecked
  // string here puts arbitrary values into a column the rest of the site
  // switches on.
  const status = body?.status;
  if (!status || !LEAD_STATUSES.includes(status as LeadStatus)) {
    return Response.json({ error: "Unknown status" }, { status: 400 });
  }

  const previous = await updateLeadStatus(id, status as LeadStatus);
  if (previous === null) {
    return Response.json({ error: "No such lead" }, { status: 404 });
  }

  await audit(
    actor,
    "status_change",
    `${id}: ${previous} → ${status}`,
    request.headers.get("cf-connecting-ip"),
  );

  return Response.json(
    { ok: true, status },
    { headers: { "cache-control": "no-store" } },
  );
}
