import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};

/**
 * PLACEHOLDER — needs legal review before launch.
 *
 * This is not boilerplate that can be skipped: the site runs Meta ads with
 * server-side Conversions API, which means hashed email is sent to a third
 * party. Under PIPEDA that has to be disclosed, and Meta's own terms require
 * a compliant privacy policy on any domain running their pixel.
 */
export default function PrivacyPage() {
  return (
    <article>
      <h1 className="text-h1">Privacy</h1>
      <p className="text-lead mt-6">
        [PLACEHOLDER — requires legal review before launch.]
      </p>

      <h2>What we collect</h2>
      <p>
        When you register your interest we collect your email address and the
        move-in term you select. If you choose to answer the follow-up
        questions we also collect your name, phone number, bedroom preference
        and budget range. We record how you arrived at this site, including
        advertising parameters, so we understand which campaigns work.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To send you floor plans, pricing and leasing updates for Stax.</li>
        <li>To contact you about availability when suites are released.</li>
        <li>
          To measure advertising performance, including sharing a hashed
          version of your email address with Meta so conversions can be
          attributed. Hashing means the address is not readable by them.
        </li>
      </ul>

      <h2>What we don&rsquo;t do</h2>
      <p>
        We do not sell your information. We do not share it with other
        landlords or listing services.
      </p>

      <h2>Your choices</h2>
      <p>
        Every email includes an unsubscribe link. You can ask us to delete your
        record at any time by emailing{" "}
        <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-4">
          {SITE.email}
        </a>
        , and we will confirm once it is done.
      </p>

      <h2>Analytics</h2>
      <p>
        We use privacy-preserving, cookieless analytics that do not track you
        across sites and do not build a profile of you.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.legalName}, {SITE.address.street}, {SITE.address.city},{" "}
        {SITE.address.region} — {SITE.email}
      </p>
    </article>
  );
}
