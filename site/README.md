# Stax — lead-gen site

Built to `BUILD-PLAN.md`. Structure-first: everything renders and the
conversion path works end to end locally. Nothing is hosted yet.

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run images     # regenerate render variants from ../Images
npm run typecheck
```

---

## Where the brand came from

| Asset | Source | Used for |
|---|---|---|
| Wordmark | `../Logo (No background).svg` | Traced into `components/brand/Logo.tsx` — `currentColor`, so it inverts on dark sections with no second asset |
| Palette | `../Logos and Branding.pdf` | `#E5E6E6` grey, `#3E3D3D` charcoal, `#B8433D` brick — locked in `globals.css` |
| Copy | `../Stax – Written Copy.pdf` | Hero, positioning, amenities, neighbourhood, specs |
| Renders | `../Images/*.jpg` (10 files, 113MB) | Pre-processed to 7.5MB of AVIF/WebP |
| About copy + team | spheredevelopments.ca | `/about` story, experience, principles, six-person team |
| Headshots | `../Team/*.jpg` | Downloaded from Sphere's team page, cropped 4:5 by the pipeline |

### Two brand decisions worth knowing

**Futura → Jost.** The brand sheet specifies Futura Bold. Futura has no free
web licence. Jost is an open-source geometric sans drawn after Futura — same
single-storey `a`, circular `o`, high crossbar. To swap in licensed Futura PT
later, replace the `next/font/google` call in `app/layout.tsx` with
`next/font/local` and keep the `--font-jost` variable name. No other file
changes.

**Palette passes contrast as-is.** Brick on white is 5.37:1 and white on brick
is the same — AA for body text, so the accent works for buttons and links
without a darkened variant.

---

## Deviations from BUILD-PLAN

Both are driven by the same fact: **the building opens September 2027.**

**`/tour` → `/register`.** §3.4 specifies a tour-booking page with a Cal.com
embed. There is nothing to tour — the site is undeveloped land, and offering
a viewing is a promise the leasing team cannot keep. The high-intent action
that exists now is joining the priority list, which is also what the client's
own written copy asks for. Everything else in §3.4 holds: minimal nav, nothing
above the fold but heading + reassurance + form, real phone number as
fallback. When a sales centre opens, the Cal.com embed drops into the same
slot.

**No resident testimonials.** §3.1 §8 asks for three resident quotes. Nobody
has lived here yet, so those would be fabricated — on a leasing site, that is
a liability rather than a shortcut. That slot is now `Assurance.tsx`: three
commitments a prospect can hold the client to, closed by the real Sphere
Developments track record — pre-construction, that is the strongest trust
asset that actually exists.

**No prices anywhere.** `startingRent` is `null` on every plan and renders as
"Pricing Spring 2027". Rents are not set. A wrong rent on a leasing site is a
consumer-protection problem, and the schema.org output deliberately omits
`offers` for the same reason. When pricing lands, set `startingRent` in
`content/floorPlans.ts` and the cards, JSON-LD and CTA copy all follow.

---

## What needs your input

Everything below is marked `TODO(client)` or `[PLACEHOLDER]` in the source.

| File | What's needed |
|---|---|
| `content/about.ts` | Headline statistics only — Sphere's own counters are unfilled (`$0M`, `0`), so the stat row is hidden until real figures exist. Also Vruti Shah's headshot |
| `lib/site.ts` | **Confirm the address** (see below), plus phone, email, domain, social handles |
| `content/faqs.ts` | Seven answers marked `[DRAFT]` need leasing sign-off — pets, parking, utilities, lease-by-room, shuttle schedule |
| `content/floorPlans.ts` | Real bedroom mix. Current split (30/45/43/130) reconciles to 248 units / 551 beds but is invented |
| `components/plans/FloorPlanDiagram.tsx` | Replace the four schematic plates with surveyed drawings when the plan pack is issued |
| `app/(legal)/*` | Privacy and terms need legal review. Not optional — Meta's terms require a compliant privacy policy on any domain running their pixel, and CAPI sends hashed email to a third party |
| `content/neighbourhood.ts` | Confirm walk times against the final address |

**Team photos:** real or none. Five of six are the real B&W headshots from
Sphere's team page; Vruti Shah's is a "coming soon" placeholder there too, so
that card renders the brand mark. Drop a photo at `../Team/vruti-shah.jpg` and
re-run `npm run images` to fill it.

