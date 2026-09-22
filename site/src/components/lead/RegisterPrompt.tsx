"use client";

import { useEffect, useRef, useState } from "react";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { SITE } from "@/lib/site";

/**
 * The registration prompt.
 *
 * Asked for directly: visitors should get the chance to register without
 * scrolling. Built with the three things that decide whether a dialog like
 * this converts or just annoys.
 *
 * 1. IT WAITS. Firing on load interrupts a person before they know what the
 *    page is, and a prompt you dismiss before reading is worse than no
 *    prompt — you have spent the interruption and bought nothing. Six seconds
 *    is long enough to have read the headline and the amenity strip and
 *    formed an opinion worth acting on.
 *
 * 2. IT ONLY ASKS ONCE. A dismissal is an answer. `localStorage` remembers
 *    it, so the second visit is not the first argument again — and somebody
 *    who has already registered never sees it at all.
 *
 * 3. IT IS A REAL DIALOG. Focus moves into it, Escape closes it, focus goes
 *    back where it came from, and the page behind it does not scroll. A
 *    modal that traps a keyboard user is not a conversion device, it is a
 *    dead end.
 *
 * Deliberately NOT on /register or the ad landing pages: those pages already
 * are the form, and covering a form with the same form is how a funnel
 * insults the people furthest down it.
 */

const SEEN_KEY = "stax_register_prompt_v1";
const DELAY_MS = 6000;

export function RegisterPrompt() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    // Wrapped: Safari in private mode throws on access, and a storage
    // failure must not decide whether the page shows a dialog.
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Treated as unseen. The worst case is one prompt per visit for a
      // reader whose browser blocks storage, which is the same behaviour
      // every other site in that browser has.
    }
    if (seen) return;

    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Nothing to do — it simply asks again next time. */
    }
    if (restoreFocusTo.current instanceof HTMLElement) {
      restoreFocusTo.current.focus();
    }
  };

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Keep Tab inside the dialog. Without this the next Tab lands on the
      // nav behind the scrim, where a sighted keyboard user cannot see the
      // focus ring and has no way back.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center overflow-y-auto bg-night/70 p-5 backdrop-blur-sm"
      // The scrim closes it. A dialog with no way out but one small button is
      // the pattern people mean when they say "pop-up".
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-prompt-heading"
        tabIndex={-1}
        className="animate-rise relative w-full max-w-lg rounded-lg border border-sand/15 bg-bark p-7 shadow-lift outline-none md:p-9"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-grey/75 transition-colors duration-150 hover:bg-sand/10 hover:text-bone"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 stroke-current" strokeWidth={1.6}>
            <path d="M3 3 L13 13 M13 3 L3 13" />
          </svg>
        </button>

        <p className="font-sans text-eyebrow uppercase text-light-grey">
          Priority list · {SITE.facts.occupancyShort}
        </p>

        <h2
          id="register-prompt-heading"
          className="mt-4 text-h3 text-bone"
        >
          Get the plans before anyone else.
        </h2>

        <p className="mt-3 leading-relaxed text-grey/75">
          Floor plans and lease dates go to this list first. Fifteen seconds,
          and it commits you to nothing.
        </p>

        <div className="mt-6">
          <CaptureForm onDark compact ctaLabel="Register your interest" />
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="mt-5 w-full rounded-xs py-2 text-[0.9375rem] text-grey/60 transition-colors duration-150 hover:text-grey"
        >
          No thanks — I&rsquo;m just looking
        </button>
      </div>
    </div>
  );
}
