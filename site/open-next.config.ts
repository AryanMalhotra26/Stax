import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext → Workers.
 *
 * Deliberately bare. The optional caches (R2 incremental cache, D1 tag cache,
 * queue-backed ISR) all cost either money or a binding, and this site has no
 * ISR to speak of: every page except `/api/lead` is statically prerendered at
 * build time and served straight off the assets binding. Adding a cache layer
 * here would be configuration with nothing to cache.
 */
export default defineCloudflareConfig();
