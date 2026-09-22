/**
 * Mirrors the `faqs` table (§5). Ordered by objection, not by topic: the
 * question most likely to end the visit goes first (§3.1 §9).
 *
 * EIGHT, not ten (Pass 6 §5). Two removals at the client's direction, and
 * one of them takes information with it that the site cannot afford to lose:
 *
 * "Can I lease by the room, or do I need roommates?" is gone outright.
 *
 * "What about utilities?" is gone as a question, but its answer is folded
 * into "What comes with the suite?" rather than deleted. Deleting it would
 * have meant advertising *Internet included* in the walkthrough, on a
 * commitment card and in the schema markup while refusing to say what else is
 * in the rent — which does not stop anyone asking, it just moves the question
 * into the leasing inbox one email at a time.
 *
 * `sortOrder` is contiguous 1–8 rather than preserving the old numbers: the
 * accordion derives its `01`–`08` numerals from position, so a gap here would
 * render as a gap on the page.
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
      "September 2027. Stax is under development now, and registering puts you on the list that gets floor plans and lease dates before anyone else — in that order, as each is released.",
    sortOrder: 1,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-price",
    question: "How much is rent?",
    answer:
      "Pricing is released in Sept 2026. We are not publishing a number before it is real, because the one you would read today would be wrong by the time you could sign. Register and you will get the rent card the day it is set.",
    sortOrder: 2,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-shuttle",
    question: "How does the Brock shuttle work?",
    answer:
      "[DRAFT] A private shuttle between Stax and Brock University, for residents only. It runs both directions through the academic term with a vehicle roughly every fifteen minutes, and it is included in your rent — no fare, no pass to buy. A transit pass is available as well if you would rather take public transport, or need to get somewhere the shuttle does not go.",
    sortOrder: 3,
    isPublished: true,
    landing: true,
  },
  {
    id: "faq-furnished",
    /**
     * Carries the utilities answer as well, now that the utilities question
     * has been removed. "What is included and what do I pay for" is one of
     * the two questions every student renter asks, and the honest version of
     * it — internet in, the rest published with pricing — is shorter than the
     * email it prevents.
     */
    question: "What comes with the suite?",
    answer:
      "[DRAFT] Every suite is fully furnished and internet is included in the rent. That covers the bed, desk and seating, plus a full-size kitchen with fridge, range and dishwasher. You bring bedding, kitchenware and yourself. Which of the remaining utilities are bundled and which are metered per suite is confirmed with the pricing release in Sept 2026.",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "faq-parking",
    question: "Is there parking?",
    answer:
      "[DRAFT] Yes — surface parking for residents and visitors, kept to the perimeter so the courtyards stay open. Spots are assigned separately from your lease.",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "faq-pets",
    /**
     * TODO(client): CONFIRM THE CONDITIONS BEFORE THIS PUBLISHES. "Allowed"
     * with no stated limit is a commitment on a leasing site, and it is far
     * easier to state a size or breed condition now than to introduce one
     * after somebody has registered on the strength of this answer. The
     * wording below promises a policy exists and defers the specifics to
     * lease signing, which is the narrowest honest version — but it is still
     * a promise that pets are welcome.
     */
    question: "Are pets allowed?",
    answer:
      "[DRAFT] Yes. Stax is pet-friendly — dogs and cats are welcome, with the usual size and breed conditions confirmed at lease signing. The courtyards and the perimeter paths are built for walking them.",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "faq-parents",
    question: "I'm a parent — can I be involved in the lease?",
    answer:
      "Yes, and most are. Guarantor arrangements are standard for student leases and the leasing team will walk you through it. Register with your own email if you want the updates sent to you directly.",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "faq-obligation",
    question: "Does registering commit me to anything?",
    answer:
      "No. It puts you on the list for floor plans and lease dates, and gives you first access when suites are released. You can unsubscribe from any email in one click.",
    sortOrder: 8,
    isPublished: true,
  },
];

export const publishedFaqs = FAQS.filter((f) => f.isPublished).sort(
  (a, b) => a.sortOrder - b.sortOrder,
);

export const landingFaqs = publishedFaqs.filter((f) => f.landing);
