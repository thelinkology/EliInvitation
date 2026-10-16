import type { NextRequest } from "next/server";

import { event } from "@/config/event";
import { validateSubmission } from "@/lib/invite";
import { submitToSheet } from "@/lib/sheets";

const MESSAGES = {
  not_configured: "Online RSVP isn't switched on yet. Please use the Google Form link instead.",
  not_found: "We couldn't find this invitation. Please check the link you received.",
  over_limit: "That's more guests than we were able to reserve for this invitation.",
  not_godparent: "This invitation isn't set up for a godparent response.",
  unavailable: "We couldn't reach our guest list just now. Please try again in a moment.",
} as const;

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  // Only accept submissions sent from this site's own pages.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return json(403, { ok: false, error: "Invalid request." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return json(400, { ok: false, error: "Invalid request." });
  }

  if (Date.now() > new Date(event.rsvpDeadline).getTime()) {
    return json(403, { ok: false, error: "The RSVP period has closed. Please message the family directly." });
  }

  const parsed = validateSubmission(body);
  if (!parsed.ok) return json(400, { ok: false, error: parsed.error });

  const result = await submitToSheet(parsed.value);
  if (!result.ok) {
    const status =
      result.error === "not_found" ? 404 : result.error === "unavailable" || result.error === "not_configured" ? 503 : 422;
    return json(status, { ok: false, error: MESSAGES[result.error] });
  }

  // Only now — after the Sheet confirmed the write — do we report success.
  const { invite } = result;
  return json(200, { ok: true, rsvp: invite.rsvp, godparent: invite.godparent });
}
