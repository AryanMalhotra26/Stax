"use client";

import { useSyncExternalStore } from "react";

/**
 * Local `prefers-reduced-motion` hook.
 *
 * Exists so the conversion path — CaptureForm and the thank-you enrichment —
 * does not have to import `motion/react` purely to read a media query.
 * Motion is ~46KB gzipped, which is a third of the entire JS budget for
 * `/l/*` (§6.1), and the landing route's only animation is one state swap
 * that CSS does natively.
 *
 * A media query is external state that React does not own, which is exactly
 * what `useSyncExternalStore` is for: subscribe, read, and let React handle
 * the server snapshot. The obvious `useState` + `useEffect` version has to
 * render once with the wrong answer and then set state to correct it, which
 * is a second render of every consumer on every mount.
 *
 * The server snapshot is `false`. The animations this guards are
 * entrance-only, so a first frame before correction is not a problem, and the
 * CSS `@media (prefers-reduced-motion: reduce)` block in globals.css is the
 * belt to this hook's braces.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
