/**
 * Nursery props — plush teddy, alphabet blocks, balloons, gift box, Bible and
 * candle — hand-drawn SVG in the yellow & baby-pink palette. All decorative.
 */

type Cls = { className?: string };

const FUR = { light: "#efd3ad", mid: "#d9b083", dark: "#bb8e62", muzzle: "#f8e9d4", ink: "#4e362c", cheek: "#f5a8bf" };

function GinghamDefs({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#fffdf8" />
      <rect width="8" height="4" fill={color} opacity="0.45" />
      <rect width="4" height="8" fill={color} opacity="0.45" />
    </pattern>
  );
}

/** Plush teddy bear sitting, wearing a gingham bow tie. */
export function SittingTeddy({ className = "", tie = "pink" }: Cls & { tie?: "pink" | "yellow" }) {
  const tieColor = tie === "pink" ? "#f29bb8" : "#f1c34c";
  const gid = `teddy-ging-${tie}`;
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="teddy-fur" cx="0.45" cy="0.35" r="0.75">
          <stop offset="0" stopColor={FUR.light} />
          <stop offset="0.7" stopColor={FUR.mid} />
          <stop offset="1" stopColor={FUR.dark} />
        </radialGradient>
        <GinghamDefs id={gid} color={tieColor} />
      </defs>
      {/* legs */}
      <ellipse cx="62" cy="192" rx="30" ry="22" fill="url(#teddy-fur)" />
      <ellipse cx="138" cy="192" rx="30" ry="22" fill="url(#teddy-fur)" />
      <ellipse cx="54" cy="198" rx="15" ry="13" fill={FUR.muzzle} />
      <ellipse cx="146" cy="198" rx="15" ry="13" fill={FUR.muzzle} />
      {/* body */}
      <ellipse cx="100" cy="158" rx="54" ry="50" fill="url(#teddy-fur)" />
      <ellipse cx="100" cy="166" rx="32" ry="30" fill={FUR.muzzle} opacity="0.85" />
      {/* arms */}
      <ellipse cx="50" cy="150" rx="17" ry="30" transform="rotate(22 50 150)" fill="url(#teddy-fur)" />
      <ellipse cx="150" cy="150" rx="17" ry="30" transform="rotate(-22 150 150)" fill="url(#teddy-fur)" />
      {/* ears */}
      <circle cx="56" cy="40" r="22" fill="url(#teddy-fur)" />
      <circle cx="144" cy="40" r="22" fill="url(#teddy-fur)" />
      <circle cx="56" cy="40" r="12" fill={FUR.muzzle} />
      <circle cx="144" cy="40" r="12" fill={FUR.muzzle} />
      {/* head */}
      <ellipse cx="100" cy="78" rx="56" ry="50" fill="url(#teddy-fur)" />
      <ellipse cx="100" cy="96" rx="24" ry="18" fill={FUR.muzzle} />
      <ellipse cx="100" cy="88" rx="8" ry="6" fill={FUR.ink} />
      <path d="M100 94v6M92 101c4 4 12 4 16 0" stroke={FUR.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="74" r="5.5" fill={FUR.ink} />
      <circle cx="122" cy="74" r="5.5" fill={FUR.ink} />
      <circle cx="80" cy="72" r="1.8" fill="#fff" />
      <circle cx="124" cy="72" r="1.8" fill="#fff" />
      <ellipse cx="66" cy="94" rx="9" ry="5.5" fill={FUR.cheek} opacity="0.7" />
      <ellipse cx="134" cy="94" rx="9" ry="5.5" fill={FUR.cheek} opacity="0.7" />
      {/* gingham bow tie */}
      <g stroke="#c98b6a" strokeWidth="0.8">
        <path d="M100 124L70 110L72 140Z" fill={`url(#${gid})`} />
        <path d="M100 124L130 110L128 140Z" fill={`url(#${gid})`} />
        <rect x="92" y="117" width="16" height="15" rx="5" fill={`url(#${gid})`} />
      </g>
    </svg>
  );
}

const BLOCK_COLORS = [
  { face: "#fbd3df", top: "#fde6ee", side: "#efb3c6", text: "#b04d6c" },
  { face: "#fbe7a6", top: "#fff3cc", side: "#efd07a", text: "#86601a" },
  { face: "#fffaf0", top: "#ffffff", side: "#eadfcb", text: "#b04d6c" },
];

