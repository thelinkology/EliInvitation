/**
 * Shared, client-safe types and validation for invitations and RSVPs.
 * Used by the API route (server) and by the RSVP forms (browser).
 */

export type InviteType = "guest" | "godparent";
export type GodparentRole = "Ninong" | "Ninang" | "";

export type SavedRsvp = {
  attending: boolean;
  guestCount: number;
  companions: string[];
  message: string;
  updatedAt: string;
};

export type SavedGodparentAnswer = {
  accepted: boolean;
  message: string;
  updatedAt: string;
};

/** One invitation, as returned by Apps Script for a single code. */
export type Invite = {
  code: string;
  name: string;
  type: InviteType;
  role: GodparentRole;
  /** Total seats reserved for this invitation, including the invitee. */
  maxGuests: number;
  rsvp: SavedRsvp | null;
  godparent: SavedGodparentAnswer | null;
};

export const LIMITS = {
  message: 500,
  companionName: 80,
  /** Hard ceiling regardless of what the Sheet says. */
  maxGuests: 20,
} as const;

/** Codes are 6–12 letters/digits. Generated codes use 8 unambiguous characters. */
export const CODE_PATTERN = /^[A-Za-z0-9]{6,12}$/;

export function normalizeCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return CODE_PATTERN.test(code) ? code : null;
}

export type RsvpPayload = {
  action: "rsvp";
  code: string;
  attending: boolean;
  guestCount: number;
  companions: string[];
  message: string;
};

export type GodparentPayload = {
  action: "godparent";
  code: string;
  accepted: boolean;
  message: string;
};

export type SubmitPayload = RsvpPayload | GodparentPayload;

export type ValidationResult = { ok: true; value: SubmitPayload } | { ok: false; error: string };

function cleanText(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : null;
}

/**
 * Validates an RSVP submission's shape and basic bounds. The per-invitation
 * guest limit is enforced again by Apps Script against the Sheet, which is
 * the source of truth.
 */
export function validateSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request." };
  const body = input as Record<string, unknown>;

  const code = typeof body.code === "string" ? normalizeCode(body.code) : null;
  if (!code) return { ok: false, error: "This invitation link is not valid." };

  const message = cleanText(body.message, LIMITS.message);
  if (message === null) return { ok: false, error: `Messages can be up to ${LIMITS.message} characters.` };

  if (body.action === "godparent") {
    if (typeof body.accepted !== "boolean") return { ok: false, error: "Please choose an answer." };
    return { ok: true, value: { action: "godparent", code, accepted: body.accepted, message } };
  }

  if (body.action !== "rsvp") return { ok: false, error: "Invalid request." };
  if (typeof body.attending !== "boolean") return { ok: false, error: "Please let us know if you can attend." };

  if (!body.attending) {
    return { ok: true, value: { action: "rsvp", code, attending: false, guestCount: 0, companions: [], message } };
  }

  const guestCount = body.guestCount;
  if (typeof guestCount !== "number" || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > LIMITS.maxGuests) {
    return { ok: false, error: "Please choose how many will attend." };
  }

  if (!Array.isArray(body.companions) || body.companions.length > guestCount - 1) {
    return { ok: false, error: "Too many companion names for the number of attendees." };
  }
  const companions: string[] = [];
  for (const raw of body.companions) {
    const name = cleanText(raw, LIMITS.companionName);
    if (name === null) return { ok: false, error: `Companion names can be up to ${LIMITS.companionName} characters.` };
    if (name) companions.push(name);
  }

  return { ok: true, value: { action: "rsvp", code, attending: true, guestCount, companions, message } };
}
