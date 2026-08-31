"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { FEATURES } from "@/config/features";

/**
 * One list, rendered twice — the desktop row and the mobile sheet read from
 * it, so a route can never be present in one and missing from the other.
 * Residences comes out with the floor plans: linking to a page that
 * redirects is a worse experience than not offering it.
 */
const LINKS = [
  ...(FEATURES.floorPlans
    ? [{ href: "/residences", label: "Residences" }]
    : []),
  { href: "/about", label: "About" },
  { href: "/register", label: "Register" },
] as const;

/**
 * The floating pill (§4.6).
 *
 * The previous bar was a transparent full-width strip that changed colour
 * against whatever happened to be behind it — which meant it had to carry a
 * scrim, two link colour schemes and a `variant` prop, and it still read as
 * browser chrome rather than as part of the page. A pill that floats clear of
 * every edge is one object with one appearance, and it lets the hero run
 * full-bleed underneath it.
 *
 * Glass is used exactly twice on this site and both are floating chrome —
 * never on content (§3.3).
 *
 * Amber appears here in exactly one role, link hover, matching the reference's
 * restraint: their accent does one job in the nav and nothing else.
 *
 * Hide on scroll down, show on scroll up (motion inventory). The reference
 * does this with a zero-threshold listener, which is twitchy on a trackpad —
 * this uses a 12px threshold and ignores the first 120px of the page, so the
 * bar never flickers while you settle at the top.
 *
 * Plain scroll listener rather than ScrollTrigger: this mounts on every route
 * including the ad landing pages, and pulling GSAP into the root layout to
 * translate one element would blow their JS budget for no reason.
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) > 12) {
        setHidden(y > lastY.current && y > 120);
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 py-4 transition-[transform,opacity] duration-300 ease-[var(--ease-out-expo)] md:py-6 ${
        hidden && !open ? "-translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`chrome-glass mx-[clamp(0.75rem,4vw,4rem)] rounded-md border border-sand/14 shadow-lift transition-[border-radius] duration-300 md:rounded-full ${
          open ? "rounded-md" : ""
        }`}
      >
        <nav className="flex min-h-16 items-center justify-between gap-6 pr-3 pl-5 md:min-h-19 md:pr-4 md:pl-10">
          <Link
            href="/"
            aria-label="Stax — home"
            className="-my-3 shrink-0 rounded-xs py-3"
          >
            <Logo className="h-6 w-auto text-bone transition-colors hover:text-brick-light md:h-7" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-300 ${
                    active
                      ? "text-brick-light"
                      : "text-grey hover:text-brick-light"
                  }`}
                >
                  {/* Active state is a soft lamp behind the label rather than
                      a rule under it. The lamp is still amber because a
                      radial gradient is light; the label on top of it is
                      brick-light, because the brand red at 15px on this
                      glass measures 3.24 against a 4.5 requirement. */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgb(232 163 61 / 0.18), transparent 70%)",
                      }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* "Talk to us" is gone (Pass 6 §1.2).

                It was a `tel:` link to `+1 (905) 000-0000` — a placeholder
                number, so anyone who tapped it got a dead call, which is the
                one failure mode worse than not offering a phone number at
                all. The client has moved to email only.

                Deleted rather than converted to a `mailto:`. Pass 2 flagged
                this element as the one thing in the nav a reader could not
                tell was clickable, and the argument for keeping it was that a
                parent reading at 9pm wants a number — which is exactly what
                is no longer on offer. REGISTER is the nav's job; the footer,
                the FAQ sign-off and the register form all carry the leasing
                address for anyone who would rather write. */}
            <Link
              href="/register"
              className="hidden rounded-full bg-brick px-7 py-3.5 text-[0.8125rem] font-bold tracking-[0.06em] text-bone uppercase transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brick-dark hover:shadow-glow [--glow-strength:0.3] md:block"
            >
              Register
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`block h-[2px] w-6 bg-bone transition-transform duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-bone transition-opacity duration-200 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-bone transition-transform duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile sheet — inside the pill, so it opens as one object. */}
        <div
          className={`grid overflow-clip transition-[grid-template-rows] duration-600 ease-[var(--ease-out-expo)] md:hidden ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <div className="flex flex-col px-5 pt-1 pb-6">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-sand/12 py-3.5 text-h3 text-bone"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="mt-5 rounded-full bg-brick px-7 py-4 text-center text-[0.8125rem] font-bold tracking-[0.06em] text-bone uppercase"
              >
                Register your interest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
