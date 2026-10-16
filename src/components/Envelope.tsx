"use client";

import { useEffect, useRef, useState } from "react";

import { Balloon, BearFace, FloatingBits, RisingBalloons, Sparkles, StarGlyph } from "@/components/Decor";
import { EnvelopeRibbon } from "@/components/EnvelopeRibbon";
import { markRevealed } from "@/lib/client";

type State = "closed" | "untie" | "rise" | "leaving" | "gone";

// Jagged crack down the middle of the wax seal; each half is clipped to one side of it.
const SEAL_LEFT = "polygon(0 0, 52% 0, 46% 18%, 55% 37%, 45% 56%, 54% 75%, 47% 100%, 0 100%)";
const SEAL_RIGHT = "polygon(52% 0, 100% 0, 100% 100%, 47% 100%, 54% 75%, 45% 56%, 55% 37%, 46% 18%)";

/** Cream wax seal with an embossed teddy and a hidden crack line that appears when opened. */
function SealFace() {
  return (
    <>
      <span className="absolute inset-0 rounded-full bg-radial-[at_35%_30%] from-[#fff4dc] via-[#ecd3a4] to-[#c9a46a] shadow-[0_6px_14px_rgba(120,80,20,0.35),inset_0_-3px_6px_rgba(150,110,50,0.35),inset_0_3px_6px_rgba(255,255,255,0.7)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-[14%]" aria-hidden="true">
        <g fill="none" stroke="#fff8e8" strokeWidth="4" transform="translate(1 1.5)">
          <circle cx="30" cy="32" r="12" />
          <circle cx="70" cy="32" r="12" />
          <circle cx="50" cy="56" r="28" />
        </g>
        <g fill="none" stroke="#b38c55" strokeWidth="3.4">
          <circle cx="30" cy="32" r="12" />
          <circle cx="70" cy="32" r="12" />
          <circle cx="50" cy="56" r="28" />
          <ellipse cx="50" cy="66" rx="10" ry="7" />
        </g>
        <g fill="#b38c55">
          <circle cx="40" cy="52" r="3" />
          <circle cx="60" cy="52" r="3" />
          <ellipse cx="50" cy="63" rx="3.6" ry="2.6" />
        </g>
      </svg>
      <svg viewBox="0 0 100 100" className="env-crack absolute inset-0" aria-hidden="true">
        <polyline points="52,0 46,18 55,37 45,56 54,75 47,100" fill="none" stroke="#8a6432" strokeWidth="2.6" strokeLinejoin="round" />
        <polyline points="53,0 47,18 56,37 46,56 55,75 48,100" fill="none" stroke="#fff3d6" strokeWidth="1" strokeLinejoin="round" opacity="0.8" />
      </svg>
    </>
  );
}

/** Fired synchronously inside the tap, so the music player may start (browsers require a user gesture). */
export const OPEN_EVENT = "invitation:open";

/**
 * Full-screen ribboned envelope shown on arrival. It arrives closed and slowly
 * opens its flap so the card peeks out. Tapping it cracks the wax seal, unties
 * the bow and lets the ribbon fall away, glides the card out, and reveals the
 * invitation underneath.
 */
