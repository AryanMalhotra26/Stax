import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
};

/** PLACEHOLDER — requires legal review before launch. */
export default function TermsPage() {
  return (
    <article>
      <h1 className="text-h1">Terms</h1>
      <p className="text-lead mt-6">
        [PLACEHOLDER — requires legal review before launch.]
      </p>

      <h2>About this site</h2>
      <p>
        This website provides information about Stax, a residential development
        in {SITE.address.city}, {SITE.address.region}, expected to be ready for
        occupancy in {SITE.facts.occupancy}.
      </p>

      <h2>Renderings and specifications</h2>
      <p>
        All images are artist&rsquo;s impressions. Dimensions, finishes, unit
        mix, suite counts and site layout are approximate, subject to change
        without notice, and do not form part of any agreement. Illustrated
        floor plates are schematic and are not dimensioned architectural
        drawings.
      </p>

      <h2>Pricing and availability</h2>
      <p>
        Rents have not been set and are not published on this site. Nothing
        here constitutes an offer to lease, and registering your interest does
        not reserve a suite or create any tenancy right.
      </p>

      <h2>Registration</h2>
      <p>
        Registering places you on a mailing list. It carries no obligation on
        either side and can be withdrawn at any time.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.legalName} — {SITE.email}
      </p>

      <p className="text-sm mt-10">E.&amp;O.E.</p>
    </article>
  );
}
