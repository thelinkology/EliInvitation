import { HeartRule } from "@/components/art/Ribbons";
import { BalloonBear, Bunting, Sparkles } from "@/components/Decor";
import { event } from "@/config/event";

const longDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: event.timeZone });

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-[480px] overflow-hidden bg-linear-to-b from-[#fff1f5] to-[#fffbea] px-5 pt-14 pb-28 text-center">
      <Sparkles />
      <div className="fx fx-balloon relative mx-auto mb-4 flex max-w-xs items-end justify-center gap-6" aria-hidden="true">
        <BalloonBear className="w-20 animate-sway [transform-origin:bottom_center]" flip />
        <BalloonBear className="w-20 animate-sway [transform-origin:bottom_center] [animation-delay:1.2s]" />
      </div>
      <p className="fx fx-text relative font-script text-[2rem] leading-tight text-cocoa">See you on {longDate.format(new Date(event.startsAt))}!</p>
      <HeartRule className="relative mt-3" />
      {event.hashtag && <p className="fx fx-text fx-d2 relative mt-4 font-sans text-sm font-medium tracking-wide text-gold-700">{event.hashtag}</p>}
      <Bunting className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full rotate-180 opacity-70" />
    </footer>
  );
}

/** Small floating shortcut to the RSVP section, mainly for phones. */
export function FloatingRsvp() {
  return (
    <a
      href="#rsvp"
      className="fixed right-4 bottom-4 z-40 inline-flex min-h-12 items-center rounded-full bg-rose-600 px-5 font-sans text-xs font-medium tracking-[0.25em] text-white uppercase shadow-[0_12px_30px_-10px_rgba(120,60,70,0.8)] transition hover:bg-[#963d5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
    >
      RSVP
    </a>
  );
}
