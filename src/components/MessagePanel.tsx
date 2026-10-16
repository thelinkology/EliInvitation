import Image from "next/image";

import { BabysBreath, GoldCross, HeartRule, LeafSprig, SatinBow } from "@/components/art/Ribbons";
import { AlphabetBlocks, GiftBox, SittingTeddy } from "@/components/art/Nursery";
import { Panel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

/** A letter from the parents with a framed portrait. */
export function MessagePanel() {
  const { message: photo } = event.photos;
  return (
    <Panel
      label="A message from the parents"
      tone="pink"
      className="pb-40"
      decor={
        <>
          <SittingTeddy className="fx fx-teddy pointer-events-none absolute top-[24%] -left-5 w-24" tie="pink" />
          <GoldCross className="fx fx-cross pointer-events-none absolute top-[26%] right-5 h-16 w-10 opacity-90" />
          <SatinBow className="pointer-events-none absolute top-[25%] right-2 w-16" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-3">
            <GiftBox className="fx fx-pop fx-d1 w-20" color="pink" />
            <AlphabetBlocks letters={event.babyFirstName.toUpperCase().slice(0, 4)} className="fx fx-blocks fx-d2 w-44" />
          </div>
        </>
      }
    >
      <Reveal variant="zoom">
        <div className="relative mx-auto mt-6 w-[72%] max-w-[290px]">
          <div className="rounded-[1.5rem] bg-linear-to-b from-gold-300 to-blush-300 p-[3px] shadow-[0_24px_50px_-28px_rgba(176,77,108,0.7)]">
            <div className="rounded-[1.4rem] bg-paper p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image src={photo.src} alt={photo.alt} fill sizes="290px" className="photo-drift object-cover" />
              </div>
            </div>
          </div>
          <BabysBreath flip className="fx fx-flower fx-d3 absolute -top-8 -right-10 w-24" />
        </div>
      </Reveal>

      <Reveal>
        <HeartRule className="mt-8" />
        <div className="mx-auto mt-4 max-w-[340px] space-y-4 text-center font-serif text-lg leading-relaxed text-ink">
          {event.parentsMessage.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <HeartRule className="mt-6" />
        <p className="mt-4 text-center font-serif text-lg text-ink-soft italic">With love and gratitude,</p>
        <p className="text-center font-script text-5xl leading-tight text-rose-600">{event.parents}</p>
        <div className="mt-1 flex items-center justify-center gap-2" aria-hidden="true">
          <LeafSprig className="w-12" flip />
          <span className="font-sans text-[11px] font-medium tracking-[0.25em] text-cocoa uppercase">
            {event.babyFirstName}&rsquo;s Parents
          </span>
          <LeafSprig className="w-12" />
        </div>
        <p className="sr-only">{event.babyFirstName}&rsquo;s Parents</p>
      </Reveal>
    </Panel>
  );
}
