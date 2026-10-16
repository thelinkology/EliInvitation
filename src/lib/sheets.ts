import "server-only";

import { appsScriptConfig } from "@/config/rsvp";
import type { Invite, SubmitPayload } from "@/lib/invite";
import { LIMITS } from "@/lib/invite";

/**
 * Server-side client for the Google Apps Script web app that fronts the
 * Google Sheet (see `apps-script/Code.gs`). Every call carries the shared
 * secret, which only exists on the server.
 */

export type SheetError =
  | "not_configured"
  | "not_found"
  | "over_limit"
  | "not_godparent"
  | "unavailable";

export type SheetResult = { ok: true; invite: Invite } | { ok: false; error: SheetError };

const TIMEOUT_MS = 12_000;

async function call(body: Record<string, unknown>): Promise<SheetResult> {
  const config = appsScriptConfig();
  if (!config) return { ok: false, error: "not_configured" };

  let res: Response;
  try {
    // Apps Script answers POST with a 302 to googleusercontent.com; fetch follows it.
    res = await fetch(config.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...body, secret: config.secret }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[sheets] Apps Script request failed:", err);
    return { ok: false, error: "unavailable" };
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    // Apps Script returns an HTML page when the deployment is wrong or the script throws.
    console.error(`[sheets] Apps Script returned non-JSON (HTTP ${res.status}). Check the deployment's access is "Anyone".`);
    return { ok: false, error: "unavailable" };
  }

  if (!data || typeof data !== "object") return { ok: false, error: "unavailable" };
  const result = data as { ok?: boolean; error?: string; invite?: unknown };

  if (result.ok && result.invite) {
    const invite = parseInvite(result.invite);
    if (invite) return { ok: true, invite };
    console.error("[sheets] Apps Script returned an invite in an unexpected shape.");
    return { ok: false, error: "unavailable" };
  }

  switch (result.error) {
    case "not_found":
    case "over_limit":
    case "not_godparent":
      return { ok: false, error: result.error };
    case "unauthorized":
      console.error("[sheets] Apps Script rejected the secret. APPS_SCRIPT_SECRET must match the script's SHARED_SECRET property.");
      return { ok: false, error: "unavailable" };
    default:
      console.error("[sheets] Apps Script error:", result.error);
      return { ok: false, error: "unavailable" };
  }
}

function parseInvite(raw: unknown): Invite | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.code !== "string" || typeof r.name !== "string") return null;

  const type = r.type === "godparent" ? "godparent" : "guest";
  const role = r.role === "Ninong" || r.role === "Ninang" ? r.role : "";
  const max = Number(r.maxGuests);
  const maxGuests = Number.isInteger(max) && max >= 1 ? Math.min(max, LIMITS.maxGuests) : 1;

  const rsvpRaw = r.rsvp as Record<string, unknown> | null | undefined;
  const gpRaw = r.godparent as Record<string, unknown> | null | undefined;

  return {
    code: r.code,
    name: r.name,
    type,
    role,
    maxGuests,
    rsvp:
      rsvpRaw && typeof rsvpRaw.attending === "boolean"
        ? {
            attending: rsvpRaw.attending,
            guestCount: Number(rsvpRaw.guestCount) || 0,
            companions: Array.isArray(rsvpRaw.companions) ? rsvpRaw.companions.map(String) : [],
            message: String(rsvpRaw.message ?? ""),
            updatedAt: String(rsvpRaw.updatedAt ?? ""),
          }
        : null,
    godparent:
      gpRaw && typeof gpRaw.accepted === "boolean"
        ? {
            accepted: gpRaw.accepted,
            message: String(gpRaw.message ?? ""),
            updatedAt: String(gpRaw.updatedAt ?? ""),
          }
        : null,
  };
}

export function lookupInvite(code: string): Promise<SheetResult> {
  return call({ action: "lookup", code });
}

export function submitToSheet(payload: SubmitPayload): Promise<SheetResult> {
  return call(payload);
}
