import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Public routes only. /l/* is excluded deliberately — ad landing pages are
 * noindex and listing them would compete with / for the brand query.
 * /thank-you is excluded for the same reason.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE.url}/residences`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
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
