/**
 * Mirrors the `faqs` table (§5). Ordered by objection, not by topic: the
 * question most likely to end the visit goes first (§3.1 §9).
 *
 * TODO(client): answers marked [DRAFT] need leasing sign-off before launch.
 * Several are also policy commitments — do not publish them unconfirmed.
 */

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  /** Subset shown on the ad landing pages — the three that kill the click. */
  landing?: boolean;
};

export const FAQS: Faq[] = [
  {
    id: "faq-when",
    question: "When can I actually move in?",
    answer:
      "September 2027. Stax is under development now, and registering puts you on the list that gets floor plans, pricing and lease dates before anyone else — in that order, as each is released.",
    sortOrder: 1,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-price",
    question: "How much is rent?",
    answer:
      "Pricing is released in Spring 2027. We are not publishing a number before it is real, because the one you would read today would be wrong by the time you could sign. Register and you will get the rent card the day it is set.",
    sortOrder: 2,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-shuttle",
    question: "How does the Brock shuttle work?",
    answer:
      "[DRAFT] Complimentary round-trip service between Stax and Brock University, roughly fifteen minutes each way. It runs on a fixed schedule through the academic term and is included in your rent — there is no pass to buy and no fare to tap.",
    sortOrder: 3,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-furnished",
    question: "What comes with the suite?",
    answer:
      "Every suite is fully furnished and internet is included. That covers the bed, desk and seating, plus a full-size kitchen with fridge, range and dishwasher. You bring bedding, kitchenware and yourself.",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "faq-lease",
    question: "Can I lease by the room, or do I need roommates?",
    answer:
      "[DRAFT] Both. Studios and one-bedrooms lease as a whole suite. Two- and three-bedroom suites can be leased as a group or by the room, so you are not responsible for finding people to fill the other bedrooms.",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "faq-parking",
    question: "Is there parking?",
    answer:
      "[DRAFT] Yes — surface parking across the site, kept to the perimeter so the courtyards stay open. Spots are limited and assigned separately from your lease.",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "faq-utilities",
    question: "What about utilities?",
    answer:
      "[DRAFT] Internet is included in rent. Confirmation of which utilities are bundled and which are metered per suite will be published with the pricing release.",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "faq-pets",
    question: "Are pets allowed?",
    answer:
      "[DRAFT] Pet policy is being finalised and will be published with the lease terms. Pet Valu is a six-minute walk, which should tell you which way we are leaning.",
    sortOrder: 8,
    isPublished: true,
  },
  {
    id: "faq-parents",
    question: "I'm a parent — can I be involved in the lease?",
    answer:
      "Yes, and most are. Guarantor arrangements are standard for student leases and the leasing team will walk you through it. Register with your own email if you want the updates sent to you directly.",
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: "faq-obligation",
    question: "Does registering commit me to anything?",
    answer:
      "No. It puts you on the list for floor plans, pricing and lease dates, and gives you first access when suites are released. You can unsubscribe from any email in one click.",
    sortOrder: 10,
    isPublished: true,
  },
];

export const publishedFaqs = FAQS.filter((f) => f.isPublished).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export const landingFaqs = publishedFaqs.filter((f) => f.landing);
