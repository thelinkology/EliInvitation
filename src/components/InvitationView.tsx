import { CountdownPanel } from "@/components/CountdownPanel";
import { BearFace } from "@/components/Decor";
import { Envelope } from "@/components/Envelope";
import { FloatingRsvp, Footer } from "@/components/Footer";
import { GodparentSection } from "@/components/GodparentSection";
import { Hero } from "@/components/Hero";
import { DressCodePanel, GiftGuidePanel, GodparentsPanel, ProtocolPanel } from "@/components/InfoPanels";
import { LocationPanel } from "@/components/LocationPanel";
import { MessagePanel } from "@/components/MessagePanel";
import { RsvpSection } from "@/components/RsvpSection";
import { SaveTheDate } from "@/components/SaveTheDate";
import { ScrollFx } from "@/components/ScrollFx";
import { event, rsvpDeadlineLabel } from "@/config/event";
import { formLink, rsvpMode, type RsvpMode } from "@/config/rsvp";
import type { GodparentRole, Invite } from "@/lib/invite";

export type InvitationViewProps = {
  /** Verified invitation from the Google Sheet, if any. */
  invite: Invite | null;
  /** Display-only name and type from the link (used when there is no verified invite). */
  convenience?: { name?: string; isGodparent: boolean; role: GodparentRole };
  /** Shown above the invitation when personal details couldn't be loaded. */
  notice?: string;
  /** Force Google Forms fallback even if Apps Script is configured (e.g. it is unreachable). */
  forceFormMode?: boolean;
};

/** The invitation as a column of card-like panels, like a printed fold-out invitation. */
export function InvitationView({ invite, convenience, notice, forceFormMode }: InvitationViewProps) {
  const name = invite?.name ?? convenience?.name;
  const isGodparent = invite ? invite.type === "godparent" : (convenience?.isGodparent ?? false);
  const role = invite?.role || convenience?.role || "";
  const roleLabel = role || "Ninong/Ninang";

  const configured: RsvpMode = rsvpMode();
  const mode: RsvpMode = forceFormMode && configured === "live" ? "form" : configured;
  const viewer = invite || convenience?.name ? (isGodparent ? "godparent" : "guest") : undefined;

  return (
    <>
      <Envelope recipient={name} isGodparent={isGodparent} />

      <ScrollFx />

      <main className="mx-auto max-w-[480px] overflow-hidden bg-cream shadow-[0_0_60px_-10px_rgba(176,77,108,0.35)]">
        {notice && (
          <div role="status" className="bg-blush-100 px-5 py-3 text-center text-sm text-ink">
            {notice}
          </div>
        )}

        <Hero greetingName={name} />
        <CountdownPanel />

        {isGodparent && name && (
          <GodparentSection
            name={name}
            mode={mode}
            invite={invite ? { code: invite.code, godparent: invite.godparent } : null}
            roleLabel={roleLabel}
            formHref={formLink("godparent", name)}
            deadline={event.rsvpDeadline}
          />
        )}

        <LocationPanel />
        <SaveTheDate />
        <GodparentsPanel />
        <DressCodePanel viewer={viewer} />
        <GiftGuidePanel />
        <ProtocolPanel />

        <RsvpSection
          isGodparent={isGodparent}
          mode={mode}
          invite={invite ? { code: invite.code, name: invite.name, maxGuests: invite.maxGuests, rsvp: invite.rsvp } : null}
          guestName={invite ? undefined : name}
          formHref={formLink(isGodparent ? "godparentAttendance" : "guest", name)}
          deadline={event.rsvpDeadline}
          deadlineLabel={rsvpDeadlineLabel}
        />

        <MessagePanel />
      </main>

      <Footer />
      <FloatingRsvp />
    </>
  );
}

/** Lightweight placeholder while personal details load from the Sheet. */
export function InvitationLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#fde4ec] px-6 text-center" role="status">
      <BearFace bow className="w-24 animate-float" />
      <p className="font-script text-4xl text-cocoa">Preparing your invitation…</p>
    </div>
  );
}
