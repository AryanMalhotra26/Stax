# Launch day — reversing the pre-launch gate

The site is live on staxliving.ca behind a password gate. Six things are
currently in a pre-launch state and every one of them has to be reversed on
the day you go public.

**The riskiest item on this list is the indexing block.** A site that stays
`noindex` after launch is a far more expensive mistake than one that gets
briefly crawled while unfinished — and it is easy to miss, because nothing
visibly breaks. The site simply never appears in Google, and you will not find
out for weeks. Do this list on launch morning, then confirm it.

---

## The one switch

Almost everything is driven by a single flag, `src/lib/gate.ts`, which reads
the `PREVIEW_GATE` environment variable. It fails **closed**: anything other
than the literal string `off` means the site stays gated. A typo leaves the
site private, never public.

To lift the gate:

```bash
cd site
npx wrangler secret put PREVIEW_GATE     # enter: off
npm run cf:build && npm run cf:deploy
```

That alone turns off the indexing block, restores the sitemap and reopens
robots.txt. The password gate itself is separate — see step 2.

---

## The full list

| # | What | Where | Reversal |
|---|---|---|---|
| 1 | Indexing blocked | `src/lib/gate.ts` via `PREVIEW_GATE` | set the secret to `off` |
| 2 | Password gate | `src/proxy.ts` | delete the file |
| 3 | Gate page | `src/app/preview/` | delete the directory |
| 4 | Unlock endpoint | `src/app/api/preview/` | delete the directory |
| 5 | Password secret | Cloudflare | `npx wrangler secret delete PREVIEW_PASSWORD` |
| 6 | Gate metadata | `src/app/preview/page.tsx` | goes with step 3 |

Steps 2–4 are optional on day one — with `PREVIEW_GATE=off` the proxy still
runs but lets everyone through. Deleting them is cleanup, not a launch
blocker. Do step 1 first and the site is live.

---

## Confirm it worked

```bash
curl -s https://staxliving.ca/robots.txt
curl -s https://staxliving.ca/sitemap.xml | head -5
curl -s https://staxliving.ca/ | grep -i "noindex" && echo "STILL BLOCKED" || echo "indexable"
```

`robots.txt` must **not** say `Disallow: /`, the sitemap must list pages, and
the last line must print `indexable`.

Then request indexing in Google Search Console rather than waiting.

---

## Using the gate before launch

| Action | How |
|---|---|
| Send the contractor a one-click link | `https://staxliving.ca/?preview=<password>` — unlocks and stays unlocked on that device for 30 days |
| Enter it by hand | The password row at the bottom of the gate page |
| Re-lock your own browser to test | `https://staxliving.ca/?lock` |
| Force everyone to re-enter | Change `PREVIEW_COOKIE` in `src/proxy.ts` to `stax_preview_v2`, redeploy |
| Change the password | `npx wrangler secret put PREVIEW_PASSWORD` |

The gate is enforced on the server: without the cookie the site's HTML is
never generated and never sent. It is not a cover-up placed over a page that
already loaded, so there is no frame where the real site flashes into view and
nothing to read in the JS bundle.

The register form stays open while the site is gated — anyone who finds the
domain early can still become a lead instead of a bounce.
