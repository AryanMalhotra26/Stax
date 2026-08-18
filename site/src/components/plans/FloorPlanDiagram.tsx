import type { FloorPlanSlug } from "@/content/floorPlans";

/**
 * Schematic floor plates as inline SVG.
 *
 * Vector, not raster: stays sharp at any zoom, weighs ~4KB against ~400KB for
 * a JPEG export, and rooms can carry hover states and accessible names with no
 * extra assets (§3.2). Inline rather than <img src="*.svg"> so `currentColor`
 * inherits and there is no second request.
 *
 * TODO(client): these are illustrative layouts drawn to the published unit
 * types, not dimensioned architectural plans. Swap each <Plate> for the
 * surveyed drawing when the plan pack is issued — the wrapper, labels and
 * hover behaviour stay as they are.
 */

const WALL = 3.5;
const PARTITION = 1.5;

/* A labelled room. Hover lifts the fill so the plan reads interactively. */
function Room({
  x,
  y,
  w,
  h,
  label,
  sub,
  tone = "living",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  tone?: "living" | "wet" | "sleep";
}) {
  const fills = {
    living: "fill-grey/45 group-hover/room:fill-brick/12",
    wet: "fill-grey/80 group-hover/room:fill-brick/18",
    sleep: "fill-grey/25 group-hover/room:fill-brick/12",
  };
  return (
    <g className="group/room">
      <title>{sub ? `${label} — ${sub}` : label}</title>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        className={`${fills[tone]} transition-colors duration-200`}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - (sub ? 4 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-ink text-[8.5px] font-semibold uppercase tracking-[0.14em]"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-ink-faint text-[7.5px] font-medium tracking-[0.04em]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/* Window: a break in the exterior wall drawn as a doubled hairline. */
function Win({
  x,
  y,
  len,
  dir = "h",
}: {
  x: number;
  y: number;
  len: number;
  dir?: "h" | "v";
}) {
  const x2 = dir === "h" ? x + len : x;
  const y2 = dir === "h" ? y : y + len;
  return (
    <>
      <line
        x1={x}
        y1={y}
        x2={x2}
        y2={y2}
        className="stroke-bone"
        strokeWidth={WALL + 1}
        strokeLinecap="butt"
      />
      <line
        x1={x}
        y1={y}
        x2={x2}
        y2={y2}
        className="stroke-ink"
        strokeWidth={1}
      />
    </>
  );
}

/* Door: gap in the partition plus a quarter-circle swing. */
function Door({
  x,
  y,
  size = 16,
  rotate = 0,
}: {
  x: number;
  y: number;
  size?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <line
        x1={0}
        y1={0}
        x2={size}
        y2={0}
        className="stroke-bone"
        strokeWidth={PARTITION + 2}
      />
      <path
        d={`M 0 0 A ${size} ${size} 0 0 1 ${size} ${size}`}
        className="stroke-ink-faint fill-none"
        strokeWidth={0.8}
      />
      <line x1={0} y1={0} x2={0} y2={size} className="stroke-ink" strokeWidth={1.2} />
    </g>
  );
}

/* Kitchen counter run with a sink and range mark. */
function Counter({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fill-bone stroke-ink" strokeWidth={1.2} />
      <circle cx={x + w * 0.28} cy={y + h / 2} r={3.2} className="fill-none stroke-ink-faint" strokeWidth={1} />
      <rect
        x={x + w * 0.58}
        y={y + h * 0.22}
        width={h * 0.9}
        height={h * 0.56}
        className="fill-none stroke-ink-faint"
        strokeWidth={1}
      />
    </g>
  );
}

function Plate({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto"
      role="img"
      aria-label="Illustrative floor plate"
    >
      {children}
    </svg>
  );
}

/* Base floor plate — sits under the labelled rooms. */
function Floor() {
  return <rect x={20} y={20} width={360} height={240} className="fill-grey/30" />;
}

/* Exterior envelope, shared by every plate. */
function Envelope({ w = 360, h = 240 }: { w?: number; h?: number }) {
  return (
    <rect
      x={20}
      y={20}
      width={w}
      height={h}
      className="fill-none stroke-ink"
      strokeWidth={WALL}
    />
  );
}

function Partition({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-ink" strokeWidth={PARTITION} />
  );
}

/* ------------------------------------------------------------------ */

function StudioPlate() {
  return (
    <Plate>
      <Floor />
      <Room x={150} y={24} w={226} h={232} label="Living / Sleeping" sub="approx. 19' × 15'" />
      <Room x={24} y={160} w={122} h={96} label="Bath" tone="wet" />
      <Room x={24} y={24} w={122} h={132} label="Kitchen" tone="wet" />
      <Counter x={30} y={30} w={110} h={22} />
      <Envelope />
      <Partition x1={148} y1={20} x2={148} y2={260} />
      <Partition x1={20} y1={158} x2={148} y2={158} />
      <Win x={230} y={20} len={120} />
      <Win x={380} y={90} len={110} dir="v" />
      <Door x={148} y={210} rotate={-90} />
      <Door x={92} y={158} size={14} />
      {/* entry */}
      <g>
        <line x1={20} y1={225} x2={20} y2={255} className="stroke-bone" strokeWidth={WALL + 1} />
        <line x1={20} y1={225} x2={20} y2={255} className="stroke-brick" strokeWidth={2.5} />
        <text x={8} y={244} className="fill-brick text-[7.5px] font-semibold uppercase tracking-[0.12em]" transform="rotate(-90 8 244)" textAnchor="middle">
          Entry
        </text>
      </g>
    </Plate>
  );
}

function OneBedPlate() {
  return (
    <Plate>
      <Floor />
      <Room x={210} y={24} w={166} h={232} label="Bedroom" sub="approx. 11' × 13'" tone="sleep" />
      <Room x={24} y={24} w={182} h={150} label="Living / Dining" sub="approx. 15' × 12'" />
      <Room x={24} y={178} w={90} h={78} label="Bath" tone="wet" />
      <Room x={118} y={178} w={88} h={78} label="Kitchen" tone="wet" />
      <Counter x={122} y={182} w={80} h={20} />
      <Envelope />
      <Partition x1={208} y1={20} x2={208} y2={260} />
      <Partition x1={20} y1={176} x2={208} y2={176} />
      <Partition x1={116} y1={176} x2={116} y2={260} />
      <Win x={60} y={20} len={120} />
      <Win x={250} y={20} len={100} />
      <Win x={380} y={110} len={100} dir="v" />
      <Door x={208} y={80} rotate={-90} />
      <Door x={70} y={176} size={14} />
      <g>
        <line x1={20} y1={200} x2={20} y2={230} className="stroke-bone" strokeWidth={WALL + 1} />
        <line x1={20} y1={200} x2={20} y2={230} className="stroke-brick" strokeWidth={2.5} />
        <text x={8} y={218} className="fill-brick text-[7.5px] font-semibold uppercase tracking-[0.12em]" transform="rotate(-90 8 218)" textAnchor="middle">
          Entry
        </text>
      </g>
    </Plate>
  );
}

function TwoBedPlate() {
  return (
    <Plate>
      <Floor />
      <Room x={24} y={24} w={128} h={128} label="Bedroom 1" sub="11' × 11'" tone="sleep" />
      <Room x={24} y={156} w={128} h={100} label="Bath 1" tone="wet" />
      <Room x={156} y={24} w={148} h={232} label="Living / Dining" sub="approx. 16' × 15'" />
      <Room x={308} y={24} w={68} h={128} label="Bath 2" tone="wet" />
      <Room x={308} y={156} w={68} h={100} label="Bed 2" tone="sleep" />
      <Counter x={160} y={232} w={140} h={20} />
      <Envelope />
      <Partition x1={154} y1={20} x2={154} y2={260} />
      <Partition x1={306} y1={20} x2={306} y2={260} />
      <Partition x1={20} y1={154} x2={154} y2={154} />
      <Partition x1={306} y1={154} x2={380} y2={154} />
      <Win x={45} y={20} len={90} />
      <Win x={190} y={20} len={90} />
      <Win x={20} y={190} len={60} dir="v" />
      <Win x={380} y={180} len={65} dir="v" />
      <Door x={154} y={60} rotate={-90} />
      <Door x={306} y={200} rotate={90} />
      <Door x={100} y={154} size={13} />
      <g>
        <line x1={155} y1={260} x2={195} y2={260} className="stroke-bone" strokeWidth={WALL + 1} />
        <line x1={155} y1={260} x2={195} y2={260} className="stroke-brick" strokeWidth={2.5} />
        <text x={175} y={274} className="fill-brick text-[7.5px] font-semibold uppercase tracking-[0.12em]" textAnchor="middle">
          Entry
        </text>
      </g>
    </Plate>
  );
}

function ThreeBedPlate() {
  return (
    <Plate>
      <Floor />
      <Room x={24} y={24} w={116} h={112} label="Bedroom 1" sub="11' × 10'" tone="sleep" />
      <Room x={24} y={140} w={116} h={116} label="Bedroom 2" sub="11' × 10'" tone="sleep" />
      <Room x={144} y={24} w={70} h={112} label="Bath 1" tone="wet" />
      <Room x={144} y={140} w={70} h={116} label="Bath 2" tone="wet" />
      <Room x={218} y={24} w={158} h={148} label="Living / Dining" sub="approx. 17' × 14'" />
      <Room x={218} y={176} w={158} h={80} label="Bedroom 3" sub="11' × 10'" tone="sleep" />
      <Counter x={222} y={28} w={150} h={20} />
      <Envelope />
      <Partition x1={142} y1={20} x2={142} y2={260} />
      <Partition x1={216} y1={20} x2={216} y2={260} />
      <Partition x1={20} y1={138} x2={216} y2={138} />
      <Partition x1={216} y1={174} x2={380} y2={174} />
      <Win x={45} y={20} len={80} />
      <Win x={20} y={175} len={60} dir="v" />
      <Win x={380} y={60} len={90} dir="v" />
      <Win x={260} y={260} len={90} />
      <Door x={216} y={70} rotate={-90} />
      <Door x={216} y={215} rotate={-90} />
      <Door x={142} y={65} rotate={-90} />
      <Door x={142} y={185} rotate={-90} />
      <g>
        <line x1={340} y1={174} x2={378} y2={174} className="stroke-bone" strokeWidth={WALL + 1} />
        <line x1={340} y1={174} x2={378} y2={174} className="stroke-brick" strokeWidth={2.5} />
        <text x={359} y={168} className="fill-brick text-[7.5px] font-semibold uppercase tracking-[0.12em]" textAnchor="middle">
          Entry
        </text>
      </g>
    </Plate>
  );
}

const PLATES: Record<FloorPlanSlug, () => React.ReactElement> = {
  studio: StudioPlate,
  "one-bed": OneBedPlate,
  "two-bed": TwoBedPlate,
  "three-bed": ThreeBedPlate,
};

export function FloorPlanDiagram({
  slug,
  className = "",
}: {
  slug: FloorPlanSlug;
  className?: string;
}) {
  const Component = PLATES[slug];
  return (
    <div className={className}>
      <Component />
    </div>
  );
}
