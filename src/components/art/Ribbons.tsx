/**
 * Ribbons, crosses and florals — hand-drawn SVG ornaments in the
 * yellow & baby-pink palette. All decorative (aria-hidden).
 */

type Cls = { className?: string };

const RIBBON = {
  pink: { light: "#fde3ec", mid: "#f6b3c8", dark: "#e08aa7", deep: "#c96b8b" },
  yellow: { light: "#fff4cc", mid: "#f8da7a", dark: "#e9bd4c", deep: "#c99a2e" },
} as const;

/**
 * Ribbon bow. `finish="satin"` has a glossy sheen; `finish="grosgrain"` has the
 * fine ribbed texture of the reference envelope's bow.
 */
export function SatinBow({
  className = "",
  color = "pink",
  finish = "satin",
}: Cls & { color?: keyof typeof RIBBON; finish?: "satin" | "grosgrain" }) {
  const c = RIBBON[color];
  const id = `bow-${color}`;
  const ribbed = finish === "grosgrain";
  return (
    <svg viewBox="0 0 200 124" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-loop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.45" stopColor={c.mid} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${id}-tail`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.mid} />
          <stop offset="0.5" stopColor={c.light} />
          <stop offset="1" stopColor={c.dark} />
        </linearGradient>
        <radialGradient id={`${id}-knot`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={c.light} />
          <stop offset="1" stopColor={c.dark} />
        </radialGradient>
        {/* Fine ribs running across the ribbon */}
        <pattern id={`${id}-ribs`} width="2.6" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <rect width="2.6" height="10" fill="transparent" />
          <rect width="1" height="10" fill="#fff" opacity="0.28" />
        </pattern>
      </defs>
      {/* tails */}
      <path d="M94 64C86 84 72 102 52 120L70 118L77 109L85 121C94 102 101 84 104 66Z" fill={`url(#${id}-tail)`} stroke={c.deep} strokeWidth="0.8" />
      <path d="M106 64C114 84 128 102 148 120L130 118L123 109L115 121C106 102 99 84 96 66Z" fill={`url(#${id}-tail)`} stroke={c.deep} strokeWidth="0.8" />
      {/* loops */}
      <path d="M100 56C72 14 18 8 12 40C8 66 60 74 100 62Z" fill={`url(#${id}-loop)`} stroke={c.deep} strokeWidth="0.8" />
      <path d="M100 56C128 14 182 8 188 40C192 66 140 74 100 62Z" fill={`url(#${id}-loop)`} stroke={c.deep} strokeWidth="0.8" />
      {/* inner folds */}
      <path d="M100 58C82 40 46 34 34 46C56 50 80 56 100 61Z" fill={c.deep} opacity="0.3" />
      <path d="M100 58C118 40 154 34 166 46C144 50 120 56 100 61Z" fill={c.deep} opacity="0.3" />
      {/* sheen */}
      <path d="M24 34C40 20 66 24 86 44" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity={ribbed ? 0.2 : 0.55} />
      <path d="M176 34C160 20 134 24 114 44" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity={ribbed ? 0.2 : 0.55} />
      {ribbed && (
        <g fill={`url(#${id}-ribs)`}>
          <path d="M94 64C86 84 72 102 52 120L70 118L77 109L85 121C94 102 101 84 104 66Z" />
          <path d="M106 64C114 84 128 102 148 120L130 118L123 109L115 121C106 102 99 84 96 66Z" />
          <path d="M100 56C72 14 18 8 12 40C8 66 60 74 100 62Z" />
          <path d="M100 56C128 14 182 8 188 40C192 66 140 74 100 62Z" />
        </g>
      )}
      {/* knot */}
      <rect x="87" y="46" width="26" height="22" rx="9" fill={`url(#${id}-knot)`} stroke={c.deep} strokeWidth="0.8" />
      <path d="M93 52c4-2 10-2 14 0" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

/** Gilded cross. */
export function GoldCross({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 40 62" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cross-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dca2" />
          <stop offset="0.5" stopColor="#d4a957" />
          <stop offset="1" stopColor="#a87a2c" />
        </linearGradient>
      </defs>
      <rect x="16.5" y="1" width="7" height="60" rx="1.6" fill="url(#cross-gold)" />
      <rect x="4" y="15" width="32" height="7" rx="1.6" fill="url(#cross-gold)" />
      <path d="M18 3v56M6 16.5h28" stroke="#fff6dc" strokeWidth="0.9" opacity="0.7" />
    </svg>
  );
}

/** Sage leaf sprig; flip to mirror. */
export function LeafSprig({ className = "", flip = false }: Cls & { flip?: boolean }) {
  const leaves = [
    [14, 27, -30], [26, 21, 25], [38, 21, -35], [50, 15, 20], [62, 17, -35], [74, 11, 15], [86, 15, -30],
  ];
  return (
    <svg viewBox="0 0 100 40" className={className} aria-hidden="true">
      <g transform={flip ? "translate(100 0) scale(-1 1)" : undefined}>
        <path d="M2 32Q48 16 98 12" stroke="#9fb08f" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        {leaves.map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="7.5" ry="3.6" transform={`rotate(${r} ${x} ${y})`} fill={i % 2 ? "#b8c6a8" : "#a8b998"} opacity="0.9" />
        ))}
      </g>
    </svg>
  );
}

// Deterministic branch tips for baby's breath; each tip carries a small cluster of blossoms.
const TIPS: [number, number][] = [
  [26, 34], [44, 20], [62, 28], [82, 16], [98, 34], [36, 54], [56, 48], [78, 46], [16, 60], [94, 62], [66, 66], [44, 72],
];
const CLUSTER: [number, number, number][] = [
  [0, 0, 4.4], [-7, 4, 3.6], [7, 3, 3.8], [-2, -7, 3.4], [5, -6, 3],
];

function Blossom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={(Math.cos((a * Math.PI) / 180) * r * 0.5).toFixed(2)}
          cy={(Math.sin((a * Math.PI) / 180) * r * 0.5).toFixed(2)}
          r={(r * 0.52).toFixed(2)}
          fill="#fffefa"
          stroke="#e3dccd"
          strokeWidth="0.35"
        />
      ))}
      <circle r={(r * 0.26).toFixed(2)} fill="#f1d891" />
    </g>
  );
}

