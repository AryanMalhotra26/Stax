"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MOVE_IN_OPTIONS } from "@/lib/site";
import { captureAttribution, track } from "@/lib/attribution";
import { PHONE_ERROR, PHONE_REQUIRED, isValidPhone } from "@/lib/phone";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A static export (GitHub Pages) has no server, so /api/lead does not exist.
 * Rather than let the submit fail silently — the worst possible outcome on the
 * one element the site exists for — the form says so and offers email instead.
 */
const STATIC_DEMO = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

/**
 * The capture form (§7.1), poster treatment.
 *
 * THREE FIELDS NOW, AND PHONE IS ONE OF THEM. It was deliberately absent: it
 * is the most abandonment-prone field on a cold form, and it was asked for on
 * the thank-you page instead, from somebody who had already said yes once.
 * The client wants a number from every registration, which is a defensible
 * trade — a list of 100 addresses the leasing team cannot ring is worth less
 * than 80 they can — but it IS a trade, and the cost lands here. Three fields
 * still sits inside the 1–3 band that outperforms longer forms; a fourth
 * would not.
 *
 * It sits second rather than last so the two "how do we reach you" fields
 * read as a single block, which leaves the move-in pills as the last thing
 * touched before the submit — one tap into the button instead of a keyboard.
 *
 * The surface is architectural rather than boxed (§5.9): inputs are a single
 * bottom rule that lights on focus, choices are pills, and the submit is the
 * one glowing button on the site — the brightest object on the
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
  // "Get the floor plans", not "Get floor plans & pricing". The button is
  // the last thing read before somebody hands over an email address, so it
  // is the last place that should still promise pricing the list does not
  // get first — rents publish Sept 2026, the list opens Fall 2026. Same
  // one-word correction as the Register section's body copy (Pass 6 §3.7).
  ctaLabel = "Get the floor plans",
  landingSlug,
  className = "",
  compact = false,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
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

  /**
   * Blur, not keystroke. Telling somebody their number is wrong while they
   * are three digits into typing it is the fastest way to make a required
   * field feel broken.
   *
   * An empty field clears rather than complains — "we need a phone number"
   * belongs on submit, when leaving it blank has actually become a problem.
   */
  const validatePhone = () => {
    if (!phone.trim()) return setPhoneError(null);
    setPhoneError(isValidPhone(phone) ? null : PHONE_ERROR);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Top-down, so the error names the first field with a problem rather
    // than the last. With two fields the order barely mattered; with three
    // it is the difference between a pointer and a guess.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("That email doesn't look right");
      return;
    }
    if (!phone.trim()) {
      setPhoneError(PHONE_REQUIRED);
      return;
    }
    if (!isValidPhone(phone)) {
      setPhoneError(PHONE_ERROR);
      return;
    }
    if (!moveIn) return setError("Pick when you're looking to move in.");

    if (STATIC_DEMO) {
      setError(
        "This is a static preview — registration isn't wired up here. Email info@staxliving.ca and we'll add you to the list.",
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
          phone,
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
  /**
   * The step index takes the brand red on light surfaces and the brand grey
   * on dark ones, and it has to vary because this form renders on both: the
   * Register section is `night`, but the residences plan pack and the
   * enrichment step are `bone`. Brick measures 5.24 on bone and 3.24 on the
   * dark panel; Light Grey is 14.86 on the panel and 1.12 on bone. Neither
   * one works in both places, and a constant here is invisible in one of
   * them.
   */
  const stepIndex = onDark ? "text-light-grey" : "text-brick";

  const inputBase =
    "w-full min-h-14 rounded-xs border-b bg-transparent px-1 py-4 text-lead " +
    "outline-none transition-[border-color,box-shadow] duration-150 " +
    "ease-[var(--ease-out-soft)] focus:border-brick-light " +
    "focus:shadow-[var(--shadow-focus-rule)]";
  /** Per field, now that more than one of them can be wrong at a time. */
  const inputTone = (invalid: boolean) =>
    invalid
      ? "border-brick text-inherit placeholder:text-ink-faint/70"
      : onDark
        ? "border-sand/25 text-bone placeholder:text-grey/75"
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
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brick shadow-[var(--shadow-glow),0_0_0_1px_rgb(232_163_61_/_0.3)]"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-white" strokeWidth={2.5}>
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
              <span className={`text-eyebrow tnum uppercase ${stepIndex}`}>
                01
              </span>
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
              className={`${inputBase} ${inputTone(!!emailError)}`}
            />
            {emailError && (
              <p
                id={`email-error-${uid}`}
                className={`mt-2.5 text-sm font-medium ${onDark ? "text-brick-light" : "text-brick"}`}
              >
                {emailError}
              </p>
            )}
          </div>

          {/* 02 — phone. Required, at the client's request. The `required`
              attribute below is a courtesy to the browser; the check that
              counts is in the route, because /api/lead is public and takes
              JSON from anybody. */}
          <div>
            <div className={`mb-3 flex items-center gap-3 border-b pb-2 ${rule}`}>
              <span className={`text-eyebrow tnum uppercase ${stepIndex}`}>
                02
              </span>
              <label
                htmlFor={`phone-${uid}`}
                className={`text-eyebrow uppercase ${stepText}`}
              >
                Phone
              </label>
            </div>
            <input
              id={`phone-${uid}`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="(905) 555-0142"
              value={phone}
              onFocus={handleStart}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError(null);
              }}
              onBlur={validatePhone}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? `phone-error-${uid}` : undefined}
              className={`${inputBase} ${inputTone(!!phoneError)}`}
            />
            {phoneError && (
              <p
                id={`phone-error-${uid}`}
                className={`mt-2.5 text-sm font-medium ${onDark ? "text-brick-light" : "text-brick"}`}
              >
                {phoneError}
              </p>
            )}
          </div>

          {/* 03 — move-in term */}
          <div>
            <div className={`mb-3 flex items-center gap-3 border-b pb-2 ${rule}`}>
              <span className={`text-eyebrow tnum uppercase ${stepIndex}`}>
                03
              </span>
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
                  ? "border-transparent bg-brick text-white shadow-[var(--shadow-glow),0_0_0_1px_rgb(232_163_61_/_0.28)] [--glow-strength:0.25]"
                  : onDark
                    ? "border-sand/25 bg-transparent text-grey/80 hover:border-brick-light hover:text-brick-light"
                    : "border-ink/25 bg-transparent text-ink hover:border-brick hover:text-brick";
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

          {/* Submit. The brightest object on the entire site, and the end of
              the light the hero's sun-circle started.

              The fill is the brand red and the halo around it is still amber
              — the object changes colour, the light does not. Hover deepens
              to brick-dark rather than brightening: for a red, more energy
              is deeper, and brightening one only walks it toward pink. Night
              on brick measures 2.62, so the label is white at 5.37. */}
          <button
            type="submit"
            disabled={state === "sending"}
            className="group flex min-h-16 w-full items-center justify-between gap-3 rounded-full bg-brick px-7 text-left text-sm font-bold tracking-[0.06em] text-white uppercase shadow-[var(--shadow-glow),0_0_0_1px_rgb(232_163_61_/_0.28)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-brick-dark hover:shadow-[var(--shadow-flare),0_0_0_1px_rgb(255_184_77_/_0.5)] [--flare-strength:0.4] active:translate-y-px disabled:opacity-60 sm:gap-4 sm:px-8 sm:text-base"
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
              onDark ? "text-grey/75" : "text-ink-faint"
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
