"use client";

import { useEffect, useState } from "react";

/**
 * Local `prefers-reduced-motion` hook.
 *
 * Exists so the conversion path — CaptureForm and the thank-you enrichment —
 * does not have to import `motion/react` purely to read a media query.
 * Motion is ~46KB gzipped, which is a third of the entire JS budget for
 * `/l/*` (§6.1), and the landing route's only animation is one state swap
 * that CSS does natively.
 *
 * Defaults to `false` on the server and corrects on mount. The animations it
 * guards are entrance-only, so a first frame before correction is not a
 * problem; the CSS `@media (prefers-reduced-motion: reduce)` block in
 * globals.css is the belt to this hook's braces.
 */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduce;
}
