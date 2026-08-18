import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SplitWords } from "@/components/motion/SplitWords";

/* -------------------------------------------------------------------------
   Button
   Sharp corners, 44px minimum tap target (§7.1), no gradient, no shadow.
   ---------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "onDark";
type ButtonSize = "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight " +
  "transition-[background-color,color,border-color,transform] duration-200 " +
  "ease-[var(--ease-out-expo)] active:translate-y-px disabled:pointer-events-none " +
  "disabled:opacity-50 select-none text-center";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brick text-white hover:bg-brick-dark",
  secondary:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-white",
  ghost: "bg-transparent text-ink hover:text-brick underline-offset-4 hover:underline",
  onDark: "bg-white text-ink hover:bg-grey",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-[0.9375rem]",
  lg: "min-h-14 px-7 text-base",
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
   SectionHead — the masthead every light section opens with.

   The white sections previously started with just a small eyebrow and a
   heading floating on an empty page, which is what made them read as
   undesigned. This gives each one a rule, a running index and a label track,
   so the type sits on visible structure and the sections read as a numbered
   sequence rather than a pile of unrelated blocks.
   ---------------------------------------------------------------------- */

export function SectionHead({
  index,
  eyebrow,
  heading,
  action,
  tone = "light",
  className = "",
  headingId,
}: {
  index: string;
  eyebrow: string;
  heading: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  headingId?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      id={headingId}
      className={`relative overflow-hidden border-t pt-5 md:pt-6 ${dark ? "border-white/15" : "border-ink/15"} ${className}`}
    >
      {/* Ghost numeral. to-top.ch sets its block index at 432px in the display
          face at 5-20% opacity, behind the content. Stax was carrying the same
          information at 11px, which is why these sections read as a document
          rather than a designed page. Bleeds off the right edge on purpose —
          the crop is what stops it looking like a placed graphic. */}
      <span
        aria-hidden="true"
        className={`ghost-num top-1/2 -right-4 -translate-y-1/2 md:-right-6 ${
          dark ? "text-white/8" : "text-ink/6"
        }`}
      >
        {index}
      </span>

      <div className="relative z-10">
        <div className="flex items-baseline gap-4">
          <span className="stax-mark text-brick" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={`text-eyebrow uppercase ${dark ? "text-white/55" : "text-ink-soft"}`}>
            {eyebrow}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mt-8">
          <h2 className={`text-h2 max-w-2xl text-balance ${dark ? "text-white" : ""}`}>
            {typeof heading === "string" ? <SplitWords text={heading} /> : heading}
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
    grey: "bg-grey text-ink",
    dark: "bg-charcoal text-grey",
  };
  const sizes = {
    sm: "py-14 md:py-20",
    md: "section-y",
    lg: "section-y",
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
    "w-full min-h-12 px-4 text-base bg-transparent border transition-colors " +
    "duration-150 outline-none placeholder:text-ink-faint";
  const light = invalid
    ? "border-brick text-ink focus:border-brick"
    : "border-ink/25 text-ink focus:border-ink";
  const dark = invalid
    ? "border-brick text-white placeholder:text-white/40"
    : "border-white/25 text-white placeholder:text-white/40 focus:border-white";
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
          ? "bg-ink text-white border-ink"
          : "bg-transparent text-ink border-ink/25 hover:border-ink";
        const dark = selected
          ? "bg-white text-ink border-white"
          : "bg-transparent text-white/85 border-white/25 hover:border-white";
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

/* -------------------------------------------------------------------------
   Stat — proof-strip figure. Plain type, no card (§3.1 §2).
   ---------------------------------------------------------------------- */

export function Stat({
  value,
  label,
  suffix,
}: {
  value: ReactNode;
  label: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-stat tnum flex items-start">
        {value}
        {suffix && (
          <span className="text-[0.35em] font-semibold ml-1 mt-[0.55em] tracking-normal">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-eyebrow uppercase mt-3 text-ink-soft">{label}</div>
    </div>
  );
}