export function Envelope({ recipient, isGodparent }: { recipient?: string; isGodparent?: boolean }) {
  const [state, setState] = useState<State>("closed");
  const ribbonRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (state === "gone") {
      document.body.style.overflow = "";
      document.getElementById("top")?.focus({ preventScroll: true });
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  function open() {
    if (state !== "closed") return;
    window.dispatchEvent(new Event(OPEN_EVENT));
    // Starts the ribbon's choreographed untie (SVG animations keyed off #ribbonGo).
    ribbonRef.current?.querySelector<SVGAnimationElement>("#ribbonGo")?.beginElement();
    setState("untie");
    window.setTimeout(() => setState("rise"), 2000);
    window.setTimeout(() => {
      setState("leaving");
      markRevealed();
    }, 3700);
    window.setTimeout(() => setState("gone"), 4700);
  }

  if (state === "gone") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="envelope-title"
      data-envelope
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#fde4ec] px-4 transition-opacity duration-1000 ${
        state === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#fff6d9_2px,transparent_2.5px)] bg-size-[26px_26px] opacity-80" />
      <RisingBalloons />
      <FloatingBits rise="100vh" peak={0.85} />
      <Sparkles />
      <p id="envelope-title" className="relative mb-6 animate-fade-up text-center font-sans text-[11px] font-medium tracking-[0.4em] text-gold-700 uppercase">
        {isGodparent ? "A very special request" : "You have an invitation"}
      </p>

      <button
        type="button"
        onClick={open}
        aria-label={recipient ? `Open your invitation, ${recipient}` : "Open your invitation"}
        data-state={state}
        className="envelope group relative aspect-[4/5] w-[min(88vw,420px)] animate-fade-up cursor-pointer rounded-3xl transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-rose-500"
      >
        {/* Soft shadow the envelope casts on the table */}
        <span className="env-body absolute inset-x-[6%] bottom-[2%] h-[7%] rounded-[50%] bg-[#b04d6c]/25 blur-xl" />

        <span className="env-body absolute inset-0">
          {/* Top flap, standing open behind the card once it has lifted — its inside is lined */}
          <span className="env-flap-back absolute inset-x-0 top-[4%] h-[36%]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="env-flapback" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6dc95" />
                  <stop offset="1" stopColor="#ecc96f" />
                </linearGradient>
              </defs>
              <path d="M0 100L47 3Q50 -1 53 3L100 100Z" fill="url(#env-flapback)" />
            </svg>
            <span className="gingham-pink absolute inset-0" style={{ clipPath: "polygon(7% 100%, 50% 12%, 93% 100%)" }} />
            <span
              className="absolute inset-0 bg-linear-to-t from-[#b04d6c]/15 to-transparent"
              style={{ clipPath: "polygon(7% 100%, 50% 12%, 93% 100%)" }}
            />
          </span>

          {/* Inside back of the envelope, also lined; seen through the opening */}
          <span className="absolute inset-x-0 top-[40%] bottom-[6%] overflow-hidden rounded-t-sm rounded-b-[1.4rem] bg-[#eccb74]">
            <span className="gingham-pink absolute inset-x-[4%] top-[3%] bottom-[30%]" />
            <span className="absolute inset-0 bg-linear-to-b from-[#7a4a1c]/20 via-transparent to-transparent" />
          </span>
        </span>

        {/* Card inside — clipped at the envelope's bottom edge while it is tucked in */}
        <span className="absolute inset-0" style={{ clipPath: "inset(-100% -20% 7.5% -20%)" }}>
          <span className="env-card-peek absolute inset-0">
            <span className="env-card absolute inset-x-[8%] top-[8%] h-[58%] overflow-hidden rounded-xl border border-gold-300 bg-linear-to-b from-[#fde3ec] via-[#fff6dc] to-[#fffdf8] shadow-[0_-4px_14px_rgba(120,80,30,0.12)]">
              <span className="absolute -top-4 -left-6 h-20 w-32 rounded-full bg-white/80 blur-lg" />
              <span className="absolute top-6 -right-6 h-16 w-28 rounded-full bg-white/80 blur-lg" />
              <Balloon color="pink" className="absolute top-[6%] left-[8%] w-[13%]" />
              <Balloon color="yellow" className="absolute top-[3%] right-[7%] w-[19%]" />
              <StarGlyph className="absolute top-[30%] left-[30%] h-3 w-3 text-gold-400" />
              <StarGlyph className="absolute top-[12%] left-[46%] h-2.5 w-2.5 text-gold-400" />
              <StarGlyph className="absolute top-[40%] right-[24%] h-3 w-3 text-gold-400" />
              <span className="absolute inset-x-0 top-[30%] text-center font-script text-[2.6rem] leading-[0.95] text-rose-600 sm:text-5xl">
                You&rsquo;re
                <br />
                invited!
              </span>
              <BearFace bow className="absolute bottom-[4%] left-[6%] w-[20%]" />
            </span>
          </span>
        </span>

        <span className="env-body absolute inset-0">
          {/* Front pocket: side flaps folded in, bottom flap folded up over them */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-[40%] h-[54%] w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="env-pocket-clip">
                <rect width="100" height="100" rx="5" ry="7" />
              </clipPath>
              <linearGradient id="env-side-l" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#f6d888" />
                <stop offset="1" stopColor="#fbe6ad" />
              </linearGradient>
              <linearGradient id="env-side-r" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0" stopColor="#f3d27c" />
                <stop offset="1" stopColor="#f9e2a4" />
              </linearGradient>
              <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#f8de9a" />
                <stop offset="1" stopColor="#fdedc0" />
              </linearGradient>
              <filter id="env-fold-shadow" x="-10%" y="-20%" width="120%" height="140%">
                <feDropShadow dx="0" dy="-1.2" stdDeviation="1.2" floodColor="#9a6a1c" floodOpacity="0.22" />
              </filter>
              <filter id="env-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7" />
                <feColorMatrix values="0 0 0 0 0.55 0 0 0 0 0.4 0 0 0 0 0.2 0 0 0 0.12 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>
            <g clipPath="url(#env-pocket-clip)">
              <path d="M0 0L54 58L0 100Z" fill="url(#env-side-l)" filter="url(#env-fold-shadow)" />
              <path d="M100 0L46 58L100 100Z" fill="url(#env-side-r)" filter="url(#env-fold-shadow)" />
              <path d="M0 100L48 47Q50 45 52 47L100 100Z" fill="url(#env-bottom)" filter="url(#env-fold-shadow)" />
              {/* Crease highlights along the folded edges */}
              <path d="M0.5 0.5L53 57.5M99.5 0.5L47 57.5" stroke="#fff6dc" strokeWidth="0.6" opacity="0.9" />
              <path d="M1 99L48.5 47.5M99 99L51.5 47.5" stroke="#fff6dc" strokeWidth="0.6" opacity="0.8" />
              <path d="M0 0L54 58L0 100ZM100 0L46 58L100 100ZM0 100L48 47L52 47L100 100Z" fill="#fff" filter="url(#env-grain)" />
            </g>
          </svg>

          {/* Guest's name, handwritten like an address */}
          {recipient && (
            <span className="absolute bottom-[10%] left-[5%] w-[30%] -rotate-6 text-left" aria-hidden="true">
              <span className="block font-sans text-[8px] font-semibold tracking-[0.3em] text-gold-700 uppercase">To</span>
              <span className="block font-script text-xl leading-tight text-ink">{recipient}</span>
              <span className="mt-0.5 block border-b border-dashed border-rose-300" />
            </span>
          )}

          {/* Top flap, closed on arrival; folds up and away during the intro */}
          <span className="env-flap-front absolute inset-x-0 top-[40%] h-[36%] drop-shadow-[0_5px_5px_rgba(150,105,30,0.28)]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="env-flapfront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f7dc93" />
                  <stop offset="1" stopColor="#fbe7b0" />
                </linearGradient>
              </defs>
              <path d="M0 0H100L53 97Q50 101 47 97Z" fill="url(#env-flapfront)" />
              <path d="M1 0.6L49 97M99 0.6L51 97" stroke="#fff6dc" strokeWidth="0.7" opacity="0.85" />
              <path d="M0 0H100L53 97Q50 101 47 97Z" fill="#fff" filter="url(#env-grain)" />
            </svg>
          </span>
        </span>

        {/* Ribbon, bow and tag — untied and pulled away like real fabric (see EnvelopeRibbon) */}
        <EnvelopeRibbon svgRef={ribbonRef} />

        {/* Wax seal with an embossed teddy — cracks in two and the halves fall away */}
        <span className="env-seal absolute top-[57%] left-[38%] z-10 aspect-square w-[24%]">
          <span className="env-seal-half env-seal-l absolute inset-0" style={{ clipPath: SEAL_LEFT }}>
            <SealFace />
          </span>
          <span className="env-seal-half env-seal-r absolute inset-0" style={{ clipPath: SEAL_RIGHT }}>
            <SealFace />
          </span>
        </span>
      </button>

      <p className="env-hint relative mt-8 font-script text-3xl text-cocoa" aria-hidden="true">
        {state === "closed" ? "tap the envelope to open" : " "}
      </p>
    </div>
  );
}
