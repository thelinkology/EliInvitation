/**
 * Soft storybook illustrations: the two venues and the dress-code outfits.
 * They are illustrative, not exact likenesses of the real buildings.
 */

type Cls = { className?: string };

const LINE = "#8b6a55";

function SkyAndTrees({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde8ef" />
          <stop offset="0.6" stopColor="#fff6dc" />
          <stop offset="1" stopColor="#fffaf0" />
        </linearGradient>
      </defs>
      <rect width="320" height="190" fill={`url(#${id}-sky)`} />
      {/* soft clouds */}
      <g fill="#fff" opacity="0.9">
        <ellipse cx="60" cy="34" rx="30" ry="10" />
        <ellipse cx="80" cy="28" rx="18" ry="10" />
        <ellipse cx="250" cy="26" rx="28" ry="9" />
        <ellipse cx="268" cy="21" rx="16" ry="9" />
      </g>
      {/* trees */}
      <g>
        <circle cx="26" cy="128" r="26" fill="#c9d7b6" />
        <circle cx="46" cy="116" r="22" fill="#b7c8a2" />
        <circle cx="292" cy="124" r="26" fill="#c9d7b6" />
        <circle cx="274" cy="112" r="20" fill="#b7c8a2" />
        <rect x="34" y="140" width="4" height="22" fill="#a98468" />
        <rect x="284" y="140" width="4" height="22" fill="#a98468" />
      </g>
      {/* ground */}
      <path d="M0 160C80 150 240 150 320 160V190H0Z" fill="#e4ecd4" />
      <path d="M0 170C90 162 230 162 320 170V190H0Z" fill="#d6e2c2" />
    </>
  );
}

/** Church with bell tower, arched doors and rose window. */
export function ChurchScene({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 320 190" className={className} aria-hidden="true">
      <SkyAndTrees id="church" />
      <g stroke={LINE} strokeWidth="1.2" strokeLinejoin="round">
        {/* bell tower */}
        <rect x="88" y="54" width="40" height="110" fill="#fffaf0" />
        <path d="M84 56L108 28L132 56Z" fill="#f6c3d3" />
        <path d="M108 28V12M102 18h12" stroke="#c99a2e" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M100 70a8 8 0 0 1 16 0v14h-16Z" fill="#fde3ec" />
        <path d="M108 70v14" />
        <rect x="100" y="104" width="16" height="22" rx="8" fill="#fff3cc" />
        {/* nave */}
        <rect x="128" y="82" width="110" height="82" fill="#fffdf7" />
        <path d="M122 84L183 42L244 84Z" fill="#fbd3df" />
        <circle cx="183" cy="70" r="10" fill="#fff3cc" />
        <path d="M183 60v20M173 70h20" strokeWidth="0.8" />
        <path d="M166 164v-34a17 17 0 0 1 34 0v34Z" fill="#f8da7a" />
        <path d="M183 113v51" />
        <rect x="140" y="104" width="14" height="24" rx="7" fill="#fde3ec" />
        <rect x="212" y="104" width="14" height="24" rx="7" fill="#fde3ec" />
        {/* steps */}
        <path d="M156 164h54v5h-54zM150 169h66v5h-66z" fill="#f4ece0" />
      </g>
      <path d="M183 42V30M178 35h10" stroke="#c99a2e" strokeWidth="2" strokeLinecap="round" />
      {/* bunting */}
      <path d="M128 84Q156 96 183 86Q210 96 238 84" stroke="#c9a27e" fill="none" strokeWidth="0.8" />
      {[136, 150, 164, 176, 190, 202, 216, 230].map((x, i) => (
        <path key={x} d={`M${x - 4} ${88 + (i % 4)}l8 0l-4 7z`} fill={i % 2 ? "#f8da7a" : "#f6b3c8"} />
      ))}
    </svg>
  );
}

