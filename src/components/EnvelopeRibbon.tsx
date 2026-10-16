import type { Ref } from "react";

import { BearFace } from "@/components/Decor";

/**
 * The grosgrain ribbon, bow and gift tag tied around the envelope, drawn in the
 * envelope's own 400×500 coordinate space.
 *
 * Opening is choreographed with SVG (SMIL) animations so the fabric changes
 * shape instead of sliding as a flat sheet: the right tail is tugged, the loops
 * pull through and vanish, the knot dissolves, the band goes slack and ripples
 * into an S-curve, and the whole ribbon drifts down and away with the tag
 * swinging on its twine. Everything waits for `#ribbonGo`, started from the
 * envelope's tap handler via `beginElement()`.
 */

// Shapes for each part of the ribbon. Every list keeps the same path commands so the browser can morph between them.
const BAND = [
  "M0 315 C120 315 280 315 400 315 L400 355 C280 355 120 355 0 355 Z", // tied, taut
  "M2 318 C120 326 280 326 398 318 L398 357 C280 366 120 366 2 357 Z", // slack, sagging
  "M-10 330 C90 298 250 402 410 340 L412 377 C250 438 90 336 -8 367 Z", // rippling
  "M14 352 C104 308 262 432 388 362 L390 391 C262 462 104 342 16 381 Z", // curling as it falls
];
const LOOP_L = [
  "M200 332 C166 284 80 262 68 298 C60 330 148 344 200 340 Z",
  "M200 333 C186 312 150 304 145 318 C141 330 176 338 200 338 Z",
  "M200 334 C198 331 194 330 193 332 C192 334 197 336 200 336 Z",
];
const LOOP_R = [
  "M200 332 C234 284 320 262 332 298 C340 330 252 344 200 340 Z",
  "M200 333 C214 312 250 304 255 318 C259 330 224 338 200 338 Z",
  "M200 334 C202 331 206 330 207 332 C208 334 203 336 200 336 Z",
];
const TAIL_L = [
  "M196 340 C186 372 166 398 136 424 L158 422 L165 410 L175 426 C190 402 200 374 204 342 Z",
  "M196 340 C186 372 166 398 136 424 L158 422 L165 410 L175 426 C190 402 200 374 204 342 Z",
  "M190 345 C170 390 196 430 150 478 L170 480 L176 468 L186 484 C214 436 194 392 206 348 Z",
];
const TAIL_R = [
  "M204 340 C214 372 234 398 264 424 L242 422 L235 410 L225 426 C210 402 200 374 196 342 Z",
  "M204 338 C232 372 270 400 318 432 L296 438 L290 426 L278 444 C240 414 208 380 196 342 Z", // tugged
  "M206 345 C250 390 300 420 330 470 L310 474 L306 462 L294 478 C270 430 230 396 194 348 Z",
];
const KNOT = [
  "M186 322 Q200 316 214 322 Q218 333 214 344 Q200 350 186 344 Q182 333 186 322 Z",
  "M196 330 Q200 329 204 330 Q205 333 204 336 Q200 337 196 336 Q195 333 196 330 Z",
];

const EASE = "0.45 0 0.55 1";

function Morph({
  shapes,
  begin,
  dur,
  keyTimes,
  fill,
  stroke,
}: {
  shapes: string[];
  begin: string;
  dur: string;
  keyTimes: string;
  fill: string;
  stroke?: string;
}) {
  const splines = Array(shapes.length - 1).fill(EASE).join("; ");
  return (
    <path d={shapes[0]} fill={fill} stroke={stroke} strokeWidth={stroke ? 1 : undefined} strokeLinejoin="round">
      <animate
        attributeName="d"
        values={shapes.join("; ")}
        keyTimes={keyTimes}
        calcMode="spline"
        keySplines={splines}
        begin={begin}
        dur={dur}
        fill="freeze"
      />
    </path>
  );
}

/** One ribbon part, drawn as shaded satin plus fine grosgrain ribs. */
function RibbonPart(props: { shapes: string[]; begin: string; dur: string; keyTimes: string; shade: string }) {
  return (
    <>
      <Morph {...props} fill={`url(#${props.shade})`} stroke="#d27896" />
      <Morph {...props} fill="url(#rb-ribs)" />
    </>
  );
}

function FadeOut({ begin, dur = "0.25s" }: { begin: string; dur?: string }) {
  return <animate attributeName="opacity" from="1" to="0" begin={begin} dur={dur} fill="freeze" />;
}