### Address — needs confirming

`lib/site.ts` now uses **455 Welland Avenue, St. Catharines**. That is an
inference, not something the brand pack states. Sphere's own project page for
455 Welland describes a purpose-built rental community of urban townhomes with
**248 residential units, 12 commercial units and 249 parking spaces** — the
unit count matches Stax exactly, the retail-at-grade matches the street
render, and the site plan matches. It is very likely the same project under a
new brand, but confirm before launch: the address drives the LocalBusiness
schema and the neighbourhood walk times.

## About content

Story, experience, principles and the team roster are taken verbatim (trimmed,
not rewritten) from spheredevelopments.ca — About Us, Our Experience, Our
Principles and Our Team — at the client's direction, since Stax is a Sphere
project. Source of each block is noted in `content/about.ts`.

Two deliberate gaps:

- **No bios.** Sphere publishes names and titles only. Writing a career
  history for a named real person would be inventing it.
- **No statistics.** Sphere's four headline counters all render as `$0M` / `0`
  on their own site — they were never filled in. The stat row is hidden rather
  than shown with zeros or with numbers we made up. Populate `ABOUT_STATS` and
  it appears automatically.

---

## Architecture notes

**Images are pre-generated, not optimised at request time.**
`scripts/process-images.mjs` turns the 10 source renders into AVIF + WebP at
640/1024/1600/2400 plus a ~400-byte inline LQIP, and writes
`content/generated/media.ts`. Components use a plain `<picture>`, not
`next/image` — Cloudflare's image resizing is a paid add-on and would blow the
10ms CPU budget per request. Re-run `npm run images` after adding a render.

Hero render is **50KB** at 1600px against a 150KB budget.

**The content layer mirrors the SQL schema in §5.** `floorPlans`, `campaigns`,
`faqs` and `media` are typed modules shaped exactly like the tables. Moving to
Supabase means changing where the data is read from, not how components
consume it.

**Lead storage is behind an interface.** With no env vars set, `/api/lead`
writes to `.leads/leads.json` so the form works locally. `getLeadStore()` in
`lib/leads.ts` is the single place to swap in Supabase. Inserts must go through
the service key server-side — `leads` gets no public select, or a competitor
reads the list with one fetch.

**Side effects never block the response.** Resend, Meta CAPI and the Sheets
webhook all run in `after()` (the Next equivalent of `ctx.waitUntil`).

**Attribution survives internal navigation.** UTMs and `fbclid` are stashed in
`sessionStorage` on first load, first-touch wins. Reading `location.search` at
submit time would attribute a lead that landed on `/l/shuttle` and converted
on `/residences` to nothing.

---

## Performance

Measured against `next start`, not dev.

| Route | JS (gzip) | Budget | |
|---|---|---|---|
| `/l/[campaign]` | **141KB** | <120KB target, 200KB hard fail | Over target, under hard fail |
| Hero AVIF @1600 | **50KB** | <150KB | ✅ |
| Fonts | 26KB | — | Jost, 4 weights, `display: swap` |

The landing route dropped from 189KB to 141KB by removing `motion/react` from
`CaptureForm` and `Enrichment` — that library was 46KB for one state swap that
CSS grid does natively. The remaining 141KB is essentially the React 19 +
Next 16 App Router floor; getting under 120KB would mean not using the
framework on that route.

Motion still ships on `/`, `/about` and `/residences` (section reveals, stat
counters), and GSAP is `next/dynamic`'d so it loads after first paint only on
the routes that use it. Neither reaches `/l/*`.

**Not yet done:** Lighthouse CI gates (§6.1). Wire that up before scaling ad
spend — a perf regression found after $2,000 of spend is $2,000 you can't get
back.

---

## Motion inventory

Three earned moments, per §6.3:

1. **Amenities pan** — GSAP ScrollTrigger, `pin: true`, `scrub: 1`. Degrades
   to native scroll-snap below 768px; pinning on a phone fights the browser's
   own scroll.
2. **Gallery lightbox** — `Flip.from()`, image morphs from grid to overlay.
3. **Hero entrance** — CSS keyframes, 60ms stagger. No JS. The LCP element
   itself never animates.

Everything bails out of `prefers-reduced-motion` in both the effect body and
CSS.
