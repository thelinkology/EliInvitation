import type { ReactNode } from "react";

import { GoldCross, HeartRule, LeafSprig, SatinBow, TinyHeart } from "@/components/art/Ribbons";
import { FloatingBits, Sparkles } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";

const TONES = {
  cream: "bg-linear-to-b from-[#fffaf0] via-[#fffdf8] to-[#fff6ee]",
  pink: "bg-linear-to-b from-[#fff1f5] via-[#fff8fa] to-[#ffeef3]",
  yellow: "bg-linear-to-b from-[#fffbea] via-[#fffdf5] to-[#fff6d9]",
} as const;

/**
 * One "page" of the invitation: an arched window on a soft background,
 * topped with a gold cross and a satin bow, like the printed card panels.
 */
export function Panel({
  children,
  id,
  labelledBy,
  label,
  tone = "cream",
  ornament = "cross",
  decor,
  className = "",
}: {
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  label?: string;
  tone?: keyof typeof TONES;
  ornament?: "cross" | "bow" | "none";
  /** Absolutely positioned art (bears, flowers, balloons) placed around the panel edges. */
  decor?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={`relative scroll-mt-4 overflow-hidden px-5 pb-16 ${ornament === "none" ? "pt-14" : "pt-36"} ${TONES[tone]} ${className}`}
    >
      {/* Arched window */}
      <div aria-hidden="true" className="arch-grow absolute inset-x-3 top-3 bottom-3 origin-bottom rounded-t-[999px] border border-blush-200 bg-paper/75 shadow-[inset_0_0_40px_rgba(251,211,223,0.35)]" />
      <div aria-hidden="true" className="arch-grow absolute inset-x-6 top-6 bottom-6 origin-bottom rounded-t-[999px] border border-gold-300/60" />
      {/* Decorations drift at their own pace while scrolling (see .decor-parallax). */}
      <div aria-hidden="true" className="decor-parallax pointer-events-none absolute inset-0">
        <Sparkles className="opacity-60" />
        <FloatingBits />
        {decor}
      </div>

      {ornament !== "none" && (
        <div aria-hidden="true" className="absolute top-6 left-1/2 -translate-x-1/2">
          <Reveal variant="pop" className="flex flex-col items-center">
            {ornament === "cross" && <GoldCross className="h-12 w-8" />}
            <SatinBow className={`bow-flutter ${ornament === "cross" ? "-mt-6" : ""} w-28`} />
          </Reveal>
        </div>
      )}

      <div className="relative">{children}</div>
    </section>
  );
}

/** "The" in script over a display-serif word, as in the reference cards. */
export function PanelTitle({
  id,
  lead,
  main,
  trail,
  size = "lg",
}: {
  id?: string;
  lead?: string;
  main: string;
  trail?: string;
  size?: "lg" | "xl";
}) {
  return (
    <Reveal variant="title" className="text-center">
      <h2 id={id} className="relative">
        {lead && <span className="relative z-10 block font-script text-5xl leading-none text-cocoa">{lead}</span>}
        <span
          className={`title-track block font-display font-medium whitespace-nowrap tracking-[0.06em] text-rose-600 uppercase ${
            size === "xl" ? "text-[3.1rem] leading-none sm:text-6xl" : "text-[2.6rem] leading-tight sm:text-5xl"
          } ${lead ? "-mt-3" : ""}`}
        >
          {main}
        </span>
        {trail && <span className="-mt-2 block font-script text-4xl leading-tight text-cocoa">{trail}</span>}
      </h2>
      <HeartRule className="mt-3" />
    </Reveal>
  );
}

/** Small cross between two sage sprigs, used above hero lines. */
export function CrossWithSprigs({ className = "" }: { className?: string }) {
  return (
    <div className={`fx fx-cross flex items-end justify-center gap-1 ${className}`} aria-hidden="true">
      <LeafSprig className="w-16" flip />
      <GoldCross className="h-10 w-7" />
      <LeafSprig className="w-16" />
    </div>
  );
}

/**
 * Card with concave corners and a double border (pink outer, gold inner),
 * built from stacked masked layers so the borders follow the notches.
 */
export function NotchedFrame({
  children,
  className = "",
  bow = false,
  bowColor = "pink",
}: {
  children: ReactNode;
  className?: string;
  bow?: boolean;
  bowColor?: "pink" | "yellow";
}) {
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden="true" className="notched absolute inset-0 bg-blush-300 shadow-lg" />
      <div aria-hidden="true" className="notched paper absolute inset-[2px]" />
      <div aria-hidden="true" className="notched absolute inset-[8px] bg-gold-300" style={{ "--r": "21px" } as React.CSSProperties} />
      <div aria-hidden="true" className="notched paper absolute inset-[9px]" style={{ "--r": "21px" } as React.CSSProperties} />
      {bow && (
        <div className="absolute -top-9 left-1/2 z-10 w-24 -translate-x-1/2">
          <Reveal variant="pop">
            <SatinBow color={bowColor} className="bow-flutter w-full" />
          </Reveal>
        </div>
      )}
      <div className="relative px-6 py-9 sm:px-8">{children}</div>
    </div>
  );
}

/** Rounded label like "♡ For Godparents". */
export function PillLabel({ children, tone = "pink" }: { children: ReactNode; tone?: "pink" | "yellow" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-sans text-xs font-semibold tracking-[0.12em] uppercase ${
        tone === "pink" ? "bg-blush-100 text-rose-600" : "bg-butter-100 text-gold-700"
      }`}
    >
      <TinyHeart className="h-3 w-3" />
      {children}
    </span>
  );
}

/** Script heading inside a frame, e.g. "Ceremony". */
export function ScriptLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-center font-script text-4xl leading-tight text-cocoa">
      {children}
    </p>
  );
}
