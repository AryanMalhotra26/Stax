/**
 * Is the site still behind the pre-launch gate?
 *
 * One flag, read by the proxy, robots, the sitemap and the root layout, so
 * launch day is a single change rather than four files to remember.
 *
 * A FUNCTION, NOT A CONSTANT, and that is a fix rather than a style choice.
 *
 * This was `export const GATED = process.env.PREVIEW_GATE !== "off"`, which
 * is evaluated once when the module is first imported. On this runtime the
 * adapter populates `process.env` per request — so at module-evaluation time
 * the variable can still be `undefined`, and `undefined !== "off"` is `true`.
 * The flag then stays `true` for the life of the isolate no matter what the
 * secret says.
 *
 * Because it fails closed, the symptom is not a leak. It is worse in its own
 * way: you set `PREVIEW_GATE=off`, redeploy, and the site is still locked,
 * with nothing in the logs to say why. LAUNCH.md calls the indexing block the
 * riskiest item on launch morning; this is the mechanism that would have made
 * it stick. It also made `next dev` unable to show the real site at all.
 *
 * Reading it per call costs one property lookup and removes the whole class
 * of problem — the same reasoning `admin-auth.ts` already applies to the
 * session secret.
 *
 * Fails CLOSED. Anything other than the literal string `off` means gated: the
 * failure mode of a mis-set variable should be "nobody can see it yet", never
 * "the unfinished site is public and in Google".
 */
export function isGated(): boolean {
  return process.env.PREVIEW_GATE !== "off";
}
