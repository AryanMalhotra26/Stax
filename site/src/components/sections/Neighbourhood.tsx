import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { StaxMark } from "@/components/brand/Logo";
import {
  FOOD_NEARBY,
  LANDMARKS,
  NEIGHBOURHOOD_COPY,
} from "@/content/neighbourhood";

/**
 * Location objection (§3.1 §6).
 *
 * Deliberately not an embedded Google Maps iframe: those are ~800KB, set
 * third-party cookies (which would drag a consent banner onto the site and
 * with it a conversion tax), and block the main thread on mobile. A schematic
 * SVG plate carries the same information — relative position and walk time —
 * at about 3KB and zero third parties.
 */
export function Neighbourhood() {
  const featured = LANDMARKS.filter((l) => l.featured);

  return (
    <section className="bg-charcoal text-grey">
      <div className="container-stax section-y relative">
        <SectionHead
          index="03"
          eyebrow="The neighbourhood"
          heading={NEIGHBOURHOOD_COPY.heading}
          tone="dark"
        />
        <div className="mt-10 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start">
          <Reveal>
            <p className="text-lead text-grey/60 max-w-lg">
              {NEIGHBOURHOOD_COPY.body}
            </p>

            <ul className="mt-7 divide-y divide-white/10 border-y border-white/10">
              {LANDMARKS.map((landmark) => (
                <li
                  key={landmark.name}
                  className="flex items-baseline justify-between gap-4 py-2"
                >
                  <span
                    className={
                      landmark.featured ? "text-white font-medium" : "text-grey/70"
                    }
                  >
                    {landmark.name}
                  </span>
                  <span className="text-sm text-grey/45 tnum whitespace-nowrap">
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

            <p className="mt-5 text-sm text-grey/50 leading-relaxed">
              Plus {FOOD_NEARBY.slice(0, -1).join(", ")} and {FOOD_NEARBY.at(-1)},
              along with local restaurants and bars.
            </p>
            <p className="mt-3 text-xs text-grey/35">
              Times are approximate and provided for guidance only.
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

/** Schematic plate: roads, the site, and the pins that matter. */
function MapPlate({ featured }: { featured: typeof LANDMARKS }) {
  return (
    <figure className="relative">
      <svg
        viewBox="0 0 600 460"
        className="w-full h-auto"
        role="img"
        aria-label="Schematic map showing Stax relative to Brock University, Starbucks, No Frills and Walmart"
      >
        <rect width="600" height="460" className="fill-white/4" />

        {/* Road grid */}
        <g className="stroke-white/12" strokeWidth={1}>
          {[70, 150, 230, 310, 390].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} />
          ))}
          {[90, 200, 310, 420, 520].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="460" />
          ))}
        </g>

        {/* Arterial road past the site */}
        <line x1="0" y1="310" x2="600" y2="310" className="stroke-white/25" strokeWidth={5} />
        <line
          x1="0"
          y1="310"
          x2="600"
          y2="310"
          className="stroke-white/40"
          strokeWidth={1}
          strokeDasharray="10 12"
        />

        {/* Shuttle route to campus */}
        <path
          d="M 220 268 C 300 268, 380 200, 468 120"
          className="stroke-brick fill-none"
          strokeWidth={2}
          strokeDasharray="7 7"
        />
        <text
          x="352"
          y="196"
          className="fill-brick text-[11px] font-semibold uppercase tracking-[0.16em]"
          transform="rotate(-24 352 196)"
        >
          15 min shuttle
        </text>

        {/* The site */}
        <g>
          <rect x="140" y="238" width="164" height="62" className="fill-brick" />
          <text
            x="222"
            y="275"
            textAnchor="middle"
            className="fill-white text-[16px] font-bold uppercase tracking-[0.2em]"
          >
            Stax
          </text>
        </g>

        {featured.map((landmark) => (
          <g key={landmark.name}>
            <circle
              cx={(landmark.x / 100) * 600}
              cy={(landmark.y / 100) * 460}
              r={5}
              className="fill-white"
            />
            <text
              x={(landmark.x / 100) * 600}
              y={(landmark.y / 100) * 460 - 14}
              textAnchor="middle"
              className="fill-white text-[12px] font-semibold"
            >
              {landmark.name}
            </text>
            <text
              x={(landmark.x / 100) * 600}
              y={(landmark.y / 100) * 460 + 22}
              textAnchor="middle"
              className="fill-white/45 text-[10.5px] font-medium uppercase tracking-[0.1em]"
            >
              {landmark.time}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="mt-5 flex items-center gap-2.5 text-eyebrow uppercase text-grey/40">
        <StaxMark className="w-4 h-auto text-brick" />
        Not to scale
      </figcaption>
    </figure>
  );
}
