/**
 * Feature flags.
 *
 * A flag rather than commented-out JSX. Commented blocks stop being
 * type-checked the moment they are commented, drift out of sync with the
 * props and tokens around them, and get skipped by every refactor — so what
 * comes back weeks later no longer compiles. Everything gated here stays in
 * the build, stays type-checked, and turns back on with one boolean.
 *
 * The type is written out rather than inferred through `as const` on purpose:
 * a literal `false` narrows every `if (!FEATURES.floorPlans)` to a constant,
 * which makes the code on the other side unreachable to the compiler and the
 * linter. Widening to `boolean` keeps both branches real.
 */
type Features = {
  /**
   * Floor plans and the /residences route. OFF at the client's direction
   * (Pass 6 §6) — plans are not published until Sept 2026, and the whole
   * registration pitch is "get the plans before anyone else", which is more
   * true, not less, while there is nothing to see without registering.
   *
   * Turning this back ON restores, in one step:
   *   - the home page's Floor Plans section, and its trail segment A;
   *   - the /residences route, its sitemap entry and its indexability;
   *   - the Residences links in the nav (desktop + mobile), the footer,
   *     the /register header, /thank-you and the 404 page;
   *   - the Gallery section's links through to /residences#gallery.
   *
   * Restore BY HAND at the same time — these are content, not code:
   *   - "Two baths, mostly" in What's Included (Pass 6 §3.5). It only makes
   *     sense once the 2- and 3-bedroom plans are visible again. The line was
   *     "Every two- and three-bedroom suite has a second full bathroom. It
   *     matters more in February than it does in September."
   *   - the FAQ answer for "How much is rent?", once rents are published
   *     rather than merely dated.
   */
  readonly floorPlans: boolean;
};

export const FEATURES: Features = {
  floorPlans: false,
};
