import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

/**
 * One class for every link in a footer column, internal or external.
 *
 * It was written out five times and three of those copies drifted, which is
 * how the mail, phone and social links ended up at a 40px hit area while the
 * navigation ones were fixed. The padding is real rather than pulled back
 * out with a negative margin: at `-my-2 py-2` a link's 40px target overhung
 * its own row by 8px at each end against a 12px gap, so neighbouring targets
 * overlapped before they were even large enough.
 */
const FOOTER_LINK =
  "block rounded-xs py-2.5 text-grey/75 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-clip bg-night text-grey">
      <div className="container-stax section-y-sm">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-9 w-auto text-grey md:h-11" />

            {/* The sign-off. The route itself ends one section earlier, at
                the X beside the Register form — this is the page saying
                goodbye rather than the walk arriving. */}
            <p
              className="hand mt-4 text-hand text-brick-light"
              style={{ ["--hand-tilt" as string]: "-2deg" }}
            >
              see you in september.
            </p>

            <p className="mt-6 max-w-xs leading-relaxed text-grey/75">
              Brand-new student residences near Brock University. Opening{" "}
              {SITE.facts.occupancy}.
            </p>
            <p className="mt-5 text-sm text-grey/75">
              A{" "}
              <a
                href={SITE.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2 inline-block py-2 text-grey/75 underline underline-offset-4 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light"
              >
                {SITE.developer.name}
              </a>{" "}
              community.
            </p>
          </div>

          <FooterColumn title="Explore">
            <FooterLink href="/residences">Residences</FooterLink>
            <FooterLink href="/residences#gallery">Gallery</FooterLink>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/register">Register</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contact">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className={FOOTER_LINK}
              >
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.phoneHref}
                className={FOOTER_LINK}
              >
                {SITE.phone}
              </a>
            </li>
            <li className="text-grey/75 pt-2 leading-relaxed">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region}
            </li>
          </FooterColumn>

          <FooterColumn title="Follow">
            <li>
              <a
                href={SITE.social.instagram}
                className={FOOTER_LINK}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SITE.social.tiktok}
                className={FOOTER_LINK}
                rel="noopener noreferrer"
                target="_blank"
              >
                TikTok
              </a>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-16 pt-8 border-t border-sand/12 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-grey/75">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="-mx-2 -my-3 inline-block rounded-xs px-2 py-3 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="-mx-2 -my-3 inline-block rounded-xs px-2 py-3 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light"
            >
              Terms
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-grey/75 max-w-3xl leading-relaxed">
          Renderings are artist&rsquo;s impressions and are subject to change.
          Dimensions, finishes, unit mix and availability are approximate and
          not a representation or warranty. E.&amp;O.E.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Not an <h2>: these are navigation labels, not document headings, and
          an 11px high-contrast serif goes muddy — the hairlines drop out. */}
      {/* 11px on `night`. The brand red measures 3.46 here and needs 4.5, so
          the column headings take Light Grey — the brand's own third colour,
          at 14.86. */}
      <p className="font-sans text-eyebrow font-semibold uppercase text-light-grey">
        {title}
      </p>
      {/* The row gap is small because the links carry their own. Each one
          used `-my-2 py-2`, which buys a 40px hit area *and* collapses it
          back out of the layout — so with a 12px row gap the neighbouring
          targets already overlapped by 4px, and growing the padding to reach
          44px would only have deepened the overlap. Real padding and a small
          gap gives every link a 44px target that is actually its own. */}
      <ul className="mt-5 space-y-1">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className={FOOTER_LINK}
      >
        {children}
      </Link>
    </li>
  );
}
