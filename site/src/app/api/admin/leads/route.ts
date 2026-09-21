import { VERIFIED_USER_HEADER } from "@/lib/admin-auth";
import { leadFacets, listLeads } from "@/lib/adminLeads";
import { filtersFromUrl } from "./_filters";

/**
 * GET /api/admin/leads — the table.
 *
 * Behind the session check in middleware; the header below is only read to
 * prove the middleware ran, never to decide anything.
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!request.headers.get(VERIFIED_USER_HEADER)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);

  // Capped. The page size arrives from a query parameter, and an uncapped one
  // turns a paged endpoint into "send me the whole lead database as JSON".
  const perPage = Math.min(
    200,
    Math.max(10, Number(url.searchParams.get("perPage") ?? 50) || 50),
  );

  const result = await listLeads(filtersFromUrl(url), page, perPage);
  if (!result) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  // Facets only on the first page: they describe the whole table and do not
  // change as somebody pages through it.
  const facets = page === 1 ? await leadFacets() : null;

  return Response.json(
    { ...result, page, perPage, facets },
    { headers: { "cache-control": "no-store" } },
  );
}
