"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MOVE_IN_OPTIONS } from "@/lib/site";
import { captureAttribution, track } from "@/lib/attribution";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A static export (GitHub Pages) has no server, so /api/lead does not exist.
 * Rather than let the submit fail silently — the worst possible outcome on the
 * one element the site exists for — the form says so and offers email instead.
 */
const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

/**
 * The two-field capture form (§7.1), poster treatment.
 *
 * Still two fields, because 1–3 consistently outperforms longer and every
 * field past three costs 10–25%. Phone is deliberately absent — it is the most
 * abandonment-prone field on a cold form, and it is asked for on the thank-you
 * page instead, from someone who has already said yes once.
 *
 * The surface is architectural rather than boxed (§5.9): inputs are a single
 * bottom rule that lights amber on focus, choices are pills, and the submit
 * is the one amber-filled button on the site — the brightest object on the
 * whole page, which everything from the hero down has been building toward.
 *
 * No focus-ring glow on the inputs. A glow there would put a second emitting
 * object beside the submit and split the light source, which is the one rule
 * the palette does not bend on.
 *
 * Every accessibility and conversion detail from the original is intact —
 * visible labels, real radio semantics, blur-time validation, 44px targets.
 */

type Props = {
  onDark?: boolean;
  floorPlanId?: string;
  ctaLabel?: string;
  landingSlug?: string;
  className?: string;
  compact?: boolean;
};

