import Image from "next/image";

import { BabysBreath, HeartRule, SatinBow } from "@/components/art/Ribbons";
import { BalloonCluster, SittingTeddy } from "@/components/art/Nursery";
import { GodparentResponse, type GodparentResponseProps } from "@/components/GodparentResponse";
import { NotchedFrame, Panel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

/** The Ninong/Ninang request: a letter in the baby's voice plus its own response form. */
export function GodparentSection({ name, ...response }: GodparentResponseProps & { name?: string }) {
  const { godparent: photo } = event.photos;
  const role = response.roleLabel;

  return (
    <Panel
      labelledBy="godparent-title"
      tone="yellow"
      className="pb-20"
      decor={
        <>
          <BalloonCluster className="fx fx-balloon pointer-events-none absolute top-[22%] -left-14 w-32" />
          <BabysBreath flip className="fx fx-flower fx-d1 pointer-events-none absolute top-[24%] -right-5 w-28" />
        </>
      }
    >
      <Reveal variant="title" className="text-center">
        <p className="font-sans text-[11px] font-medium tracking-[0.35em] text-cocoa uppercase">A special request</p>
        <h2 id="godparent-title" className="mt-1">
          <span className="block font-script text-4xl leading-tight text-cocoa">Will you be my</span>
          {role.includes(" or ") ? (
            <>
              <span className="title-track -mt-1 block font-display text-5xl font-medium tracking-[0.06em] whitespace-nowrap text-rose-600 uppercase">
                Ninong
              </span>
              <span className="-my-1 block font-script text-4xl leading-tight text-cocoa">or</span>
              <span className="title-track block font-display text-5xl font-medium tracking-[0.06em] whitespace-nowrap text-rose-600 uppercase">
                Ninang?
              </span>
            </>
          ) : (
            <span className="title-track -mt-1 block font-display text-5xl font-medium tracking-[0.06em] whitespace-nowrap text-rose-600 uppercase">
              {role}?
            </span>
          )}
        </h2>
        <HeartRule className="mt-3" />
      </Reveal>

      <Reveal variant="zoom">
        <div className="relative mx-auto mt-10 w-[64%] max-w-[260px]">
          <div className="rounded-t-full bg-linear-to-b from-butter-300 via-gold-300 to-blush-300 p-[4px] shadow-[0_30px_60px_-30px_rgba(176,77,108,0.7)]">
            <div className="rounded-t-full bg-paper p-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full">
                <Image src={photo.src} alt={photo.alt} fill sizes="260px" className="photo-drift object-cover" />
              </div>
            </div>
          </div>
          <SatinBow className="absolute -top-7 left-1/2 w-24 -translate-x-1/2" />
          <SittingTeddy className="fx fx-teddy fx-d2 absolute -right-14 -bottom-4 w-24" tie="yellow" />
        </div>
      </Reveal>

      <Reveal>
        <NotchedFrame bow className="mx-auto mt-12 max-w-[420px]">
          <p className="font-script text-4xl text-cocoa">Dear {name ?? "Ninong & Ninang"},</p>
          <div className="mt-3 space-y-4 font-serif text-lg leading-relaxed text-ink">
            <p>
              Hi! It&rsquo;s me, {event.babyFirstName}. Mommy and Daddy say you are one of the most special people in our
              lives, so I&rsquo;m writing to ask you something very important.
            </p>
            <p>
              On the day of my christening, will you stand beside me as my <em className="text-rose-600">{role}</em>? I&rsquo;d
              love for you to pray for me, guide me as I grow, and be part of my story — always.
            </p>
          </div>
          <p className="mt-5 font-script text-3xl text-rose-600">With all my tiny love, {event.babyFirstName}</p>

          <div className="my-7 h-px bg-linear-to-r from-transparent via-gold-400 to-transparent" />

          <GodparentResponse {...response} />

          <p className="mt-7 rounded-2xl border border-gold-300/70 bg-butter-50 px-4 py-3 text-center text-sm leading-relaxed text-ink">
            <strong>Please note:</strong> accepting the role of {role} does <strong>not</strong> automatically confirm your
            attendance. Kindly RSVP separately below.
          </p>
        </NotchedFrame>
      </Reveal>
    </Panel>
  );
}
