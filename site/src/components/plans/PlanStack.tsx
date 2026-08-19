"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The sticky plan stack (§5.3).
 *
 * Stacking itself is pure CSS `position: sticky` — the reference has 64
 * ScrollTriggers and not one pinned section, and it is right: a pin takes the
 * scroll away from the reader, and this effect does not need it.
 *
 * What JavaScript adds is the depth. Without it, four cards landing on top of
 * each other read as a deck being dealt; scaling each card down as the next
 * one arrives makes the same motion read as cards receding *behind* the front
 * one. The reference bottoms out at 0.517, which is aggressive for four cards
 * this tall — 0.715 at the deepest reads as depth without looking broken.
 *
 * GSAP is imported inside the effect rather than at module scope. A static
 * import gets hoisted by Turbopack into a chunk shared by every route, and the
 * ad landing pages must not pay for a floor-plan animation they never render.
 */
export function PlanStack({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      // Sticky is off below `lg` — the cards stack vertically there — so the
      // depth tween has nothing to describe and must not run.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = gsap.utils.toArray<HTMLElement>("[data-plan-card]", el);

          // Every card starts from an explicit `brightness(1)`.
          //
          // Without it the cards sit at `filter: none`, and interpolating a
          // filter list out of `none` treats every missing function as its
          // ZERO value rather than its identity — so `brightness` animated
          // from 0, and each card went fully black at the start of its scrub
          // before brightening to 0.82. Naming the resting state makes the
          // tween 1 → 0.82, which is what it always meant.
          gsap.set(cards, { filter: "brightness(1)" });

          cards.forEach((card, i) => {
            // The front card never shrinks. Nothing lands on top of it.
            if (i === cards.length - 1) return;

            gsap.to(card, {
              scale: 0.88 - (cards.length - 1 - i) * 0.055,
              filter: "brightness(0.82)",
              ease: "none",
              scrollTrigger: {
                // Driven by the *next* card's approach, so a card recedes
                // exactly as the one covering it arrives.
                trigger: cards[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
          });
        },
      );

      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={root} className={`plan-stack ${className}`}>
      {children}
    </div>
  );
}
