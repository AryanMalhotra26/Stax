import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SplitWords } from "@/components/motion/SplitWords";

/* -------------------------------------------------------------------------
   Buttons — three types, no others (§6.1).

   `primary` is brick because brick is what the building is made of;
   `amber` exists for exactly one button on the site, the register form's
   submit, which is the brightest object on the page and the thing everything
   has been building toward. `secondary` is a hairline that resolves to amber
   on hover — the one place a control is allowed to light up.

   Every one of them is a pill. Radius was an empty set across the entire
   previous stylesheet; a rectangle button is the single loudest signal that
   nothing on a page has been designed.
   ---------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "amber" | "ghost";
type ButtonSize = "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-sans " +
  "font-bold uppercase tracking-[0.06em] text-center select-none " +
  "transition-[background-color,color,border-color,transform,box-shadow] " +
  "duration-300 ease-[var(--ease-out-expo)] active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brick text-bone hover:bg-brick-dark hover:-translate-y-0.5 " +
    "hover:shadow-glow [--glow-strength:0.3]",
  secondary:
    "bg-transparent border border-current/30 hover:border-amber hover:text-amber " +
    "duration-150 ease-[var(--ease-out-soft)]",
  amber:
    "bg-amber text-night shadow-glow hover:bg-amber-hot hover:-translate-y-0.5 " +
    "hover:shadow-flare [--flare-strength:0.4]",
  ghost:
    "bg-transparent underline-offset-4 hover:text-amber duration-150 " +
    "ease-[var(--ease-out-soft)]",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-7 text-[0.8125rem]",
  lg: "min-h-14 px-8 text-[0.875rem]",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = "",
) {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/**
 * The arrow every "→" button carries. Translates 6px on the parent's hover —
 * one gesture, applied identically everywhere, rather than each button
 * inventing its own.
 */
