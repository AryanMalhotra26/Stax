import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Sign in",
  // Belt and braces. The session check already stops a crawler reaching
  // anything behind this, and robots.ts disallows /admin — but a page that
  // should never be indexed should say so itself, so a future change to
  // either of those does not quietly make it indexable.
  robots: { index: false, follow: false },
};

/**
 * /admin/login — the only page under /admin reachable without a session.
 *
 * Deliberately not styled like the marketing site. This is a back-office
 * door, and the design language of the public pages — the torn edges, the
 * hand annotations, the golden-hour render — would be actively confusing
 * here: it is for prospective tenants, and a member of the leasing team
 * arriving at something that looks like the home page has been given the
 * wrong signal about where they are.
 *
 * No form, no fields, nothing to type. One link out to Google and back.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  const href = next
    ? `/api/admin/auth/google?next=${encodeURIComponent(next)}`
    : "/api/admin/auth/google";

  return (
    <main className="grid min-h-dvh place-items-center bg-espresso px-5 py-16">
      <div className="w-full max-w-sm">
        <Logo className="h-7 w-auto text-bone" />

        <h1 className="mt-10 font-sans text-[1.5rem] font-medium tracking-[-0.015em] text-bone">
          Leasing admin
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-grey/75">
          Sign in with the Google account your address is registered under.
        </p>

        {error && <SignInError code={error} />}

        <a
          href={href}
          className="mt-8 flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-bone px-6 text-[0.9375rem] font-medium text-ink transition-colors duration-150 ease-[var(--ease-out-soft)] hover:bg-sand"
        >
          <GoogleMark />
          Continue with Google
        </a>

        <p className="mt-8 text-sm leading-relaxed text-grey/60">
          Access is limited to addresses on the leasing team. If yours is not
          recognised, ask whoever set this up to add it.
        </p>
      </div>
    </main>
  );
}

/**
 * Say what happened, without saying enough to be useful to a stranger.
 *
 * `forbidden` is the one that earns a real sentence: it is the only failure a
 * legitimate person hits, and "something went wrong" would send them round
 * the Google loop again to no effect. The rest stay vague — a visitor who did
 * not start this flow is not owed a diagnosis of why it failed.
 */
function SignInError({ code }: { code: string }) {
  const message =
    code === "forbidden"
      ? "That Google account is not on the leasing team's list. Try a different account, or ask to be added."
      : code === "expired"
        ? "That sign-in attempt timed out. Please try again."
        : code === "unconfigured"
          ? "Sign-in is not fully configured yet. Contact whoever set this up."
          : code === "denied"
            ? "Sign-in was cancelled."
            : "Sign-in could not be completed. Please try again.";

  return (
    <p
      role="alert"
      className="mt-6 rounded-sm border border-brick-light/40 bg-brick/15 px-4 py-3 text-[0.9375rem] leading-relaxed text-bone"
    >
      {message}
    </p>
  );
}

/** Google's mark, inline. One request fewer, and it cannot fail to load. */
function GoogleMark() {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem] shrink-0"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
