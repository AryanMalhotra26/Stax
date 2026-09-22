import { SITE } from "./site";
import { FLOOR_PLANS, sqftRange } from "@/content/floorPlans";
import { publishedFaqs } from "@/content/faqs";

/**
 * Structured data (§10 phase 7).
 *
 * `ApartmentComplex` rather than `LocalBusiness` alone — it is the type that
 * carries unit counts and floor plans, which is what a rental listing needs
 * to be eligible for the richer treatment in search.
 *
 * Note: no `offers` / price is emitted. Rents are not set, and publishing a
 * fabricated price in structured data is both a search-quality violation and
 * a consumer-protection problem. Add `offers` when pricing is released.
 */

export function buildingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    numberOfAccommodationUnits: SITE.facts.units,
    // No `numberOfBedrooms`. The bed total is off the site at the client's
    // direction, and structured data is a published claim like any other —
    // leaving it here would put in the markup exactly the number the page
    // has stopped making.
    // The FAQ now says pets are welcome, so the schema has to agree — a
    // structured-data field that contradicts the visible answer on the same
    // page is a rich-result violation. It moves back to `undefined` if the
    // client walks the policy back; see the note on `faq-pets`.
    petsAllowed: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Shuttle to Brock University", value: true },
      { "@type": "LocationFeatureSpecification", name: "Furnished", value: true },
      { "@type": "LocationFeatureSpecification", name: "Internet included", value: true },
      { "@type": "LocationFeatureSpecification", name: "On-site parking", value: true },
    ],
    containsPlace: FLOOR_PLANS.map((plan) => ({
      "@type": "Apartment",
      name: plan.name,
      numberOfRooms: plan.bedrooms,
      numberOfBathroomsTotal: plan.bathrooms,
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: plan.bedsPerUnit,
      },
      floorSize: {
        "@type": "QuantitativeValue",
        minValue: plan.sqftMin,
        maxValue: plan.sqftMax,
        unitCode: "FTK",
      },
    })),
  };
}

export function organisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    // No `telephone`. There is no phone number on the site any more, and a
    // schema field is a published claim like any other — Google surfaces it
    // in the knowledge panel, where a dead number is worse than none.
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    // Ties the project to the developer's established entity, which is the
    // credibility signal search actually understands pre-construction.
    parentOrganization: {
      "@type": "Organization",
      name: SITE.developer.name,
      url: SITE.developer.url,
      email: SITE.developer.email,
    },
    // TikTok is out until the handle is confirmed — see SITE.social. `sameAs`
    // is how search ties these profiles to the entity, so a URL that 404s
    // here is an unverifiable claim rather than a missing one.
    sameAs: [SITE.social.instagram, SITE.developer.url],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/^\[DRAFT\]\s*/, ""),
      },
    })),
  };
}

export function residencesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Stax floor plans",
    itemListElement: FLOOR_PLANS.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Apartment",
        name: plan.name,
        description: `${plan.name}, ${sqftRange(plan)} sq ft, ${plan.bathrooms} bath.`,
        numberOfRooms: plan.bedrooms,
        url: `${SITE.url}/residences#${plan.slug}`,
      },
    })),
  };
}
