import type { Metadata } from "next";
import { Nav } from "@/components/chrome/Nav";
import { Trail } from "@/components/motion/Trail";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/chrome/Footer";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { FaqSection } from "@/components/sections/Faq";
import { ResidencesClient } from "./ResidencesClient";
import { media } from "@/content/generated/media";
import { residencesJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Floor plans & residences",
  description:
    "Studio, 1, 2 and 3 bedroom suites at Stax — furnished, internet included, 15 minutes from Brock University by complimentary shuttle. Opening September 2027.",
  alternates: { canonical: "/residences" },
};

/**
 * /residences (§3.2). More important than the home page: people do not lease
 * a building, they lease a floor plan, and this is where price and layout
 * meet, which is where intent is formed.
 *
 * Hero is 40vh, not 100vh — visitors arrive here with intent and should not
 * have to scroll past a poster to reach the content.
 */
export default function ResidencesPage() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="main" className="relative">
        <Trail />
        <section className="relative h-[46vh] min-h-[22rem] flex items-end overflow-hidden bg-espresso">
          <Render
            media={media("exterior-lawn")}
            sizes="100vw"
            priority
            className="absolute inset-0 block"
            imgClassName="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/40"
            aria-hidden="true"
          />
          <div className="container-stax relative pb-12 pt-28">
            <Eyebrow className="text-grey/60">Residences</Eyebrow>
            <h1 className="text-h1 text-bone mt-5 max-w-3xl text-balance">
              Four layouts across {SITE.facts.blocks} blocks.
            </h1>
            <p className="text-lead text-grey/75 mt-5 max-w-xl">
              {SITE.facts.units} suites, {SITE.facts.beds} beds. Every one
              furnished, with internet included.
            </p>
          </div>
        </section>

        <ResidencesClient />

        <FaqSection tone="paper" heading="Before you ask" />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residencesJsonLd()) }}
      />
    </>
  );
}
