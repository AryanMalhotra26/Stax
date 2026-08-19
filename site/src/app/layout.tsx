import type { Metadata, Viewport } from "next";
import { Caveat, Instrument_Serif, Jost } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Three voices, three jobs (§3.2). One typeface doing every job is the single
 * largest reason the page read as under-designed: nothing could be emphasised
 * because nothing had anything to contrast against.
 *
 * Display — Instrument Serif. Every heading, plan name and stat numeral. High
 * contrast, warm, editorial, and drawn to be set very large; it is the closest
 * free equivalent to the reference's paid Bon Vivant.
 *
 * Body / UI — Jost. [KEEP] Body, lead, eyebrows, nav, buttons, labels, table
 * data. The brand face is Futura Bold, which has no free web licence; Jost is
 * an open-source geometric sans drawn directly after Futura, with the same
 * single-storey `a`, circular `o` and high crossbar.
 *
 * Annotation — Caveat. Margin notes and the student-voice asides. A marker
 * hand rather than a tidy adult one, which is correct for an audience of
 * 18–22-year-olds, and its weight axis reaches 600 without a fake stroke.
 *
 * All three are self-hosted as woff2 by next/font at build time — never a
 * <link> to fonts.googleapis.com, which is one of the reference's mistakes
 * (§10): it costs 32KB of CSS and three extra connections on top of the fonts
 * you already self-hosted.
 *
 * To swap in licensed Futura PT later: replace `jost` with next/font/local
 * pointing at the woff2 files and keep the `--font-jost` variable name. No
 * other file needs to change.
 */
const jost = Jost({
  subsets: ["latin"],
  // No `weight`: Jost is a variable font, so omitting it ships one file
  // covering the whole axis instead of four static instances. The site uses
  // 400/500/600/700 and the variable file is smaller than any two of them.
  variable: "--font-jost",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  // Instrument Serif has one weight and no bold; the italic is not used
  // anywhere on the site, so it is not shipped.
  weight: ["400"],
  variable: "--font-instrument",
  display: "swap",
  preload: true,
});

/**
 * Preloaded, and it has to be: the hero's sub-line — *eight blocks. your own
 * front door.* — is Caveat and it paints above the fold.
 *
 * `preload: false` here was also quietly expensive. next/font only prunes a
 * family down to the declared `subsets` for the faces it preloads, so the
 * unpreloaded build emitted Caveat's Cyrillic and Cyrillic-Extended cuts as
 * well — 118KB of font files for an English-language leasing site. They would
 * never have been *fetched*, since a browser only downloads a face whose
 * unicode-range it actually renders, but they were in the bundle and in the
 * CSS, and the CSS is on the critical path.
 */
const caveat = Caveat({
  subsets: ["latin"],
  // Variable, same reasoning as Jost — and the annotations sit at 600, which
  // a variable axis reaches without a second file or a faked stroke.
  variable: "--font-caveat",
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
  themeColor: "#1E1917",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-CA"
      className={`${jost.variable} ${instrumentSerif.variable} ${caveat.variable}`}
     
    >
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-bone focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
