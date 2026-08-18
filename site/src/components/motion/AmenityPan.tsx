"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { AMENITIES } from "@/content/amenities";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one pinned section on the site (§6.2 rule 5).
 *
 * Amenities are a list; a horizontal pan makes a list feel like a walk
 * through the building. That is the sentence that justifies the animation —
 * without one it would be deleted (rule 6).
 *
 * This used to pin on desktop only and hand phones a native scroll-snap
 * strip, on the argument that pinning fights the platform's own scroll. The
 * jank that argument is about is real but it is specific: it comes from the
 * URL bar showing and hiding, which changes viewport height mid-pin and makes
 * ScrollTrigger recalculate under the visitor. Two things remove it —
 * `ignoreMobileResize`, which stops a refresh firing on a height-only change,
 * and sizing the section in `svh` rather than `dvh`, which is the unit that
 * does not move when the bar does.
 *
 * With those in place the phone gets the same walk as the desktop.
 *
 * The strip is still the fallback, not a dead branch: it is what renders
 * under `prefers-reduced-motion` and if the effect never runs, so the section
 * stays swipeable with no JavaScript at all. The pan switches the overflow
 * off through `gsap.set`, which `mm.revert()` restores.
 */
export function AmenityPan() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;

    // The URL bar changing height must not trigger a refresh mid-pin. This is
    // the single setting that makes pinning viable on a phone.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    mm.add("all", () => {
      const el = track.current;
      const container = wrap.current;
      if (!el || !container) return;

      // Native horizontal scrolling would compete with the pan for the same
      // gesture, so it is switched off while the pan owns the track. Set
      // through gsap so mm.revert() puts the swipe strip back.
      gsap.set(el, { overflowX: "hidden", scrollSnapType: "none" });

      const distance = () => el.scrollWidth - window.innerWidth;

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top", // pin the moment the section hits the top —
          // starting anywhere else shows a half-slid track
          end: () => `+=${distance()}`, // scroll length == horizontal travel
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // survives resize + orientation change
          anticipatePin: 1,
        },
      });
    });

    // Without this you leak triggers across soft navigations — App Router
    // keeps components mounted, and dead ScrollTriggers accumulate until
    // scrolling gets janky (§6.4).
    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      ref={wrap}
      aria-labelledby="amenities-heading"
      className="relative h-[100svh] overflow-hidden bg-charcoal text-grey md:h-dvh"
    >
      <div
        ref={track}
        // scroll-pl matches the track padding. Without it, snap-mandatory
        // aligns the first panel to the container edge rather than to the
        // padding edge, so on a phone the heading sits flush at x=0 with no
        // gutter and reads as clipped.
        className="flex h-full snap-x snap-mandatory scroll-pl-5 items-center gap-5 overflow-x-auto px-5 [scrollbar-width:none] md:h-dvh md:snap-none md:gap-0 md:overflow-visible md:scroll-pl-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {/* Intro panel — carries the heading so the pan starts with context */}
        <div className="flex h-[76svh] w-[80vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] md:h-auto md:w-[42vw] md:px-14 lg:w-[34vw] lg:px-20">
          <Eyebrow className="text-brick">What&rsquo;s included</Eyebrow>
          <h2 id="amenities-heading" className="text-h2 mt-6 text-balance">
            The parts that decide whether a year goes well.
          </h2>
          <p className="mt-6 text-grey/60 leading-relaxed max-w-sm">
            Not a feature list. These are the seven things you will actually
            notice, every week, for eight months.
          </p>
          <p className="mt-10 hidden md:flex items-center gap-3 text-eyebrow uppercase text-grey/40">
            Scroll to walk through
            <svg viewBox="0 0 40 8" className="w-10 h-2 fill-none stroke-current" strokeWidth={1.5}>
              <path d="M0 4 H36 M32 1 L36 4 L32 7" />
            </svg>
          </p>
        </div>

        {AMENITIES.map((amenity, i) => (
          <article
            key={amenity.id}
            // Fixed height so every card's image top and caption baseline line
            // up across the pan — `items-center` alone centres each card by
            // its own height, which makes shorter captions drift.
            className="flex h-[76svh] w-[80vw] shrink-0 snap-start flex-col sm:w-[56vw] md:h-[72vh] md:w-[34vw] md:px-4 lg:w-[27vw] lg:px-5"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden bg-black/20">
              <Render
                media={amenity.media}
                sizes="(max-width: 767px) 80vw, (max-width: 1023px) 34vw, 27vw"
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 text-eyebrow uppercase text-white/70 tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="text-h3 mt-5 shrink-0 md:mt-6">{amenity.title}</h3>
            <p className="mt-3 shrink-0 leading-relaxed text-grey/60 md:h-24">
              {amenity.line}
            </p>
          </article>
        ))}

        {/* Trailing spacer so the last card clears the right edge */}
        <div className="shrink-0 w-5 md:w-[12vw]" aria-hidden="true" />
      </div>
    </section>
  );
}
