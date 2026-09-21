import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";
import { audit, exportLeads } from "@/lib/adminLeads";
import { describeFilters, filtersFromUrl } from "../_filters";

/**
 * GET /api/admin/leads/export — the CSV.
 *
 * THE ONE ACTION THAT IS ALWAYS LOGGED. Reading a lead in the panel leaves
 * the data inside the application; a CSV puts the whole filtered set on
 * somebody's laptop, outside every control here, permanently. If a question
 * is ever asked about where the lead list went, this row is the answer, so
 * it records who, when, from where, how many rows, and the exact filter that
 * produced them.
 *
 * Logged BEFORE the file is returned. Writing the audit row afterwards means
 * a client that disconnects mid-download takes the evidence with it.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = request.headers.get(VERIFIED_USER_HEADER);
  if (!actor) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const filters = filtersFromUrl(url);
  const result = await exportLeads(filters);
  if (!result) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  await audit(
    actor,
    "export",
    `${result.count} rows · ${describeFilters(filters)}`,
    request.headers.get("cf-connecting-ip"),
  );

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(result.csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="stax-leads-${stamp}.csv"`,
      "cache-control": "no-store",
    },
  });
}
