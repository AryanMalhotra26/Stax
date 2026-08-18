import Link from "next/link";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { StaxMark } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

/**
 * Occupies the social-proof slot (§3.1 §8) — but not with testimonials.
 *
 * Nobody has lived here yet. Resident quotes for an unbuilt building would be
 * fabricated, and a leasing site is exactly the wrong place for that. The
 * honest substitute is commitments a prospect can hold us to, plus the
 * developer's real track record — which is the strongest trust asset that
 * actually exists pre-construction.
 */

const COMMITMENTS = [
  {
    title: "The shuttle is included",
    body: "Round-trip to Brock, in the rent. Not a discounted pass, not a partner service you pay separately — included.",
  },
  {
    title: "Furnished means furnished",
    body: "Bed, desk, seating and dining are in the suite on day one, along with a full-size kitchen. You are not buying a couch in August.",
  },
  {
    title: "Pricing when it's real",
    body: "We publish rents in Spring 2027, when they are set. You will not find a number on this site today that changes before you can sign.",
  },
];

export function Assurance() {
  return (
    <section className="grid-rules bg-paper">
      <div className="container-stax section-y">
        <SectionHead
          index="05"
          eyebrow="What you can hold us to"
          heading="Three commitments, in writing, before you give us anything."
        />

        <div className="mt-10 grid md:grid-cols-3 gap-x-8 gap-y-12">
          {COMMITMENTS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} as="article">
              <StaxMark className="w-6 h-auto text-brick" />
              <h3 className="text-h3 mt-6">{item.title}</h3>
              <p className="mt-3.5 text-ink-soft leading-relaxed">{item.body}</p>
            </Reveal>
          ))}
        </div>

        {/* Developer credibility — the one real proof point available before
            anyone has lived here. */}
        <Reveal delay={0.1}>
          <div className="mt-11 md:mt-14 border-t border-line pt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="text-lead text-ink-soft max-w-2xl text-balance">
              Stax is built by{" "}
              <span className="text-ink font-medium">{SITE.developer.name}</span>
              , whose leadership team has decades of combined experience across
              purpose-built rental communities, stacked townhomes and high-rise
              towers.
            </p>
            <Link
              href="/about"
              className="shrink-0 text-[0.9375rem] font-semibold underline underline-offset-4 hover:text-brick transition-colors"
            >
              Meet the team →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
