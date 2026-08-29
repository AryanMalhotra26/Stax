import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { CaptureForm } from "@/components/lead/CaptureForm";
import { SITE } from "@/lib/site";

/**
 * The pre-launch gate, and it is a coming-soon page rather than a locked door.
 *
 * That ordering is deliberate. If a prospective tenant finds the domain before
 * launch this is their first impression of Stax, so it is built in the site's
 * own language — espresso ground, the amber halo, the display serif, the brand
 * red — and the primary action on it is the register form, not the password.
 * A visitor who lands here should still be able to become a lead; the password
 * row is small, secondary, and for us and the contractor.
 *
 * It reuses `CaptureForm`, so a registration captured here scores, stores and
 * notifies exactly like one captured on the real site. A bespoke email box
 * would have been a second code path to keep in sync.
 */

export const metadata: Metadata = {
  title: "Opening September 2027",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PreviewGate({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-clip bg-espresso px-6 py-16">
      {/* The same lamp as the hero. Amber is light — see the palette rule. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[24%] left-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(255 219 152 / 0.28) 0%, rgb(232 163 61 / 0.16) 34%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[40rem]">
        <Logo className="mx-auto h-7 w-auto text-bone" />

        <h1 className="mt-14 text-center text-h1 text-balance">
          <span className="block text-bone">Opening September 2027.</span>
          <span className="block text-sand">Site coming soon.</span>
        </h1>

        <p
          className="hand mt-6 text-center text-hand text-brick-light"
          style={{ ["--hand-tilt" as string]: "-3deg" }}
        >
          we&rsquo;re still building this one too.
        </p>

        {/* Primary action. Same component, same endpoint, same scoring as the
            real register block — a lead found here is a lead. */}
        <div className="mt-14 rounded-lg border border-sand/12 bg-bark/70 p-7 shadow-lift backdrop-blur-md md:p-10">
          <CaptureForm onDark compact ctaLabel="Keep me posted" />
        </div>

        {/* Secondary. Small, quiet, at the bottom — this is for us. */}
        <div className="mt-14 border-t border-sand/12 pt-8">
          <form
            action="/api/preview"
            method="POST"
            className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <label
              htmlFor="preview-password"
              className="font-sans text-eyebrow text-grey/75 uppercase"
            >
              Preview password
            </label>
            <input
              id="preview-password"
              name="password"
              type="password"
              autoComplete="off"
              className={`min-h-11 w-48 rounded-full border bg-transparent px-5 text-center font-sans text-bone transition-colors outline-none ${
                e ? "border-brick-light" : "border-sand/25 focus:border-brick-light"
              }`}
            />
            <button
              type="submit"
              className="min-h-11 rounded-full border border-sand/25 px-6 font-sans text-eyebrow text-grey/85 uppercase transition-colors hover:border-brick-light hover:text-brick-light"
            >
              Enter
            </button>
          </form>
          <p
            className="mt-3 h-4 text-center font-sans text-xs text-brick-light"
            role="status"
            aria-live="polite"
          >
            {e ? "Not quite — try again." : ""}
          </p>
        </div>

        <p className="mt-14 text-center font-sans text-eyebrow text-grey/75 uppercase">
          A {SITE.developer.name} community
        </p>
      </div>
    </main>
  );
}