/** Stack-free row of wooden alphabet blocks spelling `letters`. */
export function AlphabetBlocks({ className = "", letters = "ZANE" }: Cls & { letters?: string }) {
  const chars = letters.split("");
  const w = chars.length * 52 + 12;
  return (
    <svg viewBox={`0 0 ${w} 70`} className={className} aria-hidden="true">
      {chars.map((ch, i) => {
        const c = BLOCK_COLORS[i % BLOCK_COLORS.length];
        const x = 4 + i * 52;
        const y = i % 2 ? 22 : 18;
        return (
          <g key={i}>
            <path d={`M${x} ${y}l8-8h40l-8 8z`} fill={c.top} stroke="#d8c3a5" strokeWidth="0.8" />
            <path d={`M${x + 40} ${y}l8-8v40l-8 8z`} fill={c.side} stroke="#d8c3a5" strokeWidth="0.8" />
            <rect x={x} y={y} width="40" height="40" rx="3" fill={c.face} stroke="#d8c3a5" strokeWidth="0.8" />
            <rect x={x + 4} y={y + 4} width="32" height="32" rx="2" fill="none" stroke={c.text} strokeWidth="0.8" opacity="0.35" />
            <text x={x + 20} y={y + 30} textAnchor="middle" fontSize="26" fontWeight="600" fill={c.text} className="font-serif">
              {ch}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const BALLOON_FILL = {
  pink: ["#fde3ec", "#f6b3c8", "#e48fab"],
  yellow: ["#fff6d4", "#f8da7a", "#e5b84a"],
  white: ["#ffffff", "#f6f1ea", "#ddd3c4"],
} as const;

/** Bunch of glossy balloons in pink, yellow and white. */
export function BalloonCluster({ className = "", flip = false }: Cls & { flip?: boolean }) {
  const balloons: [number, number, number, keyof typeof BALLOON_FILL][] = [
    [60, 70, 34, "white"], [112, 58, 36, "pink"], [42, 128, 30, "yellow"], [96, 120, 38, "white"],
    [140, 112, 28, "yellow"], [70, 178, 32, "pink"], [124, 172, 30, "white"], [30, 196, 24, "pink"],
  ];
  return (
    <svg viewBox="0 0 170 230" className={className} aria-hidden="true">
      <defs>
        {(Object.keys(BALLOON_FILL) as (keyof typeof BALLOON_FILL)[]).map((k) => (
          <radialGradient key={k} id={`balloon-${k}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor={BALLOON_FILL[k][0]} />
            <stop offset="0.6" stopColor={BALLOON_FILL[k][1]} />
            <stop offset="1" stopColor={BALLOON_FILL[k][2]} />
          </radialGradient>
        ))}
      </defs>
      <g transform={flip ? "translate(170 0) scale(-1 1)" : undefined}>
      {balloons.map(([cx, cy, r, k], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={`url(#balloon-${k})`} />
          <ellipse cx={cx - r * 0.35} cy={cy - r * 0.4} rx={r * 0.18} ry={r * 0.28} transform={`rotate(-25 ${cx - r * 0.35} ${cy - r * 0.4})`} fill="#fff" opacity="0.6" />
        </g>
      ))}
      </g>
    </svg>
  );
}

/** Gingham gift box with a satin bow. */
export function GiftBox({ className = "", color = "pink" }: Cls & { color?: "pink" | "yellow" }) {
  const main = color === "pink" ? "#f29bb8" : "#f1c34c";
  const ribbon = color === "pink" ? "#f8da7a" : "#f6b3c8";
  const gid = `gift-ging-${color}`;
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true">
      <defs>
        <GinghamDefs id={gid} color={main} />
      </defs>
      <rect x="14" y="44" width="92" height="64" rx="3" fill={`url(#${gid})`} stroke="#d8c3a5" />
      <rect x="8" y="32" width="104" height="16" rx="3" fill={`url(#${gid})`} stroke="#d8c3a5" />
      <rect x="53" y="32" width="14" height="76" fill={ribbon} />
      <path d="M60 32C48 14 30 14 32 26C34 34 50 34 60 32ZM60 32C72 14 90 14 88 26C86 34 70 34 60 32Z" fill={ribbon} stroke="#d9a46a" strokeWidth="0.8" />
      <circle cx="60" cy="31" r="5" fill={ribbon} stroke="#d9a46a" strokeWidth="0.8" />
    </svg>
  );
}

/** Holy Bible with a ribbon and a small cross. */
export function BibleBook({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 170 66" className={className} aria-hidden="true">
      <rect x="6" y="34" width="156" height="24" rx="3" fill="#fbd3df" stroke="#d9a6b6" />
      <rect x="10" y="10" width="150" height="26" rx="3" fill="#fffaf0" stroke="#d8c3a5" />
      <path d="M10 36h150" stroke="#e8dcc6" strokeWidth="3" />
      <text x="88" y="28" textAnchor="middle" fontSize="11" letterSpacing="2" fill="#86601a" className="font-serif" fontWeight="600">
        HOLY BIBLE
      </text>
      <path d="M26 14v18M21 19h10" stroke="#d4a957" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M140 10v40l5-5 5 5V10" fill="#f6b3c8" stroke="#e08aa7" strokeWidth="0.6" />
      <text x="84" y="51" textAnchor="middle" fontSize="8" letterSpacing="2.5" fill="#b04d6c" className="font-serif">
        FAITH · FAMILY · BLESSINGS
      </text>
    </svg>
  );
}

/** Pillar candle with a gentle flame. */
export function Candle({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 60 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="candle-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f3e9d8" />
          <stop offset="0.5" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#eadcc5" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="22" r="22" fill="url(#candle-glow)" />
      <path d="M30 8C24 18 26 28 30 30C34 28 36 18 30 8Z" fill="#f8d36a" />
      <path d="M30 16C28 22 28 27 30 28C32 27 32 22 30 16Z" fill="#fff7dc" />
      <path d="M30 30v6" stroke="#5a3f36" strokeWidth="1.4" />
      <rect x="12" y="36" width="36" height="88" rx="4" fill="url(#candle-wax)" stroke="#e1d3bb" />
      <path d="M30 60v26M22 68h16" stroke="#d4a957" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="12" y="96" width="36" height="7" fill="#f6b3c8" opacity="0.8" />
    </svg>
  );
}
