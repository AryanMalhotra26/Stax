import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { buttonClass } from "@/components/ui";
import { Render } from "@/components/ui/Render";
import { FEATURES } from "@/config/features";
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
          {/* The 404 has to offer somewhere real to go, and while the plans
              are hidden "the floor plans are still where you left them" is
              the one sentence on the site that would be false. */}
          <p className="text-lead text-ink-soft mt-6 max-w-md">
            {FEATURES.floorPlans
              ? "It may have moved, or it may never have existed. The floor plans are still where you left them."
              : "It may have moved, or it may never have existed. Everything about September 2027 is still one page away."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            {FEATURES.floorPlans ? (
              <Link href="/residences" className={buttonClass("primary", "lg")}>
                See floor plans
              </Link>
            ) : (
              <Link href="/register" className={buttonClass("primary", "lg")}>
                Register your interest
              </Link>
            )}
            <Link href="/" className={buttonClass("secondary", "lg")}>
              Back home
            </Link>
          </div>
        </div>

        <p className="text-sm text-ink-faint">Stax — St. Catharines, Ontario</p>
      </div>

      <div className="relative hidden lg:block bg-espresso">
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