export function ButtonArrow() {
  return (
    <svg
      viewBox="0 0 26 10"
      aria-hidden="true"
      className="h-2.5 w-6 shrink-0 fill-none stroke-current transition-transform duration-300 group-hover:translate-x-1.5"
      strokeWidth={2}
    >
      <path d="M0 5 H23 M19 1.5 L23 5 L19 8.5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Eyebrow — the small tracked-out label above section headings, prefixed
   with the stacked-block mark from the logo.
   ---------------------------------------------------------------------- */

export function Eyebrow({
  children,
  className = "",
  mark = true,
}: {
  children: ReactNode;
  className?: string;
  mark?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-2.5 text-eyebrow uppercase ${className}`}
    >
      {mark && (
        <span className="stax-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------
   SectionHead — the masthead every numbered section opens with.

   Three devices, all lifted from the reference and all cheap:

   1. THE GHOST NUMERAL, at 26vw in the display serif, bleeding off the
      container edge. The crop is what stops it reading as a placed graphic.
      Stax carried the same information at 11px in an eyebrow, which is why
      the sections read as a document rather than as a designed page.

   2. THE TWO-TONE HEADING. Line one in full ink, line two a step back into
      the surface — the reference's `transforming` / `organizations` move,
      already used by the hero, and reused on every two-part heading so the
      page has one headline grammar rather than nine.

   3. A RULE AND A RUNNING INDEX, so the type sits on visible structure.
   ---------------------------------------------------------------------- */

export function SectionHead({
  index,
  eyebrow,
  heading,
  quiet,
  action,
  tone = "light",
  className = "",
  headingId,
}: {
  index: string;
  eyebrow: string;
  /** Line one — full contrast. */
  heading: ReactNode;
  /** Line two — a step back. Omit for a single-tone heading. */
  quiet?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  headingId?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative overflow-clip border-t pt-5 md:pt-6 ${
        dark ? "border-sand/15" : "border-ink/15"
      } ${className}`}
    >
      {/* Desktop only, and that is a layout constraint rather than a
          preference: a watermark needs horizontal room the heading is not
          using, and on a 375px column the heading wraps straight through it.
          Below `md` the index becomes a large inline numeral in the eyebrow
          row instead — the hierarchy survives, the collision does not. */}
      <span
        aria-hidden="true"
        className={`ghost-num top-1/2 hidden -translate-y-1/2 md:right-0 md:block ${
          dark ? "text-bone" : "text-ink"
        }`}
      >
        {index}
      </span>

      <div className="relative z-2">
        <div className="flex items-baseline gap-3 md:gap-4">
          <span
            aria-hidden="true"
            className={`font-display text-[2.25rem] leading-none tnum md:hidden ${
              dark ? "text-bone/25" : "text-ink/20"
            }`}
          >
            {index}
          </span>
          <span className="stax-mark text-brick" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span
            className={`text-eyebrow uppercase ${dark ? "text-grey/75" : "text-ink-soft"}`}
          >
            {eyebrow}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mt-8">
          <h2
            id={headingId}
            className={`max-w-3xl text-h1 text-balance ${dark ? "text-bone" : "text-ink"}`}
          >
            {typeof heading === "string" ? <SplitWords text={heading} /> : heading}
            {quiet && (
              <>
                {" "}
                <span className={dark ? "text-stone" : "text-ink-faint"}>
                  <SplitWords text={quiet} />
                </span>
              </>
            )}
          </h2>
          {action}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Section — consistent vertical rhythm without repeating padding classes.
   ---------------------------------------------------------------------- */

export function Section({
  children,
  className = "",
  id,
  tone = "light",
  size = "md",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "paper" | "dark" | "grey";
  size?: "sm" | "md" | "lg";
  as?: "section" | "div" | "footer";
}) {
  const tones = {
    light: "bg-bone text-ink",
    paper: "bg-paper text-ink",
    grey: "bg-linen text-ink",
    dark: "bg-espresso text-grey",
  };
  const sizes = {
    sm: "section-y-sm",
    md: "section-y",
    lg: "section-y-lg",
  };
  return (
    <Tag id={id} className={`${tones[tone]} ${sizes[size]} ${className}`}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
   Field label — always visible, never a placeholder (§7.1).
   ---------------------------------------------------------------------- */

export function Label({
  children,
  htmlFor,
  className = "",
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-eyebrow uppercase mb-2.5 ${className}`}
    >
      {children}
    </label>
  );
}

export function Input({
  className = "",
  invalid = false,
  onDark = false,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean; onDark?: boolean }) {
  const base =
    "w-full min-h-12 rounded-xs border-b bg-transparent px-1 py-3 text-base " +
    "outline-none transition-[border-color,box-shadow] duration-150 " +
    "ease-[var(--ease-out-soft)] placeholder:text-ink-faint " +
    "focus:shadow-[var(--shadow-focus-rule)]";
  const light = invalid
    ? "border-brick text-ink"
    : "border-ink/25 text-ink focus:border-amber";
  const dark = invalid
    ? "border-brick text-bone placeholder:text-grey/75"
    : "border-sand/25 text-bone placeholder:text-grey/75 focus:border-amber";
  return <input className={`${base} ${onDark ? dark : light} ${className}`} {...props} />;
}

/* -------------------------------------------------------------------------
   Pill group — tappable choice, not a <select>. One tap, no keyboard, and
   it doubles as a commitment step (§7.1).
   ---------------------------------------------------------------------- */

export function PillGroup({
  name,
  options,
  value,
  onChange,
  onDark = false,
  columns = 2,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
  onDark?: boolean;
  columns?: 2 | 3 | 4;
}) {
  // The 3-up carries the longest labels ("Group of friends"), so it stacks on
  // narrow screens rather than wrapping each pill onto two lines.
  const cols = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${cols} gap-2`} role="radiogroup" aria-label={name}>
      {options.map((opt) => {
        const selected = value === opt.value;
        const base =
          "min-h-12 px-3 text-[0.9375rem] font-medium border transition-colors " +
          "duration-150 cursor-pointer";
        const light = selected
          ? "bg-ink text-bone border-ink"
          : "bg-transparent text-ink border-ink/25 hover:border-ink";
        const dark = selected
          ? "bg-bone text-ink border-sand"
          : "bg-transparent text-grey/85 border-sand/25 hover:border-amber";
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={`${base} ${onDark ? dark : light}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
