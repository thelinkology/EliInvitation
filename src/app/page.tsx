import { Suspense } from "react";

import { InvitationLoading, InvitationView } from "@/components/InvitationView";
import type { GodparentRole } from "@/lib/invite";

/**
 * Shared invitation page.
 *
 * Optional query parameters personalize the greeting for Google Forms mode:
 *   /?to=Tita%20Maria&type=godparent&role=ninang
 * They are display-only conveniences — anyone can edit a URL, so they never
 * verify identity or unlock anything. Verified invitations use /i/<code>.
 */
export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<InvitationLoading />}>
      <SharedInvitation searchParams={searchParams} />
    </Suspense>
  );
}

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

async function SharedInvitation({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const query = await searchParams;

  const rawName = Array.from(param(query.to))
    .filter((ch) => ch >= " " && ch !== "<" && ch !== ">")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  const name = rawName.length > 0 && rawName.length <= 60 ? rawName : undefined;
  const isGodparent = param(query.type).toLowerCase() === "godparent";
  const roleParam = param(query.role).toLowerCase();
  const role: GodparentRole = roleParam === "ninong" ? "Ninong" : roleParam === "ninang" ? "Ninang" : "";

  return <InvitationView invite={null} convenience={{ name, isGodparent, role }} />;
}
