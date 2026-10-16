"use client";

import { useEffect } from "react";

import { whenRevealed } from "@/lib/client";

/**
 * Brings the decorative objects to life as they scroll into view.
 * Any element with the `fx` class plus a type (`fx-balloon`, `fx-teddy`,
 * `fx-flower`, `fx-blocks`, `fx-pop`, `fx-cross`, `fx-slide-r`) gets
 * `data-fx="in"` the first time it is seen; the CSS in globals.css does the rest.
 * Nothing starts until the envelope has been opened.
 */
export function ScrollFx() {
  useEffect(() => {
    document.documentElement.classList.add("fx-ready");
    let observer: IntersectionObserver | undefined;

    const stop = whenRevealed(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute("data-fx", "in");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      document.querySelectorAll(".fx").forEach((el) => observer?.observe(el));
    });

    return () => {
      stop();
      observer?.disconnect();
    };
  }, []);

  return null;
}
