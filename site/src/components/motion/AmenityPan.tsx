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
 * Below `md` this degrades to a native horizontal scroll-snap strip. Pinning
 * on a phone fights the browser's own scroll and reads as jank on mid-range
 * Android, which is a large share of this audience.
 */
export function AmenityPan() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const el = track.current;
      const container = wrap.current;
      if (!el || !container) return;

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
      className="relative overflow-hidden bg-charcoal text-grey md:h-dvh"
    >
      <div
        ref={track}
        className="flex gap-5 md:gap-0 md:h-dvh md:items-center px-5 md:px-0 py-16 md:py-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Intro panel — carries the heading so the pan starts with context */}
        <div className="shrink-0 w-[80vw] sm:w-[60vw] md:w-[42vw] lg:w-[34vw] snap-start md:px-14 lg:px-20 flex flex-col justify-center">
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
            className="shrink-0 w-[80vw] sm:w-[56vw] md:w-[34vw] lg:w-[27vw] snap-start md:px-4 lg:px-5 md:h-[72vh] md:flex md:flex-col"
          >
            <div className="relative aspect-4/5 md:aspect-auto md:flex-1 md:min-h-0 overflow-hidden bg-black/20">
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
            <h3 className="text-h3 mt-6 md:shrink-0">{amenity.title}</h3>
            <p className="mt-3 text-grey/60 leading-relaxed md:shrink-0 md:h-24">
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
