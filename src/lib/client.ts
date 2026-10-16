"use client";

import { useSyncExternalStore } from "react";

import type { SavedGodparentAnswer, SavedRsvp, SubmitPayload } from "@/lib/invite";

export type SubmitResponse =
  | { ok: true; rsvp: SavedRsvp | null; godparent: SavedGodparentAnswer | null }
  | { ok: false; error: string };

/** Sends a submission to our API route, which forwards it to the Google Sheet. */
export async function submitResponse(payload: SubmitPayload & { website?: string }): Promise<SubmitResponse> {
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => null)) as SubmitResponse | null;
    if (data && typeof data.ok === "boolean") return data;
    return { ok: false, error: "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "We couldn't connect. Please check your internet connection and try again." };
  }
}

const noopSubscribe = () => () => {};

/** null during server render, then whether the RSVP deadline has passed. */
export function useDeadlinePassed(deadline: string): boolean | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => Date.now() > new Date(deadline).getTime(),
    () => null,
  );
}

export function formatSavedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric" });
}

/** Fired when the envelope starts fading away and the invitation becomes visible. */
export const REVEALED_EVENT = "invitation:revealed";

export function markRevealed() {
  document.documentElement.dataset.revealed = "1";
  window.dispatchEvent(new Event(REVEALED_EVENT));
}

/**
 * Runs `cb` once the invitation is visible: immediately if there is no envelope
 * on the page (or it was already opened), otherwise when the envelope opens.
 */
export function whenRevealed(cb: () => void): () => void {
  if (document.documentElement.dataset.revealed === "1" || !document.querySelector("[data-envelope]")) {
    cb();
    return () => {};
  }
  window.addEventListener(REVEALED_EVENT, cb, { once: true });
  return () => window.removeEventListener(REVEALED_EVENT, cb);
}

// The name typed on a shared link, shared by the godparent answer and RSVP forms
// on the same page so guests only type it once.
let sharedName = "";
const nameListeners = new Set<() => void>();

export function useSharedName(): [string, (name: string) => void] {
  const name = useSyncExternalStore(
    (cb) => {
      nameListeners.add(cb);
      return () => nameListeners.delete(cb);
    },
    () => sharedName,
    () => "",
  );
  const set = (next: string) => {
    sharedName = next;
    nameListeners.forEach((cb) => cb());
  };
  return [name, set];
}