/** Clubhouse with a hipped roof, columns and garden. */
export function ClubhouseScene({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 320 190" className={className} aria-hidden="true">
      <SkyAndTrees id="club" />
      <g stroke={LINE} strokeWidth="1.2" strokeLinejoin="round">
        <rect x="70" y="92" width="180" height="72" fill="#fffdf7" />
        <path d="M58 94L100 58H220L262 94Z" fill="#f8da7a" />
        <path d="M100 58H220" stroke="#c99a2e" />
        {/* columns + porch */}
        <path d="M124 164V104M146 164V104M174 164V104M196 164V104" stroke="#d8c3a5" strokeWidth="3" />
        <rect x="120" y="98" width="80" height="8" fill="#fde3ec" />
        <rect x="150" y="124" width="20" height="40" rx="2" fill="#f6c3d3" />
        {/* windows */}
        <rect x="82" y="110" width="26" height="22" rx="2" fill="#fff3cc" />
        <rect x="212" y="110" width="26" height="22" rx="2" fill="#fff3cc" />
        <path d="M95 110v22M82 121h26M225 110v22M212 121h26" strokeWidth="0.8" />
        {/* sign */}
        <rect x="118" y="70" width="84" height="16" rx="3" fill="#fffaf0" />
      </g>
      <text x="160" y="81.5" textAnchor="middle" fontSize="7.5" letterSpacing="1.6" fill="#86601a" className="font-serif" fontWeight="600">
        CLUBHOUSE
      </text>
      {/* hedges + flowers */}
      <g>
        <ellipse cx="92" cy="164" rx="24" ry="9" fill="#b7c8a2" />
        <ellipse cx="228" cy="164" rx="24" ry="9" fill="#b7c8a2" />
        {[80, 92, 104, 216, 228, 240].map((x, i) => (
          <circle key={x} cx={x} cy={160} r="2.6" fill={i % 2 ? "#f8da7a" : "#f6b3c8"} />
        ))}
      </g>
      {/* balloons by the door */}
      <g>
        <path d="M144 126Q140 112 138 100M176 126Q180 112 182 100" stroke="#c9a27e" strokeWidth="0.8" fill="none" />
        <ellipse cx="138" cy="94" rx="7" ry="9" fill="#f6b3c8" />
        <ellipse cx="182" cy="94" rx="7" ry="9" fill="#f8da7a" />
      </g>
    </svg>
  );
}

/** Simple dress silhouette in a given color. */
export function DressFigure({ className = "", color }: Cls & { color: string }) {
  return (
    <svg viewBox="0 0 64 100" className={className} aria-hidden="true">
      <path d="M26 6h12l2 6h-16Z" fill="#e8dccb" stroke="#bfae95" strokeWidth="0.8" />
      <path d="M22 12h20l4 26H18Z" fill={color} stroke="#bfae95" strokeWidth="1" />
      <path d="M22 12C14 12 10 18 12 24L20 22ZM42 12C50 12 54 18 52 24L44 22Z" fill={color} stroke="#bfae95" strokeWidth="1" />
      <path d="M18 38h28l14 54C44 98 20 98 4 92Z" fill={color} stroke="#bfae95" strokeWidth="1" />
      <path d="M18 38h28" stroke="#e7c27a" strokeWidth="2.4" />
      <path d="M24 44L16 90M32 44v50M40 44l8 46" stroke="#bfae95" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}

/** Polo/barong shirt over trousers. */
export function ShirtFigure({ className = "", color, pants = "#e9dcc6" }: Cls & { color: string; pants?: string }) {
  return (
    <svg viewBox="0 0 64 104" className={className} aria-hidden="true">
      <path d="M20 4l12 6 12-6 14 8-6 14-6-3v29H18V23l-6 3-6-14Z" fill={color} stroke="#bfae95" strokeWidth="1" />
      <path d="M26 6l6 10 6-10" fill="none" stroke="#bfae95" strokeWidth="1" />
      <path d="M32 16v30" stroke="#bfae95" strokeWidth="0.7" />
      {[22, 30, 38].map((y) => (
        <circle key={y} cx="34.5" cy={y} r="1" fill="#bfae95" />
      ))}
      <path d="M18 52h28l2 50H36l-4-36-4 36H16Z" fill={pants} stroke="#bfae95" strokeWidth="1" />
    </svg>
  );
}
