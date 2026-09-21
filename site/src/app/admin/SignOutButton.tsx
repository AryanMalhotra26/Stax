"use client";

import { useState } from "react";

/**
 * Sign out.
 *
 * A button rather than a link, because the endpoint is a POST — see the route
 * for why a GET logout is a liability. `location.replace` rather than
 * `push`, so the back button does not return to a page the session no longer
 * opens.
 */
export function SignOutButton() {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "same-origin",
          });
        } finally {
          window.location.replace("/admin/login");
        }
      }}
      className="-my-2 rounded-xs py-2 text-[0.9375rem] font-medium text-grey underline decoration-transparent underline-offset-4 transition-colors duration-150 ease-[var(--ease-out-soft)] hover:text-brick-light hover:decoration-brick-light disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
