"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { FormRedirect } from "@/components/FormRedirect";
import { SpinnerIcon } from "@/components/icons";
import { buttonPrimary, field, textLink } from "@/components/ui";
import { formatSavedAt, submitResponse, useDeadlinePassed } from "@/lib/client";
import { LIMITS, type SavedGodparentAnswer } from "@/lib/invite";

export type GodparentResponseProps = {
  mode: "live" | "form" | "none";
  invite: { code: string; godparent: SavedGodparentAnswer | null } | null;
  /** "Ninong", "Ninang", or "Ninong/Ninang" when unknown. */
  roleLabel: string;
  formHref: string | null;
  deadline: string;
};

export function GodparentResponse({ mode, invite, roleLabel, formHref, deadline }: GodparentResponseProps) {
  const closed = useDeadlinePassed(deadline);

  if (closed) {
    return (
      <p className="text-center text-ink-soft">
        Our response period has ended. Please message the family directly — we&rsquo;d love to hear from you.
      </p>
    );
  }

  if (mode === "live" && invite) return <LiveAnswer code={invite.code} saved={invite.godparent} roleLabel={roleLabel} />;

  if (formHref) {
    return (
      <FormRedirect href={formHref} label="Respond to the Godparent Invitation">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
          The form asks whether you accept the role of {roleLabel}, and lets you leave a message for the family.
        </p>
      </FormRedirect>
    );
  }

  return (
    <p className="text-center text-ink-soft">
      Please share your answer with the family personally — we can&rsquo;t wait to hear from you.
    </p>
  );
}

function LiveAnswer({ code, saved: initial, roleLabel }: { code: string; saved: SavedGodparentAnswer | null; roleLabel: string }) {
  const [saved, setSaved] = useState(initial);
  const [editing, setEditing] = useState(!initial);
  const [justSaved, setJustSaved] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(initial?.accepted ?? null);
  const [message, setMessage] = useState(initial?.message ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  const ids = useId();
  const resultRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (accepted === null) {
      setStatus("error");
      setError("Please choose an answer.");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setStatus("submitting");
    setError("");
    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    const result = await submitResponse({ action: "godparent", code, accepted, message, website });

    if (!result.ok || !result.godparent) {
      setStatus("error");
      setError(result.ok ? "Something went wrong. Please try again." : result.error);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setSaved(result.godparent);
    setStatus("idle");
    setEditing(false);
    setJustSaved(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  if (saved && !editing) {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="text-center outline-none">
        {saved.accepted ? (
          <>
            <p className="font-script text-4xl text-rose-600">{justSaved ? "Thank you!" : "You said yes!"}</p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {justSaved ? "Your answer has been saved. " : ""}We&rsquo;re overjoyed that you&rsquo;ll be my {roleLabel}.
            </p>
          </>
        ) : (
          <>
            <p className="font-script text-4xl text-rose-600">Thank you for telling us</p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {justSaved ? "Your answer has been saved. " : ""}We understand completely, and you&rsquo;re still so welcome
              to celebrate with us.
            </p>
          </>
        )}
        {saved.updatedAt && !justSaved && (
          <p className="mt-2 text-sm text-ink-soft">Answered {formatSavedAt(saved.updatedAt)}.</p>
        )}
        <p className="mt-5 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-ink">
          This answer is about the godparent role only.{" "}
          <a href="#rsvp" className={textLink}>
            Please RSVP for the celebration below
          </a>
          .
        </p>
        <button type="button" className={`mt-4 text-sm ${textLink}`} onClick={() => { setEditing(true); setJustSaved(false); }}>
          Change my answer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-4 w-full text-center font-serif text-2xl text-ink">Will you be my {roleLabel}?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: true, title: "Yes, I’d be honored" },
            { value: false, title: "I’m sorry, I can’t" },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex cursor-pointer items-center gap-3 rounded-3xl border-2 bg-white/80 p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blush-200 ${
                accepted === opt.value ? "border-rose-500 bg-blush-50 shadow-md" : "border-blush-200 hover:border-rose-300"
              }`}
            >
              <input
                type="radio"
                name="accepted"
                className="h-5 w-5 accent-rose-600"
                checked={accepted === opt.value}
                onChange={() => {
                  setAccepted(opt.value);
                  if (status === "error") setStatus("idle");
                }}
              />
              <span className="font-serif text-lg text-ink">{opt.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor={`${ids}-gp-message`} className="mt-5 block font-sans text-sm font-medium text-ink">
        A note for the family <span className="font-normal text-ink-soft">(optional)</span>
      </label>
      <textarea
        id={`${ids}-gp-message`}
        rows={3}
        maxLength={LIMITS.message}
        className={`${field} mt-2 resize-y`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="mt-4 min-h-6" role="alert">
        {status === "error" && error && (
          <p ref={errorRef} tabIndex={-1} className="rounded-2xl border border-rose-300 bg-blush-50 px-4 py-3 text-center text-sm text-rose-600 outline-none">
            {error}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-col items-center gap-3">
        <button type="submit" className={buttonPrimary} disabled={status === "submitting"} aria-busy={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <SpinnerIcon className="h-4 w-4" />
              Sending…
            </>
          ) : (
            "Send My Answer"
          )}
        </button>
        {saved && (
          <button type="button" className={`text-sm ${textLink}`} onClick={() => setEditing(false)}>
            Keep my previous answer
          </button>
        )}
      </div>
    </form>
  );
}
