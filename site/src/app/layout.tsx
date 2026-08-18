import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Brand face is Futura Bold. Futura has no free web licence, so this uses
 * Jost — an open-source geometric sans drawn directly after Futura, with the
 * same single-storey `a`, circular `o` and high crossbar.
 *
 * To swap in licensed Futura PT later: replace this with next/font/local
 * pointing at the woff2 files and keep the `--font-jost` variable name. No
 * other file needs to change.
 */
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Brock University student housing",
    "St. Catharines student rentals",
    "student apartments Brock",
    "Stax Living",
    "furnished student housing Niagara",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#3E3D3D",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={jost.variable} data-scroll-behavior="smooth">
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
