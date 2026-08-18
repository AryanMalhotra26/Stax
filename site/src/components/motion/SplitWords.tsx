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

/**
 * Per-letter variant, for display-scale headings only.
 *
 * to-top.ch runs every heading on the page through GSAP SplitText and tweens
 * each letter on a scrubbed ScrollTrigger — 297 letter nodes and 704 split
 * elements on one page, all of it JavaScript.
 *
 * The cascade is worth having; the cost is not. This produces the same
 * per-letter stagger from the native scroll timeline, so it costs no
 * JavaScript, no ScrollTrigger and no per-frame work — and it stays a server
 * component. `--i` carries the letter index and globals.css offsets each
 * letter's `animation-range` by it.
 *
 * Reserved for hero-scale headings. Below that the node count stops being
 * worth the effect and `SplitWords` is the right tool.
 *
 * Accessibility matches the reference's approach, which is the correct one:
 * the split spans are `aria-hidden` and the heading carries the whole string
 * as `aria-label`, so assistive tech reads the sentence and never the letters.
 */
export function SplitLetters({
  text,
  startIndex = 0,
}: {
  text: string;
  /** Continues the cascade across a manually broken heading. */
  startIndex?: number;
}) {
  // Indices are resolved up front rather than with a counter mutated during
  // render. React Compiler is enabled on this project, and a variable
  // reassigned mid-render is exactly the pattern it cannot safely memoize.
  let cursor = startIndex;
  const tokens = text.split(/(\s+)/).map((chunk) => {
    if (/^\s+$/.test(chunk)) return { space: chunk, letters: [] };
    const letters = [...chunk].map((ch) => ({ ch, i: cursor++ }));
    return { space: null, letters };
  });

  return (
    <span aria-hidden="true">
      {tokens.map((token, idx) =>
        token.space !== null ? (
          token.space
        ) : (
          <span key={idx} className="inline-block whitespace-nowrap">
            {token.letters.map(({ ch, i }) => (
              <span key={i} className="sd-letter" style={{ ["--i" as string]: i }}>
                <span>{ch}</span>
              </span>
            ))}
          </span>
        ),
      )}
    </span>
  );
}