export function CaptureForm({
  onDark = false,
  floorPlanId,
  ctaLabel = "Get floor plans & pricing",
  landingSlug,
  className = "",
  compact = false,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [moveIn, setMoveIn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const started = useRef(false);
  const uid = landingSlug ?? floorPlanId ?? "main";

  const handleStart = () => {
    if (started.current) return;
    started.current = true;
    track("form_start", { landingSlug });
  };

  const validateEmail = () => {
    if (!email) return setEmailError(null);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailError(ok ? null : "That email doesn't look right");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!moveIn) return setError("Pick when you're looking to move in.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("That email doesn't look right");
      return;
    }

    if (STATIC_DEMO) {
      setError(
        "This is a static preview — registration isn't wired up here. Email leasing@staxliving.ca and we'll add you to the list.",
      );
      return;
    }

    setState("sending");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          moveIn,
          floorPlanId,
          ...captureAttribution(),
          ...(landingSlug ? { landingSlug } : {}),
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        id?: string;
        score?: number;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setState("idle");
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }

      track("lead_submit", { id: data.id, score: data.score, landingSlug });
      setState("done");
      setTimeout(() => router.push(`/thank-you?id=${data.id}`), reduce ? 0 : 480);
    } catch {
      setState("idle");
      setError("Network problem. Check your connection and try again.");
    }
  }

  /* --- surface tokens, light vs dark --- */
  const rule = onDark ? "border-sand/25" : "border-ink/20";
  const stepText = onDark ? "text-grey" : "text-ink";

  const inputBase =
    "w-full min-h-14 rounded-xs border-b bg-transparent px-1 py-4 text-lead " +
    "outline-none transition-[border-color,box-shadow] duration-150 " +
    "ease-[var(--ease-out-soft)] focus:border-amber " +
    "focus:shadow-[var(--shadow-focus-rule)]";
  const inputTone = emailError
    ? "border-brick text-inherit placeholder:text-ink-faint/70"
    : onDark
      ? "border-sand/25 text-bone placeholder:text-grey/35"
      : "border-ink/25 text-ink placeholder:text-ink-faint/60";

  return (
    <div className={`grid ${className}`}>
      {/* Success state occupies the same grid cell, so the container morphs
          between heights instead of jumping (motion inventory #9). */}
      <div
        aria-hidden={state !== "done"}
        className={`col-start-1 row-start-1 flex items-center gap-4 transition-opacity duration-300 ${
          state === "done" ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
        }`}
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber shadow-glow"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-night" strokeWidth={2.5}>
            <path d="M4 10.5 L8 14.5 L16 6" strokeLinecap="round" />
          </svg>
        </span>
        <p className={`text-h3 ${onDark ? "text-bone" : "text-ink"}`} role="status">
          {state === "done" && "You’re on the list. Two quick questions…"}
        </p>
      </div>

      {state !== "done" && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`col-start-1 row-start-1 ${compact ? "space-y-6" : "space-y-8"}`}
        >
          {/* 01 — email */}
          <div>
            <div className={`mb-3 flex items-center gap-3 border-b pb-2 ${rule}`}>
              <span className="text-eyebrow tnum text-amber uppercase">01</span>
              <label
                htmlFor={`email-${uid}`}
                className={`text-eyebrow uppercase ${stepText}`}
              >
                Email
              </label>
            </div>
            <input
              id={`email-${uid}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onFocus={handleStart}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              onBlur={validateEmail}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? `email-error-${uid}` : undefined}
              className={`${inputBase} ${inputTone}`}
            />
            {emailError && (
              <p
                id={`email-error-${uid}`}
                className={`mt-2.5 text-sm font-medium ${onDark ? "text-amber" : "text-brick"}`}
              >
                {emailError}
              </p>
            )}
          </div>

          {/* 02 — move-in term */}
          <div>
            <div className={`mb-3 flex items-center gap-3 border-b pb-2 ${rule}`}>
              <span className="text-eyebrow tnum text-amber uppercase">02</span>
              <span className={`text-eyebrow uppercase ${stepText}`}>
                When are you moving in?
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Move-in term">
              {MOVE_IN_OPTIONS.map((opt) => {
                const selected = moveIn === opt.value;
                const base =
                  "min-h-13 cursor-pointer rounded-full border px-4 py-3 text-sm " +
                  "font-semibold tracking-wide uppercase leading-tight sm:px-6 " +
                  "transition-[background-color,color,border-color,box-shadow,transform] " +
                  "duration-300 active:translate-y-px";
                const tone = selected
                  ? "border-transparent bg-amber text-night shadow-glow [--glow-strength:0.25]"
                  : onDark
                    ? "border-sand/25 bg-transparent text-grey/80 hover:border-amber hover:text-amber"
                    : "border-ink/25 bg-transparent text-ink hover:border-amber hover:text-brick";
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      handleStart();
                      setMoveIn(opt.value);
                      setError(null);
                    }}
                    className={`${base} ${tone}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className={`text-sm font-medium ${onDark ? "text-bone" : "text-brick"}`}
            >
              {error}
            </p>
          )}

          {/* Submit. The brightest object on the entire site — the only
              amber fill, and the end of the light the hero's sun-circle
              started. Everything has been building to it. */}
          <button
            type="submit"
            disabled={state === "sending"}
            className="group flex min-h-16 w-full items-center justify-between gap-3 rounded-full bg-amber px-7 text-left text-sm font-bold tracking-[0.06em] text-night uppercase shadow-glow transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-amber-hot hover:shadow-flare [--flare-strength:0.4] active:translate-y-px disabled:opacity-60 sm:gap-4 sm:px-8 sm:text-base"
          >
            <span>{state === "sending" ? "Sending…" : ctaLabel}</span>
            <svg
              viewBox="0 0 32 12"
              aria-hidden="true"
              className="h-3 w-8 shrink-0 fill-none stroke-current transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5"
              strokeWidth={2}
            >
              <path d="M0 6 H29 M24 1.5 L29 6 L24 10.5" />
            </svg>
          </button>

          <p
            className={`hand text-center text-hand-sm ${
              onDark ? "text-grey/50" : "text-ink-faint"
            }`}
            style={{ ["--hand-tilt" as string]: "-1.5deg" }}
          >
            takes 15 seconds. no spam.
          </p>
        </form>
      )}
    </div>
  );
}
