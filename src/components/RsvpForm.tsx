"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { FormRedirect } from "@/components/FormRedirect";
import { SpinnerIcon } from "@/components/icons";
import { buttonPrimary, buttonSecondary, field, textLink } from "@/components/ui";
import { formatSavedAt, submitResponse, useDeadlinePassed, useSharedName } from "@/lib/client";
import { LIMITS, type InviteType, type SavedRsvp } from "@/lib/invite";

export type RsvpFormProps = {
  mode: "live" | "form" | "none";
  /** Present only when the invitation was verified against the Google Sheet. */
  invite: { code: string; name: string; maxGuests: number; rsvp: SavedRsvp | null } | null;
  /** Unverified display name from the link (Google Forms mode only). */
  guestName?: string;
  /** Which shared page the guest is on, for answers typed without a personal code. */
  guestType: InviteType;
  /** Most people one response from a shared link can bring. */
  openMaxGuests: number;
  formHref: string | null;
  deadline: string;
  deadlineLabel: string;
};

export function RsvpForm(props: RsvpFormProps) {
  const closed = useDeadlinePassed(props.deadline);
  const { mode, invite, formHref, guestName, guestType, openMaxGuests, deadlineLabel } = props;

  if (closed) {
    return (
      <Notice title="RSVPs are now closed">
        Our RSVP period ended on {deadlineLabel}. If your plans have changed, please message the family directly.
      </Notice>
    );
  }

  if (mode === "live") {
    return invite ? (
      <LiveRsvp
        code={invite.code}
        inviteName={invite.name}
        guestType={guestType}
        maxGuests={invite.maxGuests}
        initial={invite.rsvp}
        deadlineLabel={deadlineLabel}
      />
    ) : (
      <LiveRsvp code={null} guestType={guestType} maxGuests={openMaxGuests} initial={null} deadlineLabel={deadlineLabel} />
    );
  }

  if (formHref) {
    return (
      <FormRedirect href={formHref} label="Confirm My Attendance">
        {guestName && <p className="font-serif text-2xl text-ink">Dear {guestName},</p>}
        <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">
          The form asks for your name, whether you can attend, how many will be coming, the names of your companions,
          and an optional message for the family. Kindly respond by <strong className="text-ink">{deadlineLabel}</strong>.
        </p>
      </FormRedirect>
    );
  }

  return (
    <Notice title="RSVP opens soon">
      Our RSVP form isn&rsquo;t ready yet. Please check back soon, or message the family directly.
    </Notice>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="font-serif text-2xl text-ink">{title}</p>
      <p className="mt-3 leading-relaxed text-ink-soft">{children}</p>
    </div>
  );
}

/**
 * RSVP saved straight to the Google Sheet. With a personal `code` the guest is
 * already known; on the shared links (`code` null) they type their name, and
 * sending again with the same name updates their earlier answer.
 */
