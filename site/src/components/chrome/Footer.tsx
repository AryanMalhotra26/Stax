import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-night text-grey">
      <div className="container-stax section-y-sm">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-9 w-auto text-grey md:h-11" />

            {/* The trail's terminus. It has run down the left edge of every
                section since the hero; this is where the walk ends. */}
            <p
              className="hand mt-4 text-hand text-amber"
              style={{ ["--hand-tilt" as string]: "-2deg" }}
            >
              see you in september.
            </p>

            <p className="mt-6 max-w-xs leading-relaxed text-grey/60">
              Brand-new student residences near Brock University. Opening{" "}
              {SITE.facts.occupancy}.
            </p>
            <p className="mt-5 text-sm text-grey/45">
              A{" "}
              <a
                href={SITE.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey/70 underline underline-offset-4 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
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
                className="text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
              >
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={SITE.phoneHref}
                className="text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="text-grey/60 pt-2 leading-relaxed">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.region}
            </li>
          </FooterColumn>

          <FooterColumn title="Follow">
            <li>
              <a
                href={SITE.social.instagram}
                className="text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SITE.social.tiktok}
                className="text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber"
                rel="noopener noreferrer"
                target="_blank"
              >
                TikTok
              </a>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-16 pt-8 border-t border-sand/12 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-grey/45">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber">
              Terms
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-grey/35 max-w-3xl leading-relaxed">
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
      <h2 className="text-eyebrow uppercase text-amber">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-grey/70 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-amber">
        {children}
      </Link>
    </li>
  );
}
