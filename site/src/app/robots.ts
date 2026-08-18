import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Required by `output: export`; a no-op for the server build, where
// these are already generated at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Ad destinations and post-conversion pages stay out of the index.
      disallow: ["/l/", "/thank-you", "/api/", "/admin"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
