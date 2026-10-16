/** Thin line icons in the invitation's style. Decorative unless labelled by the caller. */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ChurchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2v4M10 4h4M12 6l5 5v10H7V11z" />
      <path d="M3 21v-6l4-3M21 21v-6l-4-3M10.5 21v-4a1.5 1.5 0 0 1 3 0v4" />
    </svg>
  );
}

export function CakeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 21h16M5 21v-7h14v7M7 14v-3h10v3" />
      <path d="M12 11V8M12 5.5c.8-.7.8-1.8 0-2.5-.8.7-.8 1.8 0 2.5z" />
      <path d="M5 17c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5V21h14v-8.5M12 8.5V21" />
      <path d="M12 8.5C10.5 5 7 4.5 7 6.8 7 8.5 10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.7 0 1.7-3 1.7-5 1.7z" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function SpinnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-spin ${className ?? ""}`} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DiaperIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6.5h18v3.2c0 5-4 8.8-9 8.8s-9-3.8-9-8.8z" />
      <path d="M3 9.5c2.4 0 4 1.6 4.6 4M21 9.5c-2.4 0-4 1.6-4.6 4M7.5 6.5v2M16.5 6.5v2" />
    </svg>
  );
}

export function WipesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="8" width="18" height="11" rx="3" />
      <path d="M8.5 8c0-2 1.6-3.5 3.5-3.5S15.5 6 15.5 8" />
      <path d="M9 12.5c1 .8 2 .8 3 0s2-.8 3 0" />
    </svg>
  );
}

export function BottleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9.5 3h5v3h-5zM8.5 6h7l1.5 3v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5V9z" />
      <path d="M7 12h10M12 14.5v3M10.5 16h3" />
    </svg>
  );
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3.5 7l8.5 6.5L20.5 7" />
      <path d="M12 16.5s-2.2-1.3-2.2-2.8a1.2 1.2 0 0 1 2.2-.6 1.2 1.2 0 0 1 2.2.6c0 1.5-2.2 2.8-2.2 2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ShirtIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 3.5L4 6l1.5 4.5L8 9.5V20h8V9.5l2.5 1L20 6l-5-2.5c-.5 1.5-1.6 2.3-3 2.3S9.5 5 9 3.5z" />
    </svg>
  );
}

export function WalkIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M10 21l2.5-6.5L15 17v4M9 11.5l2-3.5 3 1.5 2 3M12.5 14.5L11 8" />
    </svg>
  );
}

export function NoKissIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 10h.01M15 10h.01" strokeWidth="2.2" />
      <path d="M9.5 15c.8-.8 1.7-.8 2.5 0 .8-.8 1.7-.8 2.5 0-.8 1-1.7 1.3-2.5 1.3S10.3 16 9.5 15z" />
      <path d="M5.5 5.5l13 13" />
    </svg>
  );
}

export function SanitizeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 3h4M12 3v3M9 6h6l1 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9z" />
      <path d="M12 12.5c-1.2 1.5-1.8 2.5-1.8 3.3a1.8 1.8 0 0 0 3.6 0c0-.8-.6-1.8-1.8-3.3z" />
      <path d="M19 6.5v1.5M19.5 3.5l.8.8M17 4l.8.8" />
    </svg>
  );
}

export function NoSmokingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="12.5" width="14" height="3.5" rx="0.6" />
      <path d="M14 12.5V16M19.5 12.5V16M21.5 12.5V16M19 10c0-1.5 2-1.5 2-3s-1-2-1-2" />
      <path d="M3.5 3.5l17 17" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
