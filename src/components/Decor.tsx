/** Purely decorative pieces for the teddy-bear theme. All are hidden from screen readers. */

type Cls = { className?: string };

const BEAR = { fur: "#d7ad85", furDark: "#b98a62", muzzle: "#f6e3cc", ink: "#5a3f36", cheek: "#f6a9bf" };

/** Gold divider with a tiny bear face in the middle. */
export function Flourish({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 240 28" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 15H86" strokeLinecap="round" opacity="0.55" />
      <path d="M86 15C92 8 99 8 104 15C99 22 92 22 86 15Z" />
      <path d="M154 15H236" strokeLinecap="round" opacity="0.55" />
      <path d="M154 15C148 8 141 8 136 15C141 22 148 22 154 15Z" />
      <g fill="currentColor" stroke="none">
        <circle cx="112" cy="7" r="4.2" />
        <circle cx="128" cy="7" r="4.2" />
        <circle cx="120" cy="15" r="9" />
      </g>
      <g fill="#fffaf0" stroke="none">
        <ellipse cx="120" cy="18" rx="3.6" ry="2.7" />
        <circle cx="116.6" cy="13.2" r="1" />
        <circle cx="123.4" cy="13.2" r="1" />
      </g>
    </svg>
  );
}

export function StarGlyph({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 0L13.9 10.1L24 12L13.9 13.9L12 24L10.1 13.9L0 12L10.1 10.1Z" />
    </svg>
  );
}

export function HeartGlyph({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 21.5S2 15.3 2 8.4A5.4 5.4 0 0 1 12 5.6a5.4 5.4 0 0 1 10 2.8c0 6.9-10 13.1-10 13.1z" />
    </svg>
  );
}

