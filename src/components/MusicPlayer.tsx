"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { TinyHeart } from "@/components/art/Ribbons";
import { OPEN_EVENT } from "@/components/Envelope";

const BARS = [0.5, 0.8, 0.4, 1, 0.6, 0.9, 0.3, 0.7, 1, 0.5, 0.8, 0.45, 0.95, 0.6, 0.35, 0.85, 0.55, 1, 0.4, 0.7];

function fmt(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Keepsake-style music card. Starts when the envelope is opened (a user tap,
 * which browsers require before playing sound) and offers a floating mute button.
 */
export function MusicPlayer({ src, title, artist }: { src: string; title: string; artist?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const start = () => {
      audio.current?.play().catch(() => {});
    };
    window.addEventListener(OPEN_EVENT, start);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      window.removeEventListener(OPEN_EVENT, start);
      cancelAnimationFrame(id);
    };
  }, []);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setError(true));
    else el.pause();
  }

  function seek(delta: number) {
    const el = audio.current;
    if (el) el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
  }

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="mx-auto max-w-sm">
      <audio
        ref={audio}
        src={src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setError(true)}
      />

      <div className="paper rounded-[1.75rem] border border-blush-200 p-4 shadow-[0_20px_40px_-24px_rgba(176,77,108,0.55)]">
        <div className="flex items-center gap-4">
          {/* Record */}
          <div
            className={`relative h-20 w-20 shrink-0 rounded-full bg-[repeating-radial-gradient(circle,#f3a9c0_0_2px,#f6b9cb_2px_4px)] shadow-inner ${
              playing ? "animate-spin-slow" : ""
            }`}
            aria-hidden="true"
          >
            <span className="absolute inset-[30%] flex items-center justify-center rounded-full bg-[#fffaf0] ring-2 ring-gold-300">
              <TinyHeart className="h-3 w-3 text-rose-500" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg font-semibold text-ink">{title}</p>
            {artist && <p className="truncate text-xs text-ink-soft">{artist}</p>}
            <div className="mt-2 flex h-8 items-center gap-[3px]" aria-hidden="true">
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className={`w-[3px] origin-center rounded-full bg-rose-400 ${playing ? "animate-wave" : ""}`}
                  style={{ height: `${h * 100}%`, animationDelay: `${(i % 7) * 0.12}s`, transform: playing ? undefined : "scaleY(0.35)" }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-blush-100">
            <div className="h-full rounded-full bg-rose-500 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-ink-soft tabular-nums">
            <span>{fmt(time)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between px-2 text-rose-600">
          <button type="button" onClick={() => setLiked((v) => !v)} aria-pressed={liked} aria-label="Love this song" className="rounded-full p-2 hover:bg-blush-50">
            <TinyHeart className={`h-5 w-5 ${liked ? "" : "opacity-40"}`} />
          </button>
          <button type="button" onClick={() => seek(-10)} aria-label="Back 10 seconds" className="rounded-full p-2 hover:bg-blush-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M6 5h2v14H6zM20 5v14L9 12z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-400 bg-paper shadow-sm hover:bg-blush-50"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
                <path d="M7 4l13 8-13 8z" />
              </svg>
            )}
          </button>
          <button type="button" onClick={() => seek(10)} aria-label="Forward 10 seconds" className="rounded-full p-2 hover:bg-blush-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
            </svg>
          </button>
          <span className="w-9" />
        </div>
        {error && <p className="mt-2 text-center text-xs text-ink-soft">The song couldn&rsquo;t be played on this device.</p>}
      </div>

      {mounted &&
        createPortal(
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause music" : "Play music"}
            className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-rose-600 shadow-[0_10px_24px_-10px_rgba(120,60,70,0.7)] ring-1 ring-blush-200 transition hover:bg-blush-50"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 18V5l11-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="17" cy="16" r="3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M9 18V5l11-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="17" cy="16" r="3" />
                <path d="M3 3l18 18" />
              </svg>
            )}
          </button>,
          document.body,
        )}
    </div>
  );
}
