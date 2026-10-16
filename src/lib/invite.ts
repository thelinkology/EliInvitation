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
  /** Guest's own name, typed on the shared links. */
  name: 80,
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

/**
 * Who is answering: a personal invitation code (/i/CODE links), or — on the
 * shared links — the name the guest typed plus which page they used.
 */
export type Responder = { code: string; name?: undefined; guestType?: undefined } | { code?: undefined; name: string; guestType: InviteType };

export type RsvpPayload = Responder & {
  action: "rsvp";
  attending: boolean;
  guestCount: number;
  companions: string[];
  message: string;
};

export type GodparentPayload = Responder & {
  action: "godparent";
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

/** A display name from a link or form: no control characters or angle brackets, at most `max` characters. */
export function cleanDisplayName(raw: string, max: number = LIMITS.name): string | undefined {
  const text = Array.from(raw)
    .filter((ch) => ch >= " " && ch !== "<" && ch !== ">")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 && text.length <= max ? text : undefined;
}

function responderOf(body: Record<string, unknown>): Responder | string {
  if (body.code !== undefined) {
    const code = typeof body.code === "string" ? normalizeCode(body.code) : null;
    return code ? { code } : "This invitation link is not valid.";
  }
  const name = typeof body.name === "string" ? cleanDisplayName(body.name) : undefined;
  if (!name) return "Please enter your name.";
  return { name, guestType: body.guestType === "godparent" ? "godparent" : "guest" };
}

/**
 * Validates an RSVP submission's shape and basic bounds. Guest limits are
 * enforced again by Apps Script against the Sheet, which is the source of truth.
 */
export function validateSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request." };
  const body = input as Record<string, unknown>;

  const who = responderOf(body);
  if (typeof who === "string") return { ok: false, error: who };

  const message = cleanText(body.message, LIMITS.message);
  if (message === null) return { ok: false, error: `Messages can be up to ${LIMITS.message} characters.` };

  if (body.action === "godparent") {
    if (typeof body.accepted !== "boolean") return { ok: false, error: "Please choose an answer." };
    return { ok: true, value: { ...who, action: "godparent", accepted: body.accepted, message } };
  }

  if (body.action !== "rsvp") return { ok: false, error: "Invalid request." };
  if (typeof body.attending !== "boolean") return { ok: false, error: "Please let us know if you can attend." };

  if (!body.attending) {
    return { ok: true, value: { ...who, action: "rsvp", attending: false, guestCount: 0, companions: [], message } };
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

  return { ok: true, value: { ...who, action: "rsvp", attending: true, guestCount, companions, message } };
}

const HONORIFICS = new Set(["tito", "tita", "ate", "kuya", "lolo", "lola", "mr", "mrs", "ms", "dr", "sir", "ma'am"]);

/**
 * How the baby addresses a godparent: "Jaypee Hernandez" + "Ninong" → "Ninong Jaypee".
 * A leading Tito/Tita/Ate/Kuya… is skipped ("Tita Maria Cruz" → "Ninang Maria").
 * Without a role, the name is returned as typed.
 */
export function godparentAddress(name: string | undefined, role: GodparentRole): string | undefined {
  if (!name) return undefined;
  if (!role) return name;
  const words = name.trim().split(/\s+/);
  const skip = words.length > 1 && HONORIFICS.has(words[0].toLowerCase().replace(/\.$/, "")) ? 1 : 0;
  return `${role} ${words[skip]}`;
}