/** Cute teddy-bear face, optionally wearing a pink bow. */
export function BearFace({
  className = "",
  bow = false,
  ...placement
}: Cls & { bow?: boolean; x?: number; y?: number; width?: number; height?: number }) {
  return (
    <svg viewBox="0 0 120 112" className={className} aria-hidden="true" {...placement}>
      <circle cx="26" cy="30" r="19" fill={BEAR.fur} />
      <circle cx="94" cy="30" r="19" fill={BEAR.fur} />
      <circle cx="26" cy="30" r="10" fill={BEAR.muzzle} />
      <circle cx="94" cy="30" r="10" fill={BEAR.muzzle} />
      <ellipse cx="60" cy="64" rx="46" ry="42" fill={BEAR.fur} />
      <ellipse cx="60" cy="80" rx="19" ry="14" fill={BEAR.muzzle} />
      <ellipse cx="60" cy="73" rx="6.5" ry="4.8" fill={BEAR.ink} />
      <path d="M60 77.5v4.5M53.5 83c3.5 4 9.5 4 13 0" stroke={BEAR.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="60" r="4.6" fill={BEAR.ink} />
      <circle cx="78" cy="60" r="4.6" fill={BEAR.ink} />
      <circle cx="43.6" cy="58.4" r="1.5" fill="#fff" />
      <circle cx="79.6" cy="58.4" r="1.5" fill="#fff" />
      <ellipse cx="32" cy="76" rx="8" ry="5" fill={BEAR.cheek} opacity="0.75" />
      <ellipse cx="88" cy="76" rx="8" ry="5" fill={BEAR.cheek} opacity="0.75" />
      {bow && <Bowtie x={90} y={18} scale={0.55} />}
    </svg>
  );
}

function Bowtie({ x, y, scale = 1, color = "#f29bb8", dark = "#d8708f" }: { x: number; y: number; scale?: number; color?: string; dark?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0C-14-16-36-12-34 2C-32 16-14 14 0 0Z" fill={color} stroke={dark} strokeWidth="2" />
      <path d="M0 0C14-16 36-12 34 2C32 16 14 14 0 0Z" fill={color} stroke={dark} strokeWidth="2" />
      <path d="M-3 3L-12 24M3 3L12 24" stroke={dark} strokeWidth="5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="6.5" fill={dark} />
    </g>
  );
}

/** Ribbon bow for the top of the photo arch. */
export function Bow({ className = "" }: Cls) {
  return (
    <svg viewBox="-44 -22 88 52" className={className} aria-hidden="true">
      <Bowtie x={0} y={0} scale={1.15} />
    </svg>
  );
}

/** Bear peeking over the top edge of a card, paws on the edge. */
export function BearPeek({ className = "" }: Cls) {
  return (
    <svg viewBox="0 0 140 92" className={className} aria-hidden="true">
      <circle cx="34" cy="24" r="16" fill={BEAR.fur} />
      <circle cx="106" cy="24" r="16" fill={BEAR.fur} />
      <circle cx="34" cy="24" r="8.5" fill={BEAR.muzzle} />
      <circle cx="106" cy="24" r="8.5" fill={BEAR.muzzle} />
      <path d="M28 92C26 52 42 22 70 22S114 52 112 92Z" fill={BEAR.fur} />
      <ellipse cx="70" cy="66" rx="16" ry="11.5" fill={BEAR.muzzle} />
      <ellipse cx="70" cy="60" rx="5.6" ry="4.2" fill={BEAR.ink} />
      <path d="M64.5 69c3 3 8 3 11 0" stroke={BEAR.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 49q5-5 10 0M80 49q5-5 10 0" stroke={BEAR.ink} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="45" cy="63" rx="7" ry="4.4" fill={BEAR.cheek} opacity="0.75" />
      <ellipse cx="95" cy="63" rx="7" ry="4.4" fill={BEAR.cheek} opacity="0.75" />
      <ellipse cx="24" cy="86" rx="15" ry="9" fill={BEAR.furDark} />
      <ellipse cx="116" cy="86" rx="15" ry="9" fill={BEAR.furDark} />
      <path d="M17 84v4M24 83v5M31 84v4M109 84v4M116 83v5M123 84v4" stroke={BEAR.ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** Single shiny balloon on a curly string. */
export function Balloon({ className = "", color = "pink" }: Cls & { color?: "pink" | "yellow" }) {
  const fill = color === "pink" ? "#f6b9cb" : "#f8d76f";
  const shade = color === "pink" ? "#e892ad" : "#ecbd45";
  return (
    <svg viewBox="0 0 60 150" className={className} aria-hidden="true">
      <path d="M30 80c-4 10 6 16 0 26s6 16 0 26 4 12 0 18" stroke="#c9a27e" strokeWidth="1.4" fill="none" />
      <ellipse cx="30" cy="40" rx="26" ry="32" fill={fill} />
      <path d="M30 72c12-4 24-18 25-34-4 18-14 28-25 34z" fill={shade} opacity="0.6" />
      <ellipse cx="20" cy="26" rx="6" ry="10" fill="#fff" opacity="0.55" transform="rotate(-20 20 26)" />
      <path d="M26 72h8l-2 6h-4z" fill={shade} />
    </svg>
  );
}

/** Sitting teddy bear holding a bunch of balloons. */
export function BalloonBear({ className = "", flip = false }: Cls & { flip?: boolean }) {
  return (
    <svg viewBox="0 0 170 250" className={className} aria-hidden="true">
      <g transform={flip ? "translate(170 0) scale(-1 1)" : undefined}>
        {/* strings */}
        <path d="M126 168C118 130 82 100 70 64M126 168C126 128 122 96 120 54M126 168C134 132 150 110 152 84" stroke="#c9a27e" strokeWidth="1.4" fill="none" />
        {/* balloons */}
        <ellipse cx="70" cy="40" rx="24" ry="30" fill="#f6b9cb" />
        <ellipse cx="62" cy="28" rx="5" ry="9" fill="#fff" opacity="0.55" transform="rotate(-20 62 28)" />
        <ellipse cx="120" cy="30" rx="24" ry="30" fill="#f8d76f" />
        <ellipse cx="112" cy="18" rx="5" ry="9" fill="#fff" opacity="0.55" transform="rotate(-20 112 18)" />
        <ellipse cx="150" cy="64" rx="18" ry="22" fill="#fbd3df" />
        <ellipse cx="144" cy="56" rx="4" ry="7" fill="#fff" opacity="0.55" transform="rotate(-20 144 56)" />
        {/* body */}
        <ellipse cx="82" cy="212" rx="40" ry="34" fill={BEAR.fur} />
        <ellipse cx="82" cy="218" rx="24" ry="20" fill={BEAR.muzzle} />
        <ellipse cx="50" cy="238" rx="16" ry="11" fill={BEAR.furDark} />
        <ellipse cx="114" cy="238" rx="16" ry="11" fill={BEAR.furDark} />
        <ellipse cx="50" cy="239" rx="8" ry="6" fill={BEAR.muzzle} />
        <ellipse cx="114" cy="239" rx="8" ry="6" fill={BEAR.muzzle} />
        {/* arm raised to the strings */}
        <ellipse cx="118" cy="182" rx="11" ry="19" fill={BEAR.furDark} transform="rotate(-35 118 182)" />
        <ellipse cx="46" cy="200" rx="10" ry="17" fill={BEAR.furDark} transform="rotate(25 46 200)" />
        {/* head */}
        <circle cx="56" cy="128" r="14" fill={BEAR.fur} />
        <circle cx="108" cy="128" r="14" fill={BEAR.fur} />
        <circle cx="56" cy="128" r="7.5" fill={BEAR.muzzle} />
        <circle cx="108" cy="128" r="7.5" fill={BEAR.muzzle} />
        <ellipse cx="82" cy="154" rx="34" ry="31" fill={BEAR.fur} />
        <ellipse cx="82" cy="166" rx="14" ry="10.5" fill={BEAR.muzzle} />
        <ellipse cx="82" cy="161" rx="5" ry="3.8" fill={BEAR.ink} />
        <path d="M77 169c3 2.6 7 2.6 10 0" stroke={BEAR.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="69" cy="149" r="3.6" fill={BEAR.ink} />
        <circle cx="95" cy="149" r="3.6" fill={BEAR.ink} />
        <circle cx="70.2" cy="147.8" r="1.1" fill="#fff" />
        <circle cx="96.2" cy="147.8" r="1.1" fill="#fff" />
        <ellipse cx="60" cy="162" rx="6" ry="3.8" fill={BEAR.cheek} opacity="0.75" />
        <ellipse cx="104" cy="162" rx="6" ry="3.8" fill={BEAR.cheek} opacity="0.75" />
        <Bowtie x={82} y={186} scale={0.42} />
      </g>
    </svg>
  );
}

/** Pennant garland in alternating pink and yellow, draped across the top. */
export function Bunting({ className = "", flags = 13 }: Cls & { flags?: number }) {
  const W = 1000;
  const sag = 46;
  const y = (x: number) => 8 + sag * 4 * (x / W) * (1 - x / W);
  const step = W / flags;
  const colors = ["#f6b9cb", "#f8d76f", "#fffefa"];
  return (
    <svg viewBox={`0 0 ${W} 120`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={`M0 8Q${W / 2} ${8 + sag * 2} ${W} 8`} stroke="#c9a27e" strokeWidth="2" fill="none" />
      {Array.from({ length: flags }, (_, i) => {
        const x1 = i * step + step * 0.12;
        const x2 = x1 + step * 0.76;
        const mid = (x1 + x2) / 2;
        const top1 = y(x1);
        const top2 = y(x2);
        const tip = (top1 + top2) / 2 + 52;
        return (
          <g key={i}>
            <path d={`M${x1} ${top1}L${x2} ${top2}L${mid} ${tip}Z`} fill={colors[i % colors.length]} stroke="#e0b85c" strokeWidth="1.2" />
            {i % 3 === 2 && <path d={`M${mid} ${(top1 + top2) / 2 + 16}l3.5 7 7.5.6-5.7 4.9 1.8 7.4-7.1-4-7.1 4 1.8-7.4-5.7-4.9 7.5-.6z`} fill="#e0b85c" />}
          </g>
        );
      })}
    </svg>
  );
}

// Fixed positions so server and client render identically.
const SPARKLES = [
  { top: "8%", left: "6%", size: 10, delay: "0s", kind: "star" },
  { top: "14%", left: "88%", size: 14, delay: "1.1s", kind: "heart" },
  { top: "26%", left: "18%", size: 7, delay: "2.2s", kind: "star" },
  { top: "34%", left: "76%", size: 9, delay: "0.6s", kind: "star" },
  { top: "48%", left: "4%", size: 12, delay: "1.7s", kind: "heart" },
  { top: "58%", left: "93%", size: 8, delay: "2.6s", kind: "star" },
  { top: "70%", left: "12%", size: 9, delay: "0.3s", kind: "star" },
  { top: "78%", left: "82%", size: 12, delay: "1.4s", kind: "heart" },
  { top: "6%", left: "52%", size: 8, delay: "2.9s", kind: "star" },
  { top: "88%", left: "40%", size: 7, delay: "0.9s", kind: "star" },
  { top: "20%", left: "64%", size: 6, delay: "2s", kind: "heart" },
  { top: "64%", left: "56%", size: 6, delay: "3.1s", kind: "star" },
] as const;

export function Sparkles({ className = "" }: Cls) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className={`absolute animate-twinkle ${s.kind === "heart" ? "text-rose-400" : "text-gold-400"}`}
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        >
          {s.kind === "heart" ? <HeartGlyph className="h-full w-full" /> : <StarGlyph className="h-full w-full" />}
        </span>
      ))}
    </div>
  );
}

/** Soft cloud bank for the bottom edge of a section. */
export function Clouds({ className = "" }: Cls) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 ${className}`} aria-hidden="true">
      <div className="absolute -bottom-10 left-[-5%] h-28 w-[40%] rounded-full bg-white/90 blur-2xl" />
      <div className="absolute -bottom-12 left-[25%] h-32 w-[45%] rounded-full bg-white/95 blur-2xl" />
      <div className="absolute -bottom-10 right-[-5%] h-28 w-[40%] rounded-full bg-white/90 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-cream" />
    </div>
  );
}

// Fixed spots, sizes and timings so server and client render identically.
const FLOATERS = [
  { left: "8%", size: 14, dur: "13s", delay: "0s", kind: "heart" },
  { left: "22%", size: 9, dur: "16s", delay: "4s", kind: "star" },
  { left: "38%", size: 11, dur: "12s", delay: "7s", kind: "heart" },
  { left: "57%", size: 8, dur: "15s", delay: "2s", kind: "star" },
  { left: "72%", size: 13, dur: "14s", delay: "9s", kind: "heart" },
  { left: "88%", size: 10, dur: "17s", delay: "5.5s", kind: "star" },
] as const;

/** Little hearts and stars drifting upward behind the content. */
export function FloatingBits({ className = "", rise = "520px", peak = 0.75 }: { className?: string; rise?: string; peak?: number }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className={`float-up absolute bottom-0 ${f.kind === "heart" ? (i % 4 === 0 ? "text-butter-400" : "text-rose-300") : "text-gold-400"}`}
          style={
            {
              left: f.left,
              width: f.size,
              height: f.size,
              "--dur": f.dur,
              "--delay": f.delay,
              "--rise": rise,
              "--peak": peak,
            } as React.CSSProperties
          }
        >
          {f.kind === "heart" ? <HeartGlyph className="h-full w-full" /> : <StarGlyph className="h-full w-full" />}
        </span>
      ))}
    </div>
  );
}

/** Balloons slowly rising across the whole screen (used behind the envelope). */
export function RisingBalloons({ className = "" }: { className?: string }) {
  const balloons = [
    { left: "6%", w: 34, color: "pink" as const, dur: "18s", delay: "0.5s" },
    { left: "78%", w: 42, color: "yellow" as const, dur: "21s", delay: "3s" },
    { left: "30%", w: 26, color: "yellow" as const, dur: "19s", delay: "8s" },
    { left: "88%", w: 30, color: "pink" as const, dur: "17s", delay: "11s" },
    { left: "52%", w: 24, color: "pink" as const, dur: "22s", delay: "14s" },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {balloons.map((b, i) => (
        <span
          key={i}
          className="float-up absolute -bottom-40"
          style={{ left: b.left, width: b.w, "--dur": b.dur, "--delay": b.delay, "--rise": "125vh", "--peak": 0.9 } as React.CSSProperties}
        >
          <Balloon color={b.color} className="w-full" />
        </span>
      ))}
    </div>
  );
}