/** Cluster of baby's breath (gypsophila). */
export function BabysBreath({ className = "", flip = false }: Cls & { flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
      <g stroke="#a9b897" strokeWidth="0.9" fill="none" strokeLinecap="round">
        {TIPS.map(([x, y], i) => (
          <path key={i} d={`M60 138Q${((x + 60) / 2).toFixed(1)} ${((y + 138) / 2 + 12).toFixed(1)} ${x} ${y}`} />
        ))}
        {TIPS.map(([x, y], i) =>
          CLUSTER.slice(1).map(([dx, dy], j) => <path key={`${i}-${j}`} d={`M${x} ${y + 3}L${x + dx} ${y + dy}`} strokeWidth="0.6" />),
        )}
      </g>
      <ellipse cx="50" cy="112" rx="8" ry="2.8" transform="rotate(-35 50 112)" fill="#b8c6a8" />
      <ellipse cx="72" cy="116" rx="8" ry="2.8" transform="rotate(30 72 116)" fill="#a8b998" />
      <ellipse cx="44" cy="96" rx="6" ry="2.2" transform="rotate(-50 44 96)" fill="#a8b998" />
      {TIPS.map(([x, y], i) =>
        CLUSTER.map(([dx, dy, r], j) => <Blossom key={`${i}-${j}`} x={x + dx} y={y + dy} r={r} />),
      )}
      </g>
    </svg>
  );
}

/** Small heart used between script lines. */
export function TinyHeart({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 21S1 14.4 1 7.2A5.6 5.6 0 0 1 12 4.6 5.6 5.6 0 0 1 23 7.2C23 14.4 12 21 12 21z" />
    </svg>
  );
}

/** Thin gold rule with a heart in the middle. */
export function HeartRule({ className = "" }: Cls) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold-400 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold-400" />
      <TinyHeart className="h-3 w-3 text-rose-400" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold-400" />
    </div>
  );
}
