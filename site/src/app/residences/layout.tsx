import type { Metadata } from "next";
import { FEATURES } from "@/config/features";

/**
 * The route's metadata lives here rather than on the page, because the page
 * has to be a Client Component to call `redirect()` during render and a
 * Client Component cannot export `metadata`.
 *
 * The `noindex` is the half of hiding the route that is easy to forget. A
 * redirect stops people arriving through the site; it does not stop a crawler
 * that already has the URL, and it certainly does not remove the page from an
 * index it is already in. Both halves go back together when the flag flips.
 */
export const metadata: Metadata = FEATURES.floorPlans
  ? {
      title: "Floor plans & residences",
      description:
        "Studio, 1, 2 and 3 bedroom suites at Stax — furnished, internet included, 15 minutes from Brock University by private shuttle. Opening September 2027.",
      alternates: { canonical: "/residences" },
    }
  : { robots: { index: false, follow: false } };

export default function ResidencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
