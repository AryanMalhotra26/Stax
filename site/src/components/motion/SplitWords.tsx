/**
 * Splits a string into per-word spans for the scroll-linked reveal.
 *
 * Deliberately a server component. The obvious implementation is GSAP's
 * SplitText, but that pulls GSAP into whichever route uses it — and Turbopack
 * hoists a statically-imported GSAP into a chunk shared by every route,
 * including the ad landing pages where the JS budget is tightest. Wrapping
 * words in spans is not work that needs a library or a client boundary.
 *
 * `--i` carries the word index; globals.css offsets each word's
 * `animation-range` by it to produce the cascade.
 *
 * Accessibility: the spans sit inside the original heading and contain the
 * original words in order, with whitespace preserved between them, so
 * assistive tech reads the sentence normally. No aria juggling required.
 */
export function SplitWords({ text }: { text: string }) {
  const words = text.split(/(\s+)/);
  let i = -1;

  return (
    <>
      {words.map((chunk, idx) => {
        if (/^\s+$/.test(chunk)) return chunk;
        i += 1;
        return (
          <span
            key={idx}
            className="sd-word"
            style={{ ["--i" as string]: i }}
          >
            <span>{chunk}</span>
          </span>
        );
      })}
    </>
  );
}
