import "server-only";

/**
 * RSVP configuration — the ONLY place that reads RSVP-related settings.
 *
 * All values come from environment variables so you never have to edit code
 * to connect your Google Sheet or Google Forms. Locally they live in
 * `.env.local`; on Vercel they live in Project → Settings → Environment
 * Variables. See `.env.example` and `docs/SETUP.md`.
 *
 * This module is server-only: the Apps Script secret never reaches the browser.
 */

export type RsvpMode =
  /** Custom RSVP form → Apps Script → Google Sheet (guest limits enforced). */
  | "live"
  /** Buttons open your Google Forms in a new tab. */
  | "form"
  /** Nothing configured yet. */
  | "none";

export type FormKind = "guest" | "godparent" | "godparentAttendance";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

const APPS_SCRIPT_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const FORM_URL_PATTERN = /^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/;

export function appsScriptConfig(): { url: string; secret: string } | null {
  const url = env("APPS_SCRIPT_URL");
  const secret = env("APPS_SCRIPT_SECRET");
  if (!url || !secret) return null;
  // A local mock (http://localhost:<port>/...) is allowed for testing: always in development,
  // and in a local production build when APPS_SCRIPT_ALLOW_LOCAL=1.
  const localMock =
    (process.env.NODE_ENV !== "production" || process.env.APPS_SCRIPT_ALLOW_LOCAL === "1") &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+\//.test(url);
  if (!APPS_SCRIPT_URL_PATTERN.test(url) && !localMock) {
    console.error(
      "[rsvp] APPS_SCRIPT_URL must look like https://script.google.com/macros/s/<id>/exec — ignoring it.",
    );
    return null;
  }
  return { url, secret };
}

function formBase(kind: FormKind): string {
  const guest = env("GOOGLE_FORM_GUEST_URL");
  const godparent = env("GOOGLE_FORM_GODPARENT_URL");
  const godparentAttendance = env("GOOGLE_FORM_GODPARENT_ATTENDANCE_URL");
  const url =
    kind === "guest"
      ? guest
      : kind === "godparent"
        ? godparent || guest
        : godparentAttendance || godparent || guest;
  if (url && !FORM_URL_PATTERN.test(url)) {
    console.error(`[rsvp] Google Form URL for "${kind}" is not a docs.google.com/forms or forms.gle link — ignoring it.`);
    return "";
  }
  return url;
}

function nameEntry(kind: FormKind): string {
  const entry =
    kind === "guest"
      ? env("GOOGLE_FORM_GUEST_NAME_ENTRY")
      : kind === "godparent"
        ? env("GOOGLE_FORM_GODPARENT_NAME_ENTRY")
        : env("GOOGLE_FORM_GODPARENT_ATTENDANCE_NAME_ENTRY") || env("GOOGLE_FORM_GODPARENT_NAME_ENTRY");
  return /^entry\.\d+$/.test(entry) ? entry : "";
}

/**
 * Google Form link for a guest, optionally prefilled with their name.
 *
 * Prefilled values are a convenience only: guests can edit them, so they never
 * identify who actually submitted the form.
 */
export function formLink(kind: FormKind, name?: string): string | null {
  const base = formBase(kind);
  if (!base) return null;
  const entry = nameEntry(kind);
  // forms.gle short links drop query strings on redirect, so only prefill full links.
  if (!name || !entry || base.startsWith("https://forms.gle/")) return base;
  const url = new URL(base);
  url.searchParams.set("usp", "pp_url");
  url.searchParams.set(entry, name);
  return url.toString();
}

export function rsvpMode(): RsvpMode {
  if (appsScriptConfig()) return "live";
  if (formBase("guest") || formBase("godparent")) return "form";
  return "none";
}
