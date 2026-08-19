import type { Metadata } from "next";
import { Nav } from "@/components/chrome/Nav";
import { Trail } from "@/components/motion/Trail";
import { Footer } from "@/components/chrome/Footer";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { CaptureBlock } from "@/components/sections/CaptureBlock";
import { StaxMark } from "@/components/brand/Logo";
import { media, headshotBySlug } from "@/content/generated/media";
import {
  ABOUT_EXPERIENCE,
  ABOUT_PRINCIPLES,
  ABOUT_STATS,
  ABOUT_STORY,
  ABOUT_TEAM,
  ABOUT_TIMELINE,
  DEVELOPER,
  type TeamMember,
} from "@/content/about";
import { asset } from "@/lib/asset";
import { organisationJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Stax is a Sphere Developments community — a purpose-built rental neighbourhood in St. Catharines, opening September 2027 near Brock University.",
  alternates: { canonical: "/about" },
};

/**
 * /about (§3.3): story → developer credibility → neighbourhood context →
 * who you'll actually deal with → timeline → CTA.
 *
 * Copy and team come from spheredevelopments.ca — see content/about.ts.
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative">
        <Trail />
        {/* Story */}
        <section className="bg-bone">
          <div className="container-stax pt-28 md:pt-36 pb-10 md:pb-14">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20">
              <div>
                <Eyebrow className="text-brick">{ABOUT_STORY.eyebrow}</Eyebrow>
                <h1 className="text-h1 mt-6 text-balance">
                  {ABOUT_STORY.heading}
                </h1>
              </div>
              <div className="space-y-6 text-lead text-ink-soft lg:pt-3 max-w-2xl">
                {ABOUT_STORY.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p className="text-base pt-2">
                  <a
                    href={DEVELOPER.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink font-medium underline underline-offset-4 hover:text-brick"
                  >
                    spheredevelopments.ca
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="container-stax pb-14 md:pb-20">
            <Reveal>
              <div className="relative aspect-21/9 overflow-clip rounded-md bg-grey">
                <Render
                  media={media("site-plan")}
                  sizes="100vw"
                  className="block w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-sm text-ink-faint">
                Site plan — {SITE.facts.blocks} blocks around landscaped
                courtyards, with parking kept to the perimeter.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Experience / credibility */}
        <section className="bg-espresso text-grey">
          <div className="container-stax section-y">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <Reveal>
                <Eyebrow className="text-brick">{ABOUT_EXPERIENCE.eyebrow}</Eyebrow>
                <h2 className="text-h2 mt-6 text-balance">
                  {ABOUT_EXPERIENCE.heading}
                </h2>
                <p className="mt-7 text-lead text-grey/75 max-w-lg">
                  {ABOUT_EXPERIENCE.body}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="lg:pt-4">
                <h3 className="text-eyebrow uppercase text-grey/75">
                  Built across
                </h3>
                <ul className="mt-6 border-t border-sand/10">
                  {ABOUT_EXPERIENCE.assetClasses.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 py-3.5 border-b border-sand/10"
                    >
                      <span className="text-eyebrow text-grey/30 tnum">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={i < 2 ? "text-bone font-medium" : "text-grey/75"}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-grey/75 leading-relaxed">
                  {ABOUT_EXPERIENCE.closing}
                </p>
              </Reveal>
            </div>

            {/* Rendered only once real figures exist — see ABOUT_STATS. */}
            {ABOUT_STATS.length > 0 && (
              <Reveal delay={0.15}>
                <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-sand/10 pt-12">
                  {ABOUT_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dd className="text-h2 text-bone tnum">{stat.value}</dd>
                      <dt className="text-eyebrow uppercase mt-3 text-grey/75">
                        {stat.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </section>

        {/* Principles */}
        <section className="bg-paper">
          <div className="container-stax section-y">
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-brick">Our principles</Eyebrow>
              <h2 className="text-h2 mt-6 text-balance">
                Reputation is built on trust, discipline and integrity — and it
                rests on each home we deliver.
              </h2>
            </Reveal>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {ABOUT_PRINCIPLES.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06} as="article">
                  <StaxMark className="w-6 h-auto text-brick" />
                  <h3 className="text-h3 mt-6">{item.title}</h3>
                  <p className="mt-3.5 text-ink-soft leading-relaxed">
                    {item.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-bone">
          <div className="container-stax section-y">
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-brick">Who you&rsquo;ll deal with</Eyebrow>
              <h2 className="text-h2 mt-6 text-balance">
                You&rsquo;re not choosing a building. You&rsquo;re choosing a
                landlord.
              </h2>
              <p className="mt-6 text-lead text-ink-soft">
                The team behind Stax, and behind every Sphere community.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {ABOUT_TEAM.map((member, i) => (
                <Reveal key={member.name} delay={(i % 3) * 0.07} as="article">
                  <TeamCard member={member} />
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-10 text-sm text-ink-faint">
                Head office: {DEVELOPER.headOffice}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-paper">
          <div className="container-stax section-y">
            <Reveal className="max-w-2xl">
              <Eyebrow className="text-brick">Where things stand</Eyebrow>
              <h2 className="text-h2 mt-6 text-balance">
                From here to September 2027.
              </h2>
            </Reveal>

            <ol className="mt-10 border-t border-line">
              {ABOUT_TIMELINE.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.05} as="li">
                  <div
                    className={`grid md:grid-cols-[9rem_1.5rem_1fr] gap-x-6 gap-y-2 py-7 border-b border-line ${
                      item.state === "upcoming" ? "opacity-55" : ""
                    }`}
                  >
                    <p className="text-eyebrow uppercase text-ink-faint md:pt-1.5 tnum">
                      {item.date}
                    </p>
                    <div className="hidden md:flex justify-center pt-1">
                      {item.state === "current" ? (
                        <StaxMark className="w-4 h-auto text-brick" />
                      ) : (
                        <span
                          className={`w-2 h-2 mt-1.5 ${
                            item.state === "done" ? "bg-ink" : "bg-line-dark/40"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-h3">
                        {item.title}
                        {item.state === "current" && (
                          <span className="ml-3 text-eyebrow uppercase text-brick align-middle">
                            Now
                          </span>
                        )}
                      </h3>
                      <p className="mt-2 text-ink-soft max-w-xl">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <CaptureBlock
          heading="We'll tell you"
          quiet="when things move."
          body="Registration is the only way to get plans, pricing and lease dates before they're public. It takes fifteen seconds."
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd()) }}
      />
    </>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const shot = member.photo ? headshotBySlug[member.photo] : undefined;

  return (
    <div>
      {/* Real photos or none (§3.3). Where a headshot hasn't been supplied the
          card shows the brand mark rather than a stock person — on a landlord
          page, a stranger's stock portrait is worse than an obvious gap. */}
      <div className="aspect-4/5 bg-grey flex items-center justify-center overflow-clip rounded-md">
        {shot ? (
          <picture className="block w-full h-full">
            <source
              type="image/avif"
              srcSet={`${asset(shot.variants.avif["400"])} 400w, ${asset(shot.variants.avif["800"])} 800w`}
              sizes="(max-width: 1023px) 50vw, 30vw"
            />
            <source
              type="image/webp"
              srcSet={`${asset(shot.variants.webp["400"])} 400w, ${asset(shot.variants.webp["800"])} 800w`}
              sizes="(max-width: 1023px) 50vw, 30vw"
            />
            <img
              src={asset(shot.variants.webp["800"])}
              alt={`${member.name}, ${member.role}, Sphere Developments`}
              width={800}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{
                backgroundImage: `url(${shot.placeholder})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </picture>
        ) : (
          <StaxMark className="w-12 h-auto text-ink/12" />
        )}
      </div>
      <h3 className="text-h3 mt-5">{member.name}</h3>
      <p className="text-eyebrow uppercase mt-2 text-brick">{member.role}</p>
      {member.bio && (
        <p className="mt-3.5 text-ink-soft leading-relaxed">{member.bio}</p>
      )}
    </div>
  );
}