function LiveRsvp({
  code,
  inviteName,
  guestType,
  maxGuests,
  initial,
  deadlineLabel,
}: {
  code: string | null;
  inviteName?: string;
  guestType: InviteType;
  maxGuests: number;
  initial: SavedRsvp | null;
  deadlineLabel: string;
}) {
  const [typedName, setTypedName] = useSharedName();
  const name = code ? (inviteName ?? "") : typedName;
  const [saved, setSaved] = useState<SavedRsvp | null>(initial);
  const [editing, setEditing] = useState(!initial);
  const [justSaved, setJustSaved] = useState(false);

  const [attending, setAttending] = useState<boolean | null>(initial?.attending ?? null);
  const [count, setCount] = useState(Math.min(Math.max(initial?.guestCount || 1, 1), maxGuests));
  const [companions, setCompanions] = useState<string[]>(() => {
    const list = initial?.companions ?? [];
    return Array.from({ length: Math.max(maxGuests - 1, 0) }, (_, i) => list[i] ?? "");
  });
  const [message, setMessage] = useState(initial?.message ?? "");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  const ids = useId();
  const resultRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code && !name.trim()) {
      setStatus("error");
      setError("Please enter your name.");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    if (attending === null) {
      setStatus("error");
      setError("Please let us know whether you can attend.");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    setStatus("submitting");
    setError("");

    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    const result = await submitResponse({
      ...(code ? { code } : { name: name.trim(), guestType }),
      action: "rsvp",
      attending,
      guestCount: attending ? count : 0,
      companions: attending ? companions.slice(0, count - 1).filter((c) => c.trim()) : [],
      message,
      website,
    });

    if (!result.ok || !result.rsvp) {
      setStatus("error");
      setError(result.ok ? "Something went wrong. Please try again." : result.error);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSaved(result.rsvp);
    setStatus("idle");
    setEditing(false);
    setJustSaved(true);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      resultRef.current?.focus({ preventScroll: true });
    });
  }

  if (saved && !editing) {
    return (
      <div ref={resultRef} tabIndex={-1} className="mx-auto max-w-lg text-center outline-none" role="status" aria-live="polite">
        <p className="font-script text-5xl text-rose-600">{justSaved ? `Thank you, ${name}!` : `Hello again, ${name}`}</p>
        {saved.attending ? (
          <p className="mt-4 leading-relaxed text-ink-soft">
            {justSaved ? "Your RSVP has been saved. " : "We already have your RSVP. "}
            We&rsquo;ve noted <strong className="text-ink">{saved.guestCount} {saved.guestCount === 1 ? "guest" : "guests"}</strong>
            {saved.companions.length > 0 && <> ({[name, ...saved.companions].join(", ")})</>}. We can&rsquo;t wait to
            celebrate with you!
          </p>
        ) : (
          <p className="mt-4 leading-relaxed text-ink-soft">
            {justSaved ? "Your response has been saved. " : "We already have your response. "}
            We&rsquo;ll miss you, and we&rsquo;re grateful you let us know. Thank you for keeping our little one in your
            prayers.
          </p>
        )}
        {saved.updatedAt && !justSaved && (
          <p className="mt-2 text-sm text-ink-soft">Last updated {formatSavedAt(saved.updatedAt)}.</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#top" className={buttonSecondary}>
            Back to the invitation
          </a>
          <button
            type="button"
            className={`text-sm ${textLink} px-3`}
            onClick={() => {
              setEditing(true);
              setJustSaved(false);
            }}
          >
            Update my response
          </button>
        </div>
        <p className="mt-6 text-xs text-ink-soft">You can change your answer until {deadlineLabel}.</p>
      </div>
    );
  }

  const companionSlots = attending ? count - 1 : 0;

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-xl" aria-describedby={`${ids}-intro`}>
      <div id={`${ids}-intro`} className="text-center">
        {code ? (
          <>
            <p className="font-serif text-2xl text-ink">Dear {name},</p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              We have reserved{" "}
              <strong className="text-ink">
                {maxGuests} {maxGuests === 1 ? "seat" : "seats"}
              </strong>{" "}
              in your honor. Please let us know if you can join us, how many will come, and who is coming with you.
              Kindly respond by <strong className="text-ink">{deadlineLabel}</strong>.
            </p>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl text-ink">We&rsquo;d love to celebrate with you</p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Please tell us your name, whether you can join us, how many will come, and who is coming with you. Kindly
              respond by <strong className="text-ink">{deadlineLabel}</strong>.
            </p>
          </>
        )}
      </div>

      {!code && (
        <div className="mt-6">
          <label htmlFor={`${ids}-name`} className="block font-sans text-sm font-medium text-ink">
            Your name
          </label>
          <input
            id={`${ids}-name`}
            type="text"
            required
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="e.g. Maria Santos"
            className={`${field} mt-2`}
            value={name}
            onChange={(e) => {
              setTypedName(e.target.value);
              if (status === "error") setStatus("idle");
            }}
          />
        </div>
      )}

      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="sr-only">Will you attend?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: true, title: "Joyfully attending", hint: "Count me in!" },
            { value: false, title: "Unable to attend", hint: "With regrets" },
          ].map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex cursor-pointer items-center gap-4 rounded-3xl border-2 bg-white/80 p-5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blush-200 ${
                attending === opt.value ? "border-rose-500 bg-blush-50 shadow-md" : "border-blush-200 hover:border-rose-300"
              }`}
            >
              <input
                type="radio"
                name="attending"
                className="h-5 w-5 accent-rose-600"
                checked={attending === opt.value}
                onChange={() => {
                  setAttending(opt.value);
                  if (status === "error") setStatus("idle");
                }}
              />
              <span>
                <span className="block font-serif text-xl text-ink">{opt.title}</span>
                <span className="block text-sm text-ink-soft">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {attending && (
        <div className="mt-8 space-y-6 animate-fade-up">
          {maxGuests > 1 ? (
            <div>
              <label htmlFor={`${ids}-count`} className="block font-sans text-sm font-medium text-ink">
                Number of attendees, including you
              </label>
              <select
                id={`${ids}-count`}
                className={`${field} mt-2`}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? "1 — just me" : `${n} people`}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-ink-soft">
                Up to {maxGuests} {code ? "for this invitation" : "per response"}.
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-blush-50 px-4 py-3 text-center text-sm text-ink-soft">
              This invitation is for <strong className="text-ink">one guest</strong> — you!
            </p>
          )}

          {companionSlots > 0 && (
            <fieldset>
              <legend className="font-sans text-sm font-medium text-ink">
                Who&rsquo;s coming with you? <span className="font-normal text-ink-soft">(optional)</span>
              </legend>
              <div className="mt-2 space-y-2">
                {Array.from({ length: companionSlots }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    aria-label={`Companion ${i + 1} name`}
                    placeholder={`Companion ${i + 1}`}
                    maxLength={LIMITS.companionName}
                    autoComplete="off"
                    className={field}
                    value={companions[i] ?? ""}
                    onChange={(e) =>
                      setCompanions((prev) => prev.map((c, j) => (j === i ? e.target.value : c)))
                    }
                  />
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      {attending !== null && (
        <div className="mt-6">
          <label htmlFor={`${ids}-message`} className="block font-sans text-sm font-medium text-ink">
            A message for the family <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            id={`${ids}-message`}
            rows={3}
            maxLength={LIMITS.message}
            className={`${field} mt-2 resize-y`}
            placeholder="Wishes, prayers, or a sweet note for the baby"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-ink-soft">
            {message.length}/{LIMITS.message}
          </p>
        </div>
      )}

      <div className="mt-6 min-h-6" role="alert">
        {status === "error" && error && (
          <p ref={errorRef} tabIndex={-1} className="rounded-2xl border border-rose-300 bg-blush-50 px-4 py-3 text-center text-sm text-rose-600 outline-none">
            {error}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <button type="submit" className={buttonPrimary} disabled={status === "submitting"} aria-busy={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <SpinnerIcon className="h-4 w-4" />
              Saving…
            </>
          ) : attending === false ? (
            "Send My Response"
          ) : (
            "Confirm My Attendance"
          )}
        </button>
        {saved && (
          <button type="button" className={`text-sm ${textLink}`} onClick={() => setEditing(false)}>
            Keep my previous answer
          </button>
        )}
        <p className="max-w-md text-center text-xs leading-relaxed text-ink-soft">
          {code
            ? "Your answer goes straight to the family\u2019s private guest list. Sending again later updates it rather than adding a duplicate."
            : "Your answer goes straight to the family\u2019s private guest list. To change it later, send it again using the same name."}
        </p>
      </div>
    </form>
  );
}
