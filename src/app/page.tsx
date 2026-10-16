import { Suspense } from "react";

import { InvitationLoading, InvitationView } from "@/components/InvitationView";
import { cleanDisplayName } from "@/lib/invite";

/**
 * General invitation — the link shared with all guests.
 *
 * Optional `?to=Name` adds a "Dear Name" greeting. It is a display-only
 * convenience: anyone can edit a URL, so it never identifies who responds.
 * Godparents get /ninong-ninang; personal invitations use /i/<code>.
 */
export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<InvitationLoading />}>
      <GeneralInvitation searchParams={searchParams} />
    </Suspense>
  );
}

async function GeneralInvitation({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { to } = await searchParams;
  const name = cleanDisplayName((Array.isArray(to) ? to[0] : to) ?? "", 60);
  return <InvitationView invite={null} convenience={{ name, isGodparent: false, role: "" }} />;
}
