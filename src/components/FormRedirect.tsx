"use client";

import { useState } from "react";

import { ExternalIcon } from "@/components/icons";
import { buttonPrimary, textLink } from "@/components/ui";

/**
 * Opens a Google Form in a new tab. The site never sees the submission, so it
 * only explains where the response is completed — it never claims it was saved.
 */
export function FormRedirect({ href, label, children }: { href: string; label: string; children?: React.ReactNode }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="text-center">
      {children}
      <a href={href} target="_blank" rel="noopener noreferrer" className={`mt-6 ${buttonPrimary}`} onClick={() => setOpened(true)}>
        {label}
        <ExternalIcon className="h-4 w-4" />
        <span className="sr-only">(opens Google Forms in a new tab)</span>
      </a>
      <p className="mt-4 text-sm text-ink-soft">
        Opens in Google Forms. Your response is completed and saved there, not on this page.
      </p>

      <div role="status" aria-live="polite">
        {opened && (
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-gold-300/70 bg-blush-50/80 p-6 text-left">
            <p className="font-serif text-xl text-ink">Finished on Google Forms?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Your response is recorded only after you press <strong>Submit</strong> and Google shows
              &ldquo;Your response has been recorded.&rdquo; If you didn&rsquo;t see that message, you can{" "}
              <a href={href} target="_blank" rel="noopener noreferrer" className={textLink}>
                open the form again
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
            <a href="#top" className={`mt-4 inline-block text-sm ${textLink}`}>
              Back to the invitation
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
