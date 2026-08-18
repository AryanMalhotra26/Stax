/**
 * Prefixes a root-relative asset path with the deployment base path.
 *
 * Next rewrites `basePath` into next/link and next/image automatically, but
 * NOT into raw `src` attributes. This site serves its renders through a plain
 * <picture> (see components/ui/Render.tsx), so every one of those URLs has to
 * be prefixed by hand or they 404 on a sub-path deploy such as GitHub Pages
 * at /Stax/.
 *
 * Empty string on the normal root deploy, so this is a no-op there.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH || !path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
