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
 * OPT-IN SINCE NOV 2026, and that is a reversal of the original rule.
 *
 * This used to read `process.env.PREVIEW_GATE !== "off"` — anything but the
 * literal string `off` meant gated — because the risk being managed was an
 * unfinished site leaking into Google. The client has now asked for the lock
 * off, and that risk has expired: the site is the public one.
 *
 * What has not expired is the other direction. With the old default, a
 * secret that goes missing in a rotation, a new environment created without
 * it, or a typo takes the entire public marketing site to a 401 — and
 * nothing in the logs says why. Failing closed protects an unlaunched site
 * and attacks a launched one, so the default follows the state of the site.
 *
 * The gate is now explicitly opt-in: it is up only while PREVIEW_GATE is the
 * literal string `on`. Nothing has been deleted to achieve that — the gate
 * page, the unlock endpoint, the password secret and every line of the
 * middleware are intact. Setting the variable to `on` puts the wall straight
 * back. See LAUNCH.md.
 */
export function isGated(): boolean {
  return process.env.PREVIEW_GATE === "on";
}
