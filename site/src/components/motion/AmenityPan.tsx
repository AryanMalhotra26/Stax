"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { MagneticLabel } from "@/components/motion/MagneticLabel";
import {
  ArtArrow,
  ArtBedLamp,
  ArtBus,
  ArtDoorKey,
  ArtRange,
  ArtShower,
  ArtTreeBench,
  ArtWifi,
} from "@/components/ui/LineArt";
import { AMENITIES } from "@/content/amenities";
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger);

/**
 * "What's Included" — the walkthrough (§5.4).
 *
 * The one pinned section on the site. Amenities are a list; a horizontal pan
 * makes a list feel like a walk through the building, and that sentence is
 * what justifies the animation — without one it would be deleted. It is also
 * the only place on the page where the scroll is taken away from the reader,
 * so the pinned distance is capped and the section earns it or it goes.
 *
 * The mechanic was already right. Everything around it was dead: seven
 * identical tiles on flat charcoal.
 *
 * THE SUBSTRATE IS THE FIX. This is the moment the page goes inside, and the
 * reference sells its equivalent by standing its cards on a real surface —
 * grass, a blanket, a compass — rather than on a colour. Four stacked
 * backgrounds do that job here: a bleed in from the section above, a bleed
 * out to the one below, a lamp thrown from the upper right, and a warm oak
 * floor at 18%. You are standing inside now; the floor says so.
 */

const ART = [
  ArtBus,
  ArtBedLamp,
  ArtWifi,
  ArtRange,
  ArtShower,
  ArtDoorKey,
  ArtTreeBench,
];

/** Surfaces cycle so seven cards read as a row with rhythm, not as tiles. */
const SURFACES = [
  "bg-bark text-grey",
  "bg-clay text-grey",
  "bg-linen text-ink",
  "bg-taupe text-bone",
  "bg-linen text-ink",
  "bg-clay text-grey",
  "bg-bark text-grey",
] as const;

