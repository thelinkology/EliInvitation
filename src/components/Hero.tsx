import Image from "next/image";

import { BabysBreath, LeafSprig, SatinBow, TinyHeart } from "@/components/art/Ribbons";
import { BalloonCluster, SittingTeddy } from "@/components/art/Nursery";
import { CrossWithSprigs, NotchedFrame, Panel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

const monthDayYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "2-digit",
  year: "numeric",
  timeZone: event.timeZone,
});
const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: event.timeZone });

/** Opening panel: "Please join us for the Christening", portrait in an arch, and a name plaque. */
export type HeroGodparent = {
  /** "Ninong Jaypee", or undefined when the name isn't known. */
  address?: string;
  /** "Ninong", "Ninang", or "Ninong or Ninang". */
  roleLabel: string;
  /** Their saved answer, if any (personal links only). */
  accepted: boolean | null;
};

export function Hero({ greetingName, godparent }: { greetingName?: string; godparent?: HeroGodparent }) {
  const { hero } = event.photos;
  const date = new Date(event.startsAt);
  const child = event.babyPronoun === "him" ? "boy" : "girl";

  return (
    <Panel
      tone="pink"
      ornament="none"
      decor={
        <>
          <BalloonCluster className="fx fx-balloon pointer-events-none absolute top-[30%] -left-10 w-36 opacity-95" />
          <BalloonCluster flip className="fx fx-balloon fx-d1 pointer-events-none absolute top-[44%] -right-12 w-32 opacity-90" />
          <BabysBreath className="fx fx-flower fx-d2 pointer-events-none absolute -top-2 -left-4 w-28" />
          <BabysBreath flip className="fx fx-flower fx-d3 pointer-events-none absolute -top-2 -right-4 w-28" />
        </>
      }
    >
      <div className="text-center">
        {godparent && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-1.5 font-sans text-[10px] font-semibold tracking-[0.25em] text-white uppercase shadow-md">
            <TinyHeart className="h-3 w-3" />
            A godparent&rsquo;s invitation
            <TinyHeart className="h-3 w-3" />
          </p>
        )}
        {godparent ? (
          <p className="mb-1 font-script text-3xl text-cocoa">Dear {godparent.address ?? "Ninong & Ninang"},</p>
        ) : (
          greetingName && <p className="mb-1 font-script text-3xl text-cocoa">Dear {greetingName},</p>
        )}
        <CrossWithSprigs />
        <h1 id="top" tabIndex={-1} className="mt-2 outline-none">
          <span className="block font-sans text-[11px] font-medium tracking-[0.35em] text-cocoa uppercase">Please join us for the</span>
          <span className="mt-1 block font-display text-[2.75rem] leading-none font-medium tracking-[0.04em] text-rose-600 uppercase sm:text-6xl">
            Christening
          </span>
          <span className="mt-1 block font-script text-4xl text-cocoa">of our little {child}</span>
        </h1>
      </div>

      {/* Portrait */}
      <Reveal variant="zoom" className="relative mx-auto mt-8 w-[78%] max-w-[320px]">
        <div className="rounded-t-full bg-linear-to-b from-blush-300 via-gold-300 to-butter-300 p-[4px] shadow-[0_30px_60px_-30px_rgba(176,77,108,0.75)]">
          <div className="rounded-t-full bg-paper p-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
              <Image src={hero.src} alt={hero.alt} fill preload sizes="(min-width: 480px) 320px, 78vw" className="photo-drift object-cover" />
            </div>
          </div>
        </div>
        <SatinBow className="absolute -top-8 left-1/2 w-28 -translate-x-1/2 drop-shadow-sm" />
        <SittingTeddy className="fx fx-teddy absolute -right-12 -bottom-6 w-28 drop-shadow-md" />
      </Reveal>

      {/* Name plaque */}
      <Reveal delay={150} className="relative z-10">
      <NotchedFrame bow className="relative mx-auto -mt-6 max-w-[360px]">
        <div className="text-center">
          <p className="font-display text-[2.1rem] leading-tight font-medium text-rose-600">{event.babyName}</p>
          <p className="-mt-1 font-script text-3xl text-cocoa">{event.babyPronoun === "him" ? "His" : "Her"} Christening</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-gold-400" aria-hidden="true">
            <span className="h-px w-10 bg-gold-400" />
            <TinyHeart className="h-2.5 w-2.5 text-rose-400" />
            <span className="h-px w-10 bg-gold-400" />
          </div>
          <p className="mt-2 font-display text-lg tracking-[0.18em] text-ink uppercase">
            <time dateTime={event.startsAt}>{monthDayYear.format(date)}</time>
          </p>
          <p className="mt-1 font-sans text-xs font-medium tracking-[0.25em] text-cocoa uppercase">
            {weekday.format(date)} · {event.ceremony.time}
          </p>
          <div className="mt-3 flex items-center justify-center gap-1" aria-hidden="true">
            <LeafSprig className="w-14" flip />
            <TinyHeart className="h-3 w-3 text-rose-400" />
            <LeafSprig className="w-14" />
          </div>
        </div>
      </NotchedFrame>
      </Reveal>

      {godparent && godparent.accepted !== false && <ChosenCard {...godparent} />}

      <p className="fx fx-text mt-8 text-center font-serif text-lg text-ink-soft italic">{event.city}</p>
    </Panel>
  );
}

/** "You've been chosen" note for godparents — becomes a thank-you once they've said yes. */
function ChosenCard({ roleLabel, accepted }: HeroGodparent) {
  const baby = event.babyFirstName;
  return (
    <Reveal delay={250} className="relative z-10 mx-auto mt-10 max-w-[360px]">
      <div className="relative rounded-[1.75rem] border border-gold-300 bg-linear-to-b from-butter-50 to-blush-50 px-6 pt-9 pb-7 text-center shadow-[0_20px_40px_-24px_rgba(176,77,108,0.6)]">
        <SittingTeddy className="fx fx-teddy absolute -top-12 left-1/2 w-20 -translate-x-1/2" tie="pink" />
        <p className="font-sans text-[10px] font-semibold tracking-[0.3em] text-gold-700 uppercase">
          {accepted ? "Thank you for saying yes!" : "You\u2019ve been chosen"}
        </p>
        <p className="mt-1 font-script text-4xl leading-tight text-rose-600">
          {accepted ? `${baby}\u2019s ${roleLabel}` : `to be my ${roleLabel}`}
        </p>
        <p className="mt-3 font-serif text-lg leading-snug text-ink">
          {accepted
            ? `I\u2019m so happy you\u2019ll stand beside me. Please don\u2019t forget to RSVP so we can save your seat.`
            : `Mommy and Daddy chose you to guide me in faith and love as I grow. I have a very special question for you.`}
        </p>
        <a
          href={accepted ? "#rsvp" : "#godparent"}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-rose-600 px-6 font-sans text-xs font-semibold tracking-[0.2em] text-white uppercase shadow-md transition hover:bg-[#963d5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
        >
          {accepted ? "RSVP" : "Read my request"}
          <span aria-hidden="true">&darr;</span>
        </a>
      </div>
    </Reveal>
  );
}
