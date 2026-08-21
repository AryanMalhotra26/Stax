/**
 * Is the site still behind the pre-launch gate?
 *
 * One flag, read by the proxy, robots and the sitemap, so launch day is a
 * single change rather than four files to remember. It is driven by an
 * environment variable rather than hard-coded so the gate can be lifted
 * without a rebuild — `wrangler secret delete PREVIEW_PASSWORD` is enough.
 *
 * Fails CLOSED. No password configured means gated, not open: the failure
 * mode of a mis-set variable should be "nobody can see it yet", never "the
 * unfinished site is public and in Google".
 */
export const GATED = process.env.PREVIEW_GATE !== "off";
