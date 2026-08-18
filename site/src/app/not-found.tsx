import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui";
import { Render } from "@/components/ui/Render";
import { media } from "@/content/generated/media";

export default function NotFound() {
  return (
    <main id="main" className="min-h-dvh grid lg:grid-cols-2">
      <div className="flex flex-col justify-between px-5 md:px-12 lg:px-16 py-10 md:py-14">
        <Link href="/" aria-label="Stax — home">
          <Logo className="h-7 w-auto text-ink" />
        </Link>

        <div className="py-20">
          <p className="text-eyebrow uppercase text-brick">404</p>
          <h1 className="text-h1 mt-6 text-balance max-w-md">
            That page isn&rsquo;t here.
          </h1>
          <p className="text-lead text-ink-soft mt-6 max-w-md">
            It may have moved, or it may never have existed. The floor plans
            are still where you left them.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/residences" className={buttonClass("primary", "lg")}>
              See floor plans
            </Link>
            <Link href="/" className={buttonClass("secondary", "lg")}>
              Back home
            </Link>
          </div>
        </div>

        <p className="text-sm text-ink-faint">Stax — St. Catharines, Ontario</p>
      </div>

      <div className="relative hidden lg:block bg-charcoal">
        <Render
          media={media("exterior-garden")}
          sizes="50vw"
          className="absolute inset-0 block"
          imgClassName="w-full h-full object-cover"
        />
      </div>
    </main>
  );
}
