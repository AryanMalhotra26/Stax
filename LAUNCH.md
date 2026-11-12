# The pre-launch gate

**The gate is OFF. staxliving.ca is public and indexable.**

It was lifted in Nov 2026 at the client's direction. Nothing was deleted to
do it — the gate page, the unlock endpoint, the password secret and every
line of the middleware are still here, and one variable puts the wall back.

---

## The one switch

`src/lib/gate.ts` reads `PREVIEW_GATE`, and four things follow it: the
middleware that serves the wall, `robots.txt`, the sitemap, and the `noindex`
in the root layout.

The gate is **opt-in**. It is up only while the variable is the literal
string `on`; anything else — including unset — means the site is public.

| | public (now) | gated |
|---|---|---|
| `PREVIEW_GATE` | unset, or anything but `on` | `on` |
| Pages | 200 | 401, rewritten to `/preview` |
| `robots.txt` | `Allow: /` | `Disallow: /` |
| `sitemap.xml` | 3 urls | empty |
| Root layout | `index, follow` | `noindex, nofollow` |
| `/api/lead` | open | **open** |

`/api/lead` is deliberately open in both states: anyone who finds the domain
while it is gated can still register instead of bouncing.

### To put the gate back

```bash
cd site
npx wrangler secret put PREVIEW_GATE      # enter: on
npx wrangler secret put PREVIEW_PASSWORD  # only if you want a new one
```

Setting a secret rolls out a new Worker version on its own, so no rebuild is
needed. Confirm with `curl -s -o /dev/null -w "%{http_code}" https://staxliving.ca/`
— it should print `401`.

### To lift it again

```bash
cd site
npx wrangler secret delete PREVIEW_GATE
```

Or set it to `off`. Either works; only `on` gates.

---

## Two things that were wrong before Nov 2026

Worth knowing, because the old version of this file would have burned you.

**The middleware never read the flag.** `gate.ts` described itself as "one
flag, read by the proxy, robots, the sitemap and the root layout", and this
file told you that with the flag off "the proxy still runs but lets everyone
through". Three of the four were wired. The middleware gated
unconditionally, so flipping the variable would have opened `robots.txt`,
republished the sitemap and dropped the `noindex` — announcing to every
crawler that the site was live — while the password wall kept serving them a
401. Indexed as open, unreachable in fact. The middleware now reads the flag.

**The default was inverted.** The flag used to fail *closed*: anything but
`off` meant gated, so a missing variable kept an unfinished site private.
That was right then and wrong now — with the site public, failing closed
means a secret lost in a rotation takes the whole marketing site to a 401
with nothing in the logs. The default now follows the state of the site.

---

## Using the gate while it is up

| Action | How |
|---|---|
| Send someone a one-click link | `https://staxliving.ca/?preview=<password>` — unlocks and stays unlocked on that device |
| Enter it by hand | The password row at the bottom of the gate page |
| Re-lock your own browser to test | `https://staxliving.ca/?lock` |
| Force everyone to re-enter | Change `PREVIEW_COOKIE` in `src/middleware.ts` to `stax_preview_v2`, redeploy |
| Change the password | `npx wrangler secret put PREVIEW_PASSWORD` |

The gate is enforced on the server: without the cookie the site's HTML is
never generated and never sent. It is not a cover-up placed over a page that
already loaded, so there is no frame where the real site flashes into view
and nothing to read in the JS bundle.

The admin panel is **not** covered by any of this. It carries its own session
and stays shut whether the public site is open or gated — the gate check sits
after the admin check in the middleware for exactly that reason.

---

## If you are going public for the first time

Request indexing in Google Search Console rather than waiting, and confirm:

```bash
curl -s https://staxliving.ca/robots.txt
curl -s https://staxliving.ca/sitemap.xml | head -5
curl -s https://staxliving.ca/ | grep -i "noindex" && echo "STILL BLOCKED" || echo "indexable"
```