export function AmenityPan() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
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

      // How far the track has to move for the last card to clear the right
      // edge. Never capped: capping this is capping how much of the content
      // is reachable, and the final card would simply never arrive.
      const travel = () => el.scrollWidth - window.innerWidth;

      // How much page scroll that costs the reader — and this IS capped, at
      // two viewport heights. Horizontal pins are the one place readers most
      // often feel trapped, and an uncapped one grows with the card count
      // until the section is a tunnel. Past the cap the track simply pans
      // faster per pixel scrolled, which nobody notices; an unreachable
      // seventh card is noticed immediately.
      const scrollLength = () => Math.min(travel(), window.innerHeight * 2);

      gsap.to(el, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top", // pin the moment the section hits the top —
          // starting anywhere else shows a half-slid track
          end: () => `+=${scrollLength()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // survives resize + orientation change
          anticipatePin: 1,
          onUpdate: (self) => {
            // The rail and the counter are the reader's only way to know how
            // much walk is left. Written straight to the DOM — a pinned
            // section re-rendering React on every scroll frame is how this
            // effect starts dropping frames.
            if (rail.current) {
              rail.current.style.transform = `scaleX(${self.progress})`;
            }
            if (counter.current) {
              const n = Math.min(
                AMENITIES.length,
                Math.floor(self.progress * AMENITIES.length) + 1,
              );
              counter.current.textContent = String(n).padStart(2, "0");
            }
          },
        },
      });
    });

    // Without this you leak triggers across soft navigations — App Router
    // keeps components mounted, and dead ScrollTriggers accumulate until
    // scrolling gets janky.
    return () => mm.revert();
  }, [reduce]);

  return (
    <section
      ref={wrap}
      aria-labelledby="amenities-heading"
      data-trail="inside"
      className="relative h-[100svh] overflow-hidden bg-espresso text-grey md:h-dvh"
      style={{
        backgroundImage: [
          "linear-gradient(to bottom, var(--color-paper), transparent 18%)",
          "linear-gradient(to top, var(--color-espresso), transparent 30%)",
          "radial-gradient(ellipse at 72% 18%, rgb(232 163 61 / 0.16), transparent 62%)",
          `url(${asset("/textures/oak-floor.webp")})`,
        ].join(", "),
        backgroundSize: "auto, auto, auto, 13%",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat",
      }}
    >
      <MagneticLabel label="Walk through" className="h-full">
        <div
          ref={track}
          // scroll-pl matches the track padding. Without it, snap-mandatory
          // aligns the first panel to the container edge rather than to the
          // padding edge, so on a phone the heading sits flush at x=0 with no
          // gutter and reads as clipped.
          className="flex h-full snap-x snap-mandatory scroll-pl-5 items-center gap-5 overflow-x-auto px-5 [scrollbar-width:none] md:snap-none md:gap-7 md:overflow-visible md:scroll-pl-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {/* Intro panel — carries the heading so the pan starts with context */}
          <div className="flex h-[74svh] w-[80vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] md:h-auto md:w-[42vw] md:px-14 lg:w-[32vw] lg:px-20">
            <Eyebrow className="text-brick">What&rsquo;s included</Eyebrow>
            <h2 id="amenities-heading" className="mt-6 text-h2 text-balance">
              The parts that decide whether a year goes well.
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-grey/60">
              Not a feature list. These are the seven things you will actually
              notice, every week, for eight months.
            </p>

            <p
              className="hand mt-10 hidden items-center gap-3 text-hand text-amber md:flex"
              style={{ ["--hand-tilt" as string]: "-4deg" }}
            >
              scroll to walk through
              <ArtArrow className="h-8 w-11 shrink-0 -scale-y-100" />
            </p>
          </div>

          {AMENITIES.map((amenity, i) => {
            const Art = ART[i % ART.length];
            return (
              <article
                key={amenity.id}
                // Fixed height so every card's image top and caption baseline
                // line up across the pan — `items-center` alone centres each
                // card by its own height, which makes shorter captions drift.
                className={`card flex h-[74svh] w-[80vw] shrink-0 snap-start flex-col p-4 sm:w-[56vw] md:h-[70vh] md:w-[34vw] md:p-5 lg:w-[26vw] ${SURFACES[i % SURFACES.length]}`}
                style={{ ["--tilt" as string]: i % 2 ? "1.5deg" : "-1.5deg" }}
              >
                <Art className="pointer-events-none absolute -right-10 -bottom-12 h-[58%] w-auto opacity-8" />

                <div className="relative z-2 min-h-0 flex-1 overflow-hidden rounded-sm bg-night/20">
                  <Render
                    media={amenity.media}
                    sizes="(max-width: 767px) 80vw, (max-width: 1023px) 34vw, 26vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-night/55 px-2.5 py-1 text-eyebrow tnum text-bone/80 uppercase backdrop-blur-[2px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative z-2 mt-5 shrink-0 text-h3">
                  {amenity.title}
                </h3>
                <p className="relative z-2 mt-3 shrink-0 text-[0.9375rem] leading-relaxed opacity-70 md:h-24">
                  {amenity.line}
                </p>
              </article>
            );
          })}

          {/* Trailing spacer so the last card clears the right edge */}
          <div className="w-5 shrink-0 md:w-[10vw]" aria-hidden="true" />
        </div>
      </MagneticLabel>

      {/* ---- Progress rail --------------------------------------------
          The one piece of information a pinned section owes the reader: how
          much of it is left. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden md:block">
        <div className="container-stax flex items-center gap-5">
          <div className="h-px flex-1 overflow-hidden bg-sand/20">
            <span
              ref={rail}
              className="block h-full origin-left scale-x-0 bg-brick"
            />
          </div>
          <p className="shrink-0 text-eyebrow tnum text-grey/50 uppercase">
            <span ref={counter}>01</span> / {String(AMENITIES.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
