import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { FEATURES } from "@/config/features";
import { GATED } from "@/lib/gate";

// Required by `output: export`; a no-op for the server build, where
// these are already generated at build time.
export const dynamic = "force-static";

/**
 * Public routes only. /l/* is excluded deliberately — ad landing pages are
 * noindex and listing them would compete with / for the brand query.
 * /thank-you is excluded for the same reason.
 *
 * /residences is excluded while the floor plans are hidden. A static build
 * emits the route either way, so the URL keeps resolving — it just redirects
 * — and submitting a redirect in a sitemap is a crawl error, not a listing.
 * The route's own layout carries the matching `noindex`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // GATED — an empty sitemap while the gate is up. See LAUNCH.md.
  if (GATED) return [];

  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...(FEATURES.floorPlans
      ? [
          {
            url: `${SITE.url}/residences`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
        ]
      : []),
    {
      url: `${SITE.url}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
