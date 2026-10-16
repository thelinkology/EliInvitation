import Image from "next/image";

import { BabysBreath, GoldCross, SatinBow, TinyHeart } from "@/components/art/Ribbons";
import { SittingTeddy } from "@/components/art/Nursery";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

const short = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", timeZone: event.timeZone });

/** Photo panel with "Save the Date" lettering beneath, as in the reference card. */
export function SaveTheDate() {
  const { saveTheDate: photo } = event.photos;
  return (
    <section aria-label="Save the date" className="relative overflow-hidden bg-[#fffaf0]">
      <div className="relative aspect-[4/5] w-full">
        <Image src={photo.src} alt={photo.alt} fill sizes="480px" className="photo-drift object-cover object-[50%_35%]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[38%] bg-linear-to-t from-[#fffaf0] via-[#fffaf0]/70 to-transparent" />
        <BabysBreath className="fx fx-flower pointer-events-none absolute -top-2 -left-4 w-32" />
      </div>

      <div className="relative -mt-24 pb-12 text-center">
        <SittingTeddy className="fx fx-teddy fx-d1 pointer-events-none absolute -bottom-2 -left-3 w-28" tie="yellow" />
        <BabysBreath flip className="fx fx-flower fx-d2 pointer-events-none absolute -right-4 bottom-0 w-32" />
        <Reveal variant="title">
        <p className="title-track font-display text-[4rem] leading-none font-medium tracking-[0.08em] text-rose-600 uppercase">Save</p>
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-12 bg-gold-400" />
          <TinyHeart className="h-3 w-3 text-rose-400" />
          <span className="font-script text-5xl leading-none text-cocoa">the</span>
          <TinyHeart className="h-3 w-3 text-rose-400" />
          <span className="h-px w-12 bg-gold-400" />
        </div>
        <span className="sr-only">the</span>
        <p className="title-track font-display text-[4rem] leading-none font-medium tracking-[0.08em] text-rose-600 uppercase">Date</p>
        </Reveal>
        <p className="fx fx-text fx-d1 mt-3 font-display text-xl tracking-[0.3em] text-cocoa">
          <time dateTime={event.startsAt}>{short.format(new Date(event.startsAt)).replaceAll("/", ".")}</time>
        </p>
        <div className="fx fx-cross fx-d2 relative mt-3 flex flex-col items-center" aria-hidden="true">
          <GoldCross className="h-10 w-7" />
          <SatinBow className="-mt-5 w-16" />
        </div>
      </div>
    </section>
  );
}
