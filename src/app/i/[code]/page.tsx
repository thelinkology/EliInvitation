import Link from "next/link";
import { Suspense } from "react";

import { Flourish, Sparkles } from "@/components/Decor";
import { InvitationLoading, InvitationView } from "@/components/InvitationView";
import { buttonSecondary } from "@/components/ui";
import { normalizeCode } from "@/lib/invite";
import { lookupInvite } from "@/lib/sheets";

/** Personal invitation: /i/<code>. The code is looked up in the Google Sheet on the server. */
export default function PersonalInvitationPage({ params }: PageProps<"/i/[code]">) {
  return (
    <Suspense fallback={<InvitationLoading />}>
      <PersonalInvitation params={params} />
    </Suspense>
  );
}

async function PersonalInvitation({ params }: Pick<PageProps<"/i/[code]">, "params">) {
  const code = normalizeCode((await params).code);
  if (!code) return <InvitationNotFound />;

  const result = await lookupInvite(code);
  if (result.ok) return <InvitationView invite={result.invite} />;

  if (result.error === "not_found") return <InvitationNotFound />;

  // Not configured yet, or the Sheet is unreachable: still show the invitation,
  // and fall back to the Google Form links if they exist.
  return (
    <InvitationView
      invite={null}
      forceFormMode
      notice={
        result.error === "unavailable"
          ? "We couldn't load your personal invitation details just now. Please try your link again in a little while."
          : undefined
      }
    />
  );
}

function InvitationNotFound() {
  return (
    <main className="sky-wash relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Sparkles />
      <p className="relative font-sans text-xs font-medium uppercase tracking-[0.35em] text-gold-700">Oh, dear</p>
      <h1 className="relative mt-3 font-script text-5xl text-rose-600 sm:text-6xl">We couldn&rsquo;t find this invitation</h1>
      <Flourish className="relative mx-auto mt-4 h-5 w-48 text-gold-400" />
      <p className="relative mt-6 max-w-md leading-relaxed text-ink-soft">
        Please check that the link matches the one you received exactly. If it still doesn&rsquo;t open, message the
        family and we&rsquo;ll send it again.
      </p>
      <Link href="/" className={`relative mt-8 ${buttonSecondary}`}>
        View the invitation
      </Link>
    </main>
  );
}
