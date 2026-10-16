import Image from "next/image";

import { BabysBreath, HeartRule, SatinBow } from "@/components/art/Ribbons";
import { AlphabetBlocks, BalloonCluster, Candle, GiftBox, SittingTeddy } from "@/components/art/Nursery";
import { NotchedFrame, Panel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { RsvpForm, type RsvpFormProps } from "@/components/RsvpForm";
import { event } from "@/config/event";

const monthDay = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: event.timeZone });

export function RsvpSection({ isGodparent, ...form }: RsvpFormProps & { isGodparent: boolean }) {
  const { rsvp: photo } = event.photos;
  return (
    <Panel
      id="rsvp"
      labelledBy="rsvp-title"
      tone="cream"
      ornament="none"
      className="pb-44"
      decor={
        <>
          <BalloonCluster className="fx fx-balloon pointer-events-none absolute top-24 -left-14 w-32" />
          <BalloonCluster flip className="fx fx-balloon fx-d1 pointer-events-none absolute top-20 -right-14 w-32" />
          <BabysBreath flip className="fx fx-flower fx-d2 pointer-events-none absolute right-0 bottom-20 w-24" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-4">
            <div className="flex items-end">
              <Candle className="fx fx-pop fx-d3 w-9" />
              <AlphabetBlocks letters="ZE" className="fx fx-blocks w-24" />
            </div>
            <GiftBox className="fx fx-pop fx-d1 w-20" color="yellow" />
          </div>
        </>
      }
    >
      {/* Portrait */}
      <Reveal variant="zoom">
        <div className="relative mx-auto mt-12 w-[82%] max-w-[330px]">
          <div className="rounded-[1.5rem] bg-linear-to-b from-blush-300 to-gold-300 p-[3px] shadow-[0_24px_50px_-28px_rgba(176,77,108,0.7)]">
            <div className="rounded-[1.4rem] bg-paper p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={photo.src} alt={photo.alt} fill sizes="330px" className="photo-drift object-cover" />
              </div>
            </div>
          </div>
          <SatinBow className="absolute -top-7 left-1/2 w-24 -translate-x-1/2" />
          <SittingTeddy className="fx fx-teddy fx-d2 absolute -bottom-8 -left-12 w-24" tie="yellow" />
        </div>
      </Reveal>

      <div className="mt-10 text-center">
        <h2 id="rsvp-title" className="fx fx-text">
          <span className="block font-script text-5xl leading-none text-cocoa">please</span>
          <span className="-mt-1 block font-display text-6xl font-medium tracking-[0.08em] text-rose-600">RSVP</span>
        </h2>
        <HeartRule className="fx fx-text fx-d1 mt-2" />
        <p className="fx fx-text fx-d1 mt-3 font-serif text-lg text-ink-soft">Kindly confirm your attendance on or before</p>
        <p className="fx fx-text fx-d2 mx-auto mt-2 inline-block rounded-full bg-blush-100 px-6 py-1.5 font-display text-xl font-medium tracking-[0.12em] text-rose-600 uppercase">
          {monthDay.format(new Date(event.rsvpDeadline))}
        </p>
        {isGodparent && (
          <p className="mx-auto mt-4 max-w-xs text-sm text-ink-soft">
            This is separate from your godparent answer above — it tells us whether you can attend on the day.
          </p>
        )}
      </div>

      <Reveal>
        <NotchedFrame bow className="mx-auto mt-14 max-w-[420px]">
          <RsvpForm {...form} />
        </NotchedFrame>
      </Reveal>

      <p className="fx fx-text mt-10 text-center font-script text-5xl text-cocoa">Thank you</p>
    </Panel>
  );
}
