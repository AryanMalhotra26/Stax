import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/**
 * Give `next dev` the real Cloudflare bindings.
 *
 * Without this, `getCloudflareContext()` finds nothing in development, so D1
 * is simply absent: the capture form falls back to its file store and the
 * admin panel answers "Database unavailable". That makes the one environment
 * anybody actually iterates in the one environment where the database layer
 * is never exercised — bugs in it surface on the deployed site instead.
 *
 * Dev only, and guarded rather than left to be a no-op: the static export
 * build has no Worker and no bindings, and asking for a platform proxy during
 * it is a spurious failure in CI.
 */
if (process.env.NODE_ENV === "development" && process.env.STATIC_EXPORT !== "1") {
  initOpenNextCloudflareForDev();
}

/**
 * Two deployment shapes.
 *
 * Default — a Node/Workers server. Everything works, including /api/lead.
 *
 * STATIC_EXPORT=1 — a fully static bundle for GitHub Pages. Pages cannot run
 * server code, so this mode is a visual preview only: the lead API does not
 * exist and the capture form says so instead of failing silently. Because the
 * site is served from a sub-path (/Stax), basePath is set and raw <img> URLs
 * are prefixed by lib/asset.ts — Next only rewrites next/link and next/image.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactCompiler: true,

  ...(isStaticExport
    ? {
        output: "export" as const,
        // GitHub Pages serves /about/ from about/index.html
        trailingSlash: true,
        basePath: basePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
