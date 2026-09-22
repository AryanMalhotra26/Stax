import dynamic from "next/dynamic";
import { Nav } from "@/components/chrome/Nav";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Curtain } from "@/components/motion/Curtain";
import { Bridge } from "@/components/motion/Bridge";
import { Footer } from "@/components/chrome/Footer";
import { Hero } from "@/components/sections/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { PlanPreview } from "@/components/sections/PlanPreview";
import { Neighbourhood } from "@/components/sections/Neighbourhood";
import { Shuttle } from "@/components/sections/Shuttle";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { Assurance } from "@/components/sections/Assurance";
import { FaqSection } from "@/components/sections/Faq";
import { CaptureBlock } from "@/components/sections/CaptureBlock";
import { RegisterPrompt } from "@/components/lead/RegisterPrompt";
import { FEATURES } from "@/config/features";
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
      <Curtain />
      <Nav />
      <main id="main" className="relative">
        <ParallaxHero />
        <Hero />

        {/*
          THE ORDER IS THE ARGUMENT (Pass 7).

          It used to run hero → property story → floor plans → walkthrough →
          neighbourhood, which is a development telling you about itself and
          getting to what you actually receive on the fourth screen. The
          client's direction was to lead with the experience, so the sequence
          is now: what you get, where you are, how you reach campus, and only
          then why this rather than the alternative.

          The tonal rhythm had to move with it. Hero, walkthrough and
          neighbourhood are all dark, so a fourth dark section would have made
          the top half of the page one slab — the shuttle section is light,
          and it lands where the eye needs the break anyway.
        */}
        <AmenityPan />
        <Neighbourhood />
        <Shuttle />
        <Positioning />
        {FEATURES.floorPlans && <PlanPreview />}

        {/* bone → night is the biggest jump left on the page, so it keeps the
            image band rather than a gradient. `from` follows whatever is
            actually above it: the Idea when the plans are hidden, Floor Plans
            when they are not. */}
        <Bridge
          slug="exterior-evening"
          from={FEATURES.floorPlans ? "paper" : "bone"}
          to="night"
          trail="b"
        />
        <GalleryTeaser />
        <Assurance />
        {/* Bone, not paper. Commitments → FAQ → Register was linen → paper →
            night: two of those three are 8 points of luminance apart, so the
            middle 2,400px of the page read as one undifferentiated light
            slab. linen → bone is a step you can actually see, and it makes
            the drop into Register's night land harder for free. */}
        <FaqSection />
        <CaptureBlock />
      </main>
      <Footer />

      {/* Asked for directly: a chance to register without scrolling. It waits
          six seconds, remembers a dismissal, and is a real dialog — see the
          component for why each of those decides whether it converts. */}
      <RegisterPrompt />

      <script
        type="application/ld+json"
        // Static, authored object — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildingJsonLd()) }}
      />
    </>
  );
}
