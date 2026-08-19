import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import {
  FOOD_NEARBY,
  LANDMARKS,
  NEIGHBOURHOOD_COPY,
} from "@/content/neighbourhood";

/**
 * "03 — The Neighbourhood" (§5.5).
 *
 * The reference has no equivalent to this section — it is Stax's own, and it
 * is the best original idea on the site. So it gets a light touch: surfaces,
 * type voice and one motion, and nothing restructured.
 *
 * Deliberately not an embedded Google Maps iframe: those are ~800KB, set
 * third-party cookies (which would drag a consent banner onto the site and
 * with it a conversion tax), and block the main thread on mobile. A schematic
 * plate carries the same information — relative position and walk time — at
 * about 3KB and zero third parties.
 *
 * What changes is that the plate now reads as *drawn* rather than generated:
 * the grid recedes to a whisper, every destination becomes a lit point, the
 * shuttle route draws itself as the section arrives, and the two labels that
 * are asides rather than data move to the hand.
 */
export function Neighbourhood() {
  const featured = LANDMARKS.filter((l) => l.featured);

  return (
    <section
      data-trail="the walk"
      className="relative overflow-hidden bg-espresso text-grey section-y"
    >
      <Seam edge="top" color="espresso" size="12%" />
      <Seam edge="bottom" color="night" size="18%" />

      <div className="container-stax relative z-2">
        <SectionHead
          index="03"
          eyebrow="The neighbourhood"
          heading={NEIGHBOURHOOD_COPY.heading}
          tone="dark"
        />

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="max-w-lg text-lead text-grey/60">
              {NEIGHBOURHOOD_COPY.body}
            </p>

            <ul className="mt-8 border-t border-sand/12">
              {LANDMARKS.map((landmark) => (
                <li
                  key={landmark.name}
                  className="group flex items-baseline justify-between gap-4 border-b border-sand/12 px-3 py-2.5 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:bg-amber/6"
                >
                  <span
                    className={
                      landmark.featured
                        ? "font-medium text-bone"
                        : "text-grey/70"
                    }
                  >
                    {landmark.name}
                  </span>
                  <span className="shrink-0 text-sm tnum whitespace-nowrap text-ink-faint transition-colors duration-150 ease-[var(--ease-out-soft)] group-hover:text-amber">
                    {landmark.time}{" "}
                    {landmark.mode === "shuttle"
                      ? "shuttle"
                      : landmark.mode === "walk"
                        ? "walk"
                        : "drive"}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-grey/50">
              Plus {FOOD_NEARBY.slice(0, -1).join(", ")} and {FOOD_NEARBY.at(-1)},
              along with local restaurants and bars.
            </p>
            <p className="mt-3 text-xs text-grey/35">
              Times are approximate and provided for guidance only.
            </p>

            {/* The section's one annotation — and the only line on the page
                that admits what the neighbourhood is actually for. */}
            <p
              className="hand mt-9 max-w-[24ch] text-hand text-amber"
              style={{ ["--hand-tilt" as string]: "-7deg" }}
            >
              you will use the Starbucks more than the library
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <MapPlate featured={featured} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const SHUTTLE_ROUTE = "M 220 268 C 300 268, 380 200, 468 120";

/** Schematic plate: roads, the site, and the pins that matter. */
function MapPlate({ featured }: { featured: typeof LANDMARKS }) {
  return (
    <figure className="relative">
      <svg
        viewBox="0 0 600 460"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Schematic map showing Stax relative to Brock University, Starbucks, No Frills and Walmart"
      >
        <rect width="600" height="460" rx="14" className="fill-bone/3" />

        {/* Road grid — a whisper. It is context, not content. */}
        <g className="stroke-sand/10" strokeWidth={1}>
          {[70, 150, 230, 310, 390].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} />
          ))}
          {[90, 200, 310, 420, 520].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="460" />
          ))}
        </g>

        {/* Arterial road past the site */}
        <line x1="0" y1="310" x2="600" y2="310" className="stroke-sand/20" strokeWidth={5} />
        <line
          x1="0"
          y1="310"
          x2="600"
          y2="310"
          className="stroke-sand/35"
          strokeWidth={1}
          strokeDasharray="10 12"
        />

        {/* Shuttle route. Draws itself as the section enters — the one motion
            in this section, and the one that turns a diagram into a journey.

            The reveal is a mask rather than the route's own dash offset,
            because the route is *already* dashed: animating the offset of a
            repeating dash makes the dashes march along the path instead of
            the path arriving. The mask is a single solid stroke growing from
            one end, so the dashed line underneath appears dash by dash. */}
        <mask id="shuttle-draw" maskUnits="userSpaceOnUse">
          <path
            d={SHUTTLE_ROUTE}
            className="sd-draw fill-none stroke-white"
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
          />
        </mask>
        <path
          d={SHUTTLE_ROUTE}
          mask="url(#shuttle-draw)"
          className="fill-none stroke-brick"
          strokeWidth={2.5}
          strokeDasharray="7 7"
          strokeLinecap="round"
        />

        {/* The site. The one built thing on the plate, so it is the one brick
            thing on it. */}
        <g transform="rotate(-2 222 269)">
          <rect
            x="140"
            y="238"
            width="164"
            height="62"
            rx="10"
            className="fill-brick"
            // `drop-shadow`, not `box-shadow`: this is an SVG shape, and a
            // box-shadow would be cast by its bounding box rather than by the
            // rounded rectangle. Same offset language as --shadow-card.
            style={{ filter: "drop-shadow(10px 10px 22px rgb(23 18 16 / 0.4))" }}
          />
          <text
            x="222"
            y="276"
            textAnchor="middle"
            className="fill-bone font-sans text-[15px] font-bold tracking-[0.2em] uppercase"
          >
            Stax
          </text>
        </g>

        {featured.map((landmark) => {
          const cx = (landmark.x / 100) * 600;
          const cy = (landmark.y / 100) * 460;
          return (
            <g key={landmark.name}>
              {/* Every destination is a lit point. Amber emits; that is the
                  only job it has anywhere on this site. */}
              <circle cx={cx} cy={cy} r={13} className="fill-amber/18" />
              <circle cx={cx} cy={cy} r={4.5} className="fill-amber" />
              <text
                x={cx}
                y={cy - 18}
                textAnchor="middle"
                className="fill-bone font-sans text-[12px] font-semibold"
              >
                {landmark.name}
              </text>
              <text
                x={cx}
                y={cy + 27}
                textAnchor="middle"
                className="fill-grey/45 font-sans text-[10.5px] font-medium tracking-[0.1em] uppercase"
              >
                {landmark.time}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Sits over the route, at its angle. A label in the hand reads as
          something written on the map; the same words in the UI sans read as
          a data field. */}
      <span
        className="hand pointer-events-none absolute top-[36%] left-[52%] text-hand-sm whitespace-nowrap text-amber"
        style={{ ["--hand-tilt" as string]: "-24deg" }}
      >
        15 min shuttle
      </span>

      <figcaption
        className="hand mt-4 text-right text-hand-sm text-ink-faint"
        style={{ ["--hand-tilt" as string]: "-3deg" }}
      >
        not to scale
      </figcaption>
    </figure>
  );
}
