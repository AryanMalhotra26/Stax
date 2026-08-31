"use client";

import { redirect } from "next/navigation";
import { Nav } from "@/components/chrome/Nav";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/chrome/Footer";
import { Render } from "@/components/ui/Render";
import { Eyebrow } from "@/components/ui";
import { FaqSection } from "@/components/sections/Faq";
import { ResidencesClient } from "./ResidencesClient";
import { FEATURES } from "@/config/features";
import { media } from "@/content/generated/media";
import { residencesJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

/**
 * /residences (§3.2). More important than the home page: people do not lease
 * a building, they lease a floor plan, and this is where price and layout
 * meet, which is where intent is formed.
 *
 * Hero is 40vh, not 100vh — visitors arrive here with intent and should not
 * have to scroll past a poster to reach the content.
 *
 * HIDDEN, NOT DELETED (Pass 6 §6.3). The page below is untouched and still
 * type-checks; `FEATURES.floorPlans` decides whether anyone reaches it.
 *
 * The gate is here rather than in the build config because the build has two
 * shapes: the Workers deploy renders this on the server and answers with a
 * real redirect, and the static export renders it in the browser and replaces
 * the URL there. `redirect()` covers both — it is one of the few Next APIs
 * that works during render in a Client Component as well as a Server one,
 * which is also why `metadata` had to move to layout.tsx.
 *
 * Every internal link into this route is gated on the same flag, so nothing
 * on the site should reach this line. It is here for the ones that do:
 * bookmarks, an old sitemap, and anything the client has already sent out.
 */
export default function ResidencesPage() {
  if (!FEATURES.floorPlans) redirect("/");

  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="main" className="relative">
        <section className="relative h-[46vh] min-h-[22rem] flex items-end overflow-clip bg-espresso">
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
            <Eyebrow className="text-grey/75">Residences</Eyebrow>
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

        <FaqSection
          tone="paper"
          heading="Before you ask,"
          quiet="the questions the plans raise most."
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(residencesJsonLd()) }}
      />
    </>
  );
}
