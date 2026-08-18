import type { NextConfig } from "next";

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
