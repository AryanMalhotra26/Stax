import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { GATED } from "@/lib/gate";

// Required by `output: export`; a no-op for the server build, where
// these are already generated at build time.
export const dynamic = "force-static";

/**
 * GATED — reverse on launch. See LAUNCH.md.
 *
 * A password gate does nothing to stop indexing: crawlers do not type
 * passwords, and a half-finished site in Google's index is a lasting problem
 * that outlives the gate by months. While the site is gated this disallows
 * everything, and the block below is what goes back when it launches.
 */
export default function robots(): MetadataRoute.Robots {
  if (GATED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

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
