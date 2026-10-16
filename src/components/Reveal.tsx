"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { whenRevealed } from "@/lib/client";

export type RevealVariant = "up" | "zoom" | "left" | "right" | "pop" | "title";

/**
 * Animates its children the first time they scroll into view (after the
 * envelope has been opened). Variants: "up" fade up · "zoom" soft focus-in ·
 * "left"/"right" slide in · "pop" springy scale · "title" letters settle in.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let observer: IntersectionObserver | undefined;
    const stop = whenRevealed(() => {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setShown(true);
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      observer.observe(el);
    });
    return () => {
      stop();
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={shown ? "shown" : "hidden"}
      data-variant={variant}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
