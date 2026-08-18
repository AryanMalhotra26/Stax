import dynamic from "next/dynamic";
import { Nav } from "@/components/chrome/Nav";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Trail } from "@/components/motion/Trail";
import { Bridge } from "@/components/motion/Bridge";
import { Footer } from "@/components/chrome/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Positioning } from "@/components/sections/Positioning";
import { PlanPreview } from "@/components/sections/PlanPreview";
import { Neighbourhood } from "@/components/sections/Neighbourhood";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { Assurance } from "@/components/sections/Assurance";
import { FaqSection } from "@/components/sections/Faq";
import { CaptureBlock } from "@/components/sections/CaptureBlock";
import { buildingJsonLd } from "@/lib/jsonld";

/**
 * GSAP loads after first paint and only on the route that uses it — never in
 * the root layout (§6.2 rule 2). ScrollTrigger plus the pan is the single
 * largest client chunk on the site, and it sits eight screens down.
 */
const AmenityPan = dynamic(() =>
  import("@/components/motion/AmenityPan").then((m) => m.AmenityPan),
);

/**
 * Hero depth. Dynamic for the same reason as the pan: a statically imported
 * GSAP gets hoisted by Turbopack into a chunk shared by every route, and the
 * ad landing pages must never pay for it.
 */
const ParallaxHero = dynamic(() =>
  import("@/components/motion/ParallaxHero").then((m) => m.ParallaxHero),
);

/**
 * Home (§3.1).
 *
 * Layout-family rhythm, section by section: hero → stat row → split →
 * card grid → pinned pan → map composite → asymmetric grid → three-up →
 * accordion → dark split. No shape repeats adjacently, and there are never
 * more than two consecutive image+text splits.
 */
export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <Nav variant="overlay" />
      <main id="main" className="relative">
        <Trail />
        <ParallaxHero />
        <Hero />
        <ProofStrip />
        <Positioning />
        <PlanPreview />
        <Bridge slug="exterior-garden" from="paper" to="charcoal" />
        <AmenityPan />
        <Neighbourhood />
        <Bridge slug="exterior-evening" from="charcoal" to="bone" />
        <GalleryTeaser />
        <Assurance />
        <FaqSection tone="paper" />
        <CaptureBlock />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        // Static, authored object — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildingJsonLd()) }}
      />
    </>
  );
}
