"use client";

import { Fragment, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

/** Current whole second on the client; null during server render so markup matches on hydration. */
function useNowSeconds(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}

export function Countdown({ startsAt }: { startsAt: string }) {
  const now = useNowSeconds();
  const target = Math.floor(new Date(startsAt).getTime() / 1000);
  const diff = now === null ? null : target - now;

  if (diff !== null && diff <= 0) {
    return <p className="text-center font-script text-5xl text-rose-600">Today is the day!</p>;
  }

  const units: [string, number | null][] = [
    ["Days", diff === null ? null : Math.floor(diff / 86_400)],
    ["Hours", diff === null ? null : Math.floor((diff / 3_600) % 24)],
    ["Minutes", diff === null ? null : Math.floor((diff / 60) % 60)],
    ["Seconds", diff === null ? null : diff % 60],
  ];

  return (
    <div
      className="mx-auto flex max-w-md items-stretch justify-center gap-1 rounded-[1.4rem] border border-blush-200 bg-blush-50/80 p-2.5 shadow-[0_18px_36px_-24px_rgba(176,77,108,0.6)] sm:gap-2"
      role="timer"
      aria-label="Time until the christening"
    >
      {units.map(([label, value], i) => (
        <Fragment key={label}>
          {i > 0 && (
            <span className="self-center pb-4 font-display text-2xl text-rose-300" aria-hidden="true">
              :
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col items-center rounded-xl bg-paper px-1 py-2.5 shadow-sm ring-1 ring-blush-100">
            <span className="font-display text-[1.7rem] leading-none font-medium text-ink tabular-nums sm:text-4xl">
              {value === null ? "–" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-1.5 font-sans text-[9px] font-medium tracking-[0.18em] text-cocoa uppercase">{label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
