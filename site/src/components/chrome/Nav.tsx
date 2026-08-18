"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui";

const LINKS = [
  { href: "/residences", label: "Residences" },
  { href: "/about", label: "About" },
  { href: "/register", label: "Register" },
] as const;

/**
 * Hide on scroll down, reveal on scroll up (motion inventory #8).
 *
 * Plain scroll listener rather than ScrollTrigger: this mounts on every page
 * including the ad landing routes, and pulling GSAP into the root layout to
 * translate one element would blow the landing-route JS budget for no reason
 * (§6.2 rule 2).
 *
 * `variant` controls the unscrolled state. Pages that open on a full-bleed
 * render need white links (`overlay`); pages that open on white need ink
 * (`solid`). Once scrolled, the bar goes opaque and both resolve to ink.
 */
export function Nav({ variant = "solid" }: { variant?: "solid" | "overlay" }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (!reduce) {
        // 8px deadzone stops the bar flickering on trackpad micro-scrolls
        if (Math.abs(y - lastY.current) > 8) {
          setHidden(y > lastY.current && y > 160);
          lastY.current = y;
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Overlay styling only applies while unscrolled and the sheet is closed.
  const onImage = variant === "overlay" && !scrolled && !open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[transform,background-color,border-color] duration-400 ease-[var(--ease-out-expo)] ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || open
          ? "bg-bone/92 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scrim behind the bar on image heroes — guarantees the links clear
          contrast regardless of what the render happens to be doing up there. */}
      {onImage && (
        <div
          className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/45 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      )}

      <nav className="container-stax relative flex items-center justify-between h-18 md:h-20">
        <Link href="/" aria-label="Stax — home" className="relative z-10">
          <Logo
            className={`h-6 md:h-7 w-auto transition-colors ${
              onImage ? "text-white" : "text-ink"
            }`}
          />
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.9375rem] font-medium transition-colors hover:text-brick ${
                pathname === link.href
                  ? "text-brick"
                  : onImage
                    ? "text-white"
                    : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/register" className={buttonClass("primary", "md")}>
            Register your interest
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden relative z-10 w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-[5px]"
        >
          <span
            className={`block w-6 h-[2px] transition-transform duration-300 ${
              onImage ? "bg-white" : "bg-ink"
            } ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] transition-opacity duration-200 ${
              onImage ? "bg-white" : "bg-ink"
            } ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] transition-transform duration-300 ${
              onImage ? "bg-white" : "bg-ink"
            } ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-400 ease-[var(--ease-out-expo)] ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="container-stax pb-8 pt-2 flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-h3 py-3 border-b border-line"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/register" className={buttonClass("primary", "lg", "mt-5")}>
            Register your interest
          </Link>
        </div>
      </div>
    </header>
  );
}
