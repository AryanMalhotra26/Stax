import { Reveal } from "@/components/motion/Reveal";
import { Seam } from "@/components/ui/Edge";
import { Render } from "@/components/ui/Render";
import { media } from "@/content/generated/media";
import { SITE } from "@/lib/site";

/**
 * Who is building it. One band, and nothing else.
 *
 * WHAT WAS HERE. A numbered "Three commitments" section — the shuttle is
 * included, furnished means furnished, rents publish when they are set — and
 * a pair of headshots of the principals. Both are gone at the client's
 * direction: the commitments "seem like it is just repeating same info
 * again", which they were (every one of the three is now a line in the
 * Inside list or an answer in the FAQ), and the team photographs were asked
 * for by name.
 *
 * WHAT IS LEFT, AND WHY IT STAYED. The developer paragraph was not part of
 * either request and it is the only place on the home page that answers "who
 * are these people". A build-to-rent lease signed two years before move-in is
 * a bet on the builder, so the one line naming them earns its place even
 * after everything around it has gone.
 *
 * It is a band now rather than a section: no eyebrow, no number, no heading.
 * A credit is not a chapter, and `commitments` has been removed from the
 * section registry, so the numbering closes up behind it — Inside is 04 and
 * the gallery is 05.
 *
 * The third commitment is the one worth noting as deleted rather than moved.
 * It said rents publish in Sept 2026, which did not happen; it would have
 * contradicted the rent answer on the same page had it survived this pass.
 */
export function Assurance() {
  return (
    <section className="relative overflow-clip bg-linen pt-seam-lg pb-normal">
      {/* The single strip for the site's second-biggest jump, Δ 0.75 from
          night to linen. `lg` because at anything shorter it is still a
          visible edge, and `pt-seam-lg` above so the ramp finishes before
          the first line of text rather than printing on top of it.

          No bottom strip: the FAQ paints its own top edge in linen. */}
      <Seam edge="top" color="night" size="lg" />

      <div className="container-stax relative z-2">
        <Reveal>
          <div className="relative overflow-clip rounded-md bg-sand/35">
            {/* A completed Sphere project behind the block at low contrast —
                evidence, not decoration. */}
            <Render
              media={media("exterior-garden")}
              sizes="(max-width: 1439px) 100vw, 1312px"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover opacity-25"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-linen/55" />

            <div className="relative z-2 p-7 md:p-10">
              <p className="max-w-2xl text-lead text-balance text-ink-soft">
                Stax is built by{" "}
                <span className="font-medium text-ink">
                  {SITE.developer.name}
                </span>
                , whose leadership team has decades of combined experience
                across purpose-built rental communities, stacked townhomes and
                high-rise towers.
              </p>

              {/* Out to Sphere, not in to /about.

                  The client wants this pointing at the developer's own site,
                  where the rest of the portfolio lives, because the question
                  it answers is "who are these people and what else have they
                  built" — and /about can only answer the first half.

                  The label was "Meet the team", which was written to sit
                  under two faces. With the faces gone it promised a page of
                  people and delivers a portfolio, so it now says what is on
                  the other end of it.

                  `target="_blank"` with `rel="noopener"`: it leaves the site,
                  and a leasing page should not lose its visitor to a
                  portfolio browse. */}
              <a
                href={SITE.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 inline-flex items-center gap-2 rounded-xs py-3 font-medium text-ink underline-offset-4 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick"
              >
                More from {SITE.developer.name}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
