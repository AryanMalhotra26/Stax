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
    numberOfBedrooms: SITE.facts.beds,
    petsAllowed: undefined, // TODO(client): set once the pet policy is signed off
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
    email: SITE.email,
    telephone: SITE.phone,
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
    sameAs: [SITE.social.instagram, SITE.social.tiktok, SITE.developer.url],
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
