"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "motion/react";
import { Render } from "@/components/ui/Render";
import { MEDIA, type Media, type MediaCategory } from "@/content/generated/media";

gsap.registerPlugin(Flip);

/**
 * Categorised gallery with a Flip lightbox (§3.2 §4, motion inventory #6).
 *
 * Flip rather than a fade: the image morphs from its grid position to the
 * overlay, so the viewer never loses track of which thumbnail they opened.
 * That is spatial continuity, and it is the one thing a fade cannot do.
 */

const CATEGORIES: { value: MediaCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "interior", label: "Interiors" },
  { value: "exterior", label: "Exteriors" },
  { value: "neighbourhood", label: "Site plan" },
];

export function Gallery() {
  const [category, setCategory] = useState<MediaCategory | "all">("all");
  const [open, setOpen] = useState<Media | null>(null);
  const reduce = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const items = MEDIA.filter(
    (m) => category === "all" || m.category === category,
  ) as unknown as Media[];

  const openImage = useCallback(
    (item: Media, el: HTMLElement) => {
      if (!reduce) flipState.current = Flip.getState(el);
      setOpen(item);
    },
    [reduce],
  );

  const close = useCallback(() => setOpen(null), []);

  // Morph the overlay image into place from the thumbnail it came from.
  useEffect(() => {
    if (!open || reduce || !flipState.current || !overlayRef.current) return;
    const target = overlayRef.current.querySelector<HTMLElement>("[data-flip-target]");
    if (!target) return;

    Flip.from(flipState.current, {
      targets: target,
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
    });
    flipState.current = null;
  }, [open, reduce]);

  // Escape to close, and lock the page behind the overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lightbox-lock");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lightbox-lock");
    };
  }, [open, close]);

  const index = open ? items.findIndex((m) => m.id === open.id) : -1;
  const step = (delta: number) => {
    if (index < 0) return;
    const next = (index + delta + items.length) % items.length;
    flipState.current = null;
    setOpen(items[next]);
  };

  return (
    <div id="gallery" className="scroll-mt-28">
      <div
        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Filter gallery"
      >
        {CATEGORIES.map((c) => {
          const active = category === c.value;
          return (
            <button
              key={c.value}
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.value)}
              className={`shrink-0 min-h-11 px-5 text-[0.9375rem] font-medium border transition-colors duration-150 ${
                active
                  ? "rounded-full bg-ink text-bone border-ink"
                  : "bg-transparent text-ink border-ink/20 hover:border-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div
        ref={gridRef}
        className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-3.5 [column-fill:balance]"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={(e) => openImage(item, e.currentTarget.firstElementChild as HTMLElement)}
            className="group block w-full mb-3.5 break-inside-avoid overflow-hidden rounded-md bg-grey cursor-zoom-in"
            aria-label={`Open image: ${item.alt}`}
          >
            <div className="relative">
              <Render
                media={item}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                // First row eager so the gallery does not open empty; the
                // rest lazy-load below the fold (§3.2).
                priority={i < 3}
                className="block w-full"
                imgClassName="w-full h-auto transition-transform duration-600 ease-[var(--ease-out-expo)] group-hover:scale-103"
              />
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          className="fixed inset-0 z-100 bg-espresso/97 flex items-center justify-center p-4 md:p-10"
          onClick={close}
        >
          <div
            data-flip-target
            className="relative max-w-6xl max-h-[86dvh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Render
              media={open}
              sizes="90vw"
              priority
              className="block w-full h-full"
              imgClassName="w-full h-full max-h-[78dvh] object-contain"
            />
            <p className="mt-4 text-sm text-grey/60 max-w-2xl">{open.alt}</p>
          </div>

          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center text-bone hover:text-brick transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current" strokeWidth={1.5}>
              <path d="M5 5 L19 19 M19 5 L5 19" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-grey/70 hover:text-bone transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none" strokeWidth={1.5}>
              <path d="M15 4 L7 12 L15 20" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-grey/70 hover:text-bone transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-current fill-none" strokeWidth={1.5}>
              <path d="M9 4 L17 12 L9 20" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