export function EnvelopeRibbon({ svgRef }: { svgRef?: Ref<SVGSVGElement> }) {
  return (
    <svg ref={svgRef} viewBox="0 0 400 500" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="rb-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbcbd9" />
          <stop offset="0.55" stopColor="#f3a8c0" />
          <stop offset="1" stopColor="#e590ac" />
        </linearGradient>
        <linearGradient id="rb-loop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde3ec" />
          <stop offset="0.45" stopColor="#f6b3c8" />
          <stop offset="1" stopColor="#e08aa7" />
        </linearGradient>
        <linearGradient id="rb-tail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6b3c8" />
          <stop offset="0.5" stopColor="#fbd3df" />
          <stop offset="1" stopColor="#e08aa7" />
        </linearGradient>
        <radialGradient id="rb-knot" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fde3ec" />
          <stop offset="1" stopColor="#e08aa7" />
        </radialGradient>
        <pattern id="rb-ribs" width="3" height="6" patternUnits="userSpaceOnUse">
          <rect width="1.2" height="6" fill="#fff" opacity="0.3" />
        </pattern>
        <linearGradient id="rb-tag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#f8ecd4" />
        </linearGradient>
        <filter id="rb-shadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#9a4b66" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Master clock: started by the envelope's tap handler. */}
      <animate id="ribbonGo" attributeName="visibility" from="visible" to="visible" dur="0.01s" begin="indefinite" />

      {/* Whole ribbon drifts down and away once it is untied. */}
      <g filter="url(#rb-shadow)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -6; 26 330"
          keyTimes="0; 0.15; 1"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.5 0 0.85 0.45"
          begin="ribbonGo.begin+1s"
          dur="1.5s"
          fill="freeze"
        />
        <animate attributeName="opacity" values="1; 1; 0" keyTimes="0; 0.7; 1" begin="ribbonGo.begin+1s" dur="1.5s" fill="freeze" />
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 200 340; 7 200 340"
            calcMode="spline"
            keySplines="0.5 0 0.8 0.5"
            begin="ribbonGo.begin+1s"
            dur="1.5s"
            fill="freeze"
          />

          {/* Band goes slack, then ripples */}
          <RibbonPart shapes={BAND} shade="rb-band" begin="ribbonGo.begin+0.75s" dur="1.75s" keyTimes="0; 0.22; 0.6; 1" />

          {/* Tails: the right one is tugged, then both flow loose */}
          <RibbonPart shapes={TAIL_L} shade="rb-tail" begin="ribbonGo.begin+0.35s" dur="1.3s" keyTimes="0; 0.45; 1" />
          <RibbonPart shapes={TAIL_R} shade="rb-tail" begin="ribbonGo.begin+0.35s" dur="1.3s" keyTimes="0; 0.4; 1" />

          {/* Loops pull through the knot — right first, then left */}
          <g>
            <RibbonPart shapes={LOOP_R} shade="rb-loop" begin="ribbonGo.begin+0.4s" dur="0.6s" keyTimes="0; 0.55; 1" />
            <FadeOut begin="ribbonGo.begin+0.95s" />
          </g>
          <g>
            <RibbonPart shapes={LOOP_L} shade="rb-loop" begin="ribbonGo.begin+0.55s" dur="0.6s" keyTimes="0; 0.55; 1" />
            <FadeOut begin="ribbonGo.begin+1.1s" />
          </g>

          {/* Knot dissolves */}
          <g>
            <Morph shapes={KNOT} fill="url(#rb-knot)" stroke="#d27896" begin="ribbonGo.begin+0.85s" dur="0.35s" keyTimes="0; 1" />
            <FadeOut begin="ribbonGo.begin+1.05s" dur="0.2s" />
          </g>

          {/* Gift tag on its twine */}
          <g transform="translate(158 362) scale(1.05)">
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 40 0; 16 40 0; -10 40 0; 6 40 0"
                keyTimes="0; 0.35; 0.7; 1"
                calcMode="spline"
                keySplines={`${EASE}; ${EASE}; ${EASE}`}
                begin="ribbonGo.begin+0.6s"
                dur="1.8s"
                fill="freeze"
                additive="sum"
              />
              <g>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-4 40 0; 4 40 0; -4 40 0"
                  dur="4s"
                  repeatCount="indefinite"
                  additive="sum"
                />
                <path d="M40 -18C35 -6 46 6 40 30" stroke="#b48a5e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <path d="M16 40L30 24H50L64 40V122Q64 128 58 128H22Q16 128 16 122Z" fill="url(#rb-tag)" stroke="#d9b874" strokeWidth="1.6" />
                <path d="M21 42L32 29H48L59 42V119Q59 123 55 123H25Q21 123 21 119Z" fill="none" stroke="#f2b6c8" strokeWidth="1" strokeDasharray="2.5 2" />
                <circle cx="40" cy="34" r="4" fill="#fde4ec" stroke="#d9b874" strokeWidth="1.6" />
                <path d="M40 30v4" stroke="#b48a5e" strokeWidth="1.6" strokeLinecap="round" />
                <BearFace bow x={20} y={54} width={40} height={37} />
                <path d="M40 112S31 106.5 31 100.6A4.6 4.6 0 0 1 40 98.4 4.6 4.6 0 0 1 49 100.6C49 106.5 40 112 40 112Z" fill="#f29bb8" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
