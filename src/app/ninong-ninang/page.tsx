import type { Metadata } from "next";
import { Suspense } from "react";

import { InvitationLoading, InvitationView } from "@/components/InvitationView";
import { event, eventDateLong } from "@/config/event";
import { cleanDisplayName, type GodparentRole } from "@/lib/invite";

export const metadata: Metadata = {
  title: `Will you be my Ninong or Ninang? · ${event.babyName}`,
  description: `A special request for the Christening of ${event.babyName} on ${eventDateLong}.`,
  openGraph: {
    title: `Will you be my Ninong or Ninang? · ${event.babyName}`,
    description: `A special request for my Christening · ${eventDateLong} · ${event.ceremony.venue}`,
    url: "/ninong-ninang",
    siteName: `Christening of ${event.babyName}`,
    locale: "en_PH",
    type: "website",
  },
};

/**
 * Godparent invitation — the link shared with Ninongs and Ninangs. Adds the
 * "Will you be my Ninong or Ninang?" request and its answer form above the
 * regular invitation.
 *
 * Optional `?to=Name&role=ninong|ninang` personalizes the greeting and title
 * (display only; anyone can edit a URL).
 */
export default function NinongNinangPage({ searchParams }: PageProps<"/ninong-ninang">) {
  return (
    <Suspense fallback={<InvitationLoading />}>
      <GodparentInvitation searchParams={searchParams} />
    </Suspense>
  );
}

async function GodparentInvitation({ searchParams }: Pick<PageProps<"/ninong-ninang">, "searchParams">) {
  const query = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const name = cleanDisplayName(first(query.to), 60);
  const roleParam = first(query.role).toLowerCase();
  const role: GodparentRole = roleParam === "ninong" ? "Ninong" : roleParam === "ninang" ? "Ninang" : "";
  return <InvitationView invite={null} convenience={{ name, isGodparent: true, role }} />;
}
