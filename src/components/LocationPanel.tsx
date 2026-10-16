import Image from "next/image";

import { BabysBreath } from "@/components/art/Ribbons";
import { GiftBox, SittingTeddy } from "@/components/art/Nursery";
import { ChurchScene, ClubhouseScene } from "@/components/art/Scenes";
import { ChevronIcon, PinIcon } from "@/components/icons";
import { NotchedFrame, Panel, PanelTitle, ScriptLabel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

export function LocationPanel() {
  const venues = [
    { label: "Ceremony", ...event.ceremony, Scene: ChurchScene, bowColor: "pink" as const },
    { label: "Reception", ...event.reception, Scene: ClubhouseScene, bowColor: "yellow" as const },
  ];

  return (
    <Panel
      labelledBy="location-title"
      tone="yellow"
      className="pb-28"
      decor={
        <>
          <SittingTeddy className="fx fx-teddy pointer-events-none absolute top-16 -left-3 w-24 -rotate-6" tie="yellow" />
          <BabysBreath flip className="fx fx-flower fx-d1 pointer-events-none absolute top-14 -right-5 w-28" />
          <BabysBreath className="fx fx-flower fx-d2 pointer-events-none absolute bottom-10 -left-6 w-28" />
          <GiftBox className="fx fx-pop fx-d3 pointer-events-none absolute right-3 bottom-6 w-20" color="pink" />
        </>
      }
    >
      <PanelTitle id="location-title" lead="The" main="Location" />

      <div className="mt-14 space-y-16">
        {venues.map(({ label, title, venue, address, time, note, image, mapUrl, Scene, bowColor }, i) => (
          <Reveal key={label} variant={i % 2 ? "right" : "left"}>
            <NotchedFrame bow bowColor={bowColor} className="mx-auto max-w-[380px]">
              <div className="text-center">
                <ScriptLabel>{label}</ScriptLabel>
                <h3 className="mt-1 font-display text-2xl font-medium tracking-[0.06em] text-rose-600 uppercase">{venue}</h3>
                <p className="mt-1 font-sans text-xs leading-relaxed text-ink-soft">{address}</p>
                <p className="mt-3 inline-block rounded-full bg-butter-100 px-4 py-1 font-sans text-xs font-semibold tracking-[0.15em] text-gold-700 uppercase">
                  {title} · {time}
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-blush-200">
                  {image ? (
                    <div className="relative aspect-[16/10]">
                      <Image src={image} alt={`${venue}`} fill sizes="340px" className="photo-drift object-cover" />
                    </div>
                  ) : (
                    <Scene className="block h-auto w-full" />
                  )}
                </div>

                {note && <p className="mt-3 font-serif text-base text-cocoa italic">{note}</p>}

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-rose-600 py-2 pr-4 pl-5 font-sans text-sm font-medium text-white shadow-md transition hover:bg-[#963d5a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
                >
                  <PinIcon className="h-4 w-4" />
                  <span className="underline underline-offset-2">View on Google Maps</span>
                  <ChevronIcon className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </NotchedFrame>
          </Reveal>
        ))}
      </div>
    </Panel>
  );
}
