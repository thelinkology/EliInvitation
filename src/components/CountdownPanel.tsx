import { BabysBreath, SatinBow } from "@/components/art/Ribbons";
import { AlphabetBlocks, BibleBook, Candle, SittingTeddy } from "@/components/art/Nursery";
import { Countdown } from "@/components/Countdown";
import { CalendarIcon } from "@/components/icons";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Panel, PanelTitle } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { buttonSecondary } from "@/components/ui";
import { event, googleCalendarUrl } from "@/config/event";

export function CountdownPanel() {
  const { music } = event;
  return (
    <Panel
      id="details"
      labelledBy="countdown-title"
      tone="cream"
      className="pb-56"
      decor={
        <>
          <BabysBreath className="fx fx-flower pointer-events-none absolute top-24 -left-6 w-28" />
          <BabysBreath flip className="fx fx-flower fx-d1 pointer-events-none absolute top-24 -right-6 w-28" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-center">
            <SittingTeddy className="fx fx-teddy fx-d2 -mr-4 w-32" tie="pink" />
            <Candle className="fx fx-pop fx-d3 z-10 -mr-1 w-10" />
            <AlphabetBlocks letters="ZANE" className="fx fx-blocks w-40" />
          </div>
          <BibleBook className="fx fx-slide-r fx-d1 pointer-events-none absolute right-6 bottom-40 w-24 rotate-[-4deg] opacity-95" />
        </>
      }
    >
      {music.src && (
        <Reveal className="mb-10">
          <MusicPlayer src={music.src} title={music.title} artist={music.artist} />
        </Reveal>
      )}

      <Reveal>
        <PanelTitle id="countdown-title" lead="The" main="Countdown" />
        <p className="mt-2 text-center font-serif text-xl text-cocoa">
          to {event.babyFirstName}&rsquo;s Christening
          <br />
          has begun&hellip;
        </p>
        <SatinBow className="mx-auto mt-3 w-20" />
        <div className="mt-4">
          <Countdown startsAt={event.startsAt} />
        </div>
        <p className="mt-8 text-center font-script text-5xl text-cocoa">We can&rsquo;t wait</p>
        <p className="text-center font-sans text-xs font-semibold tracking-[0.3em] text-rose-600 uppercase">to celebrate with you!</p>
        <div className="mt-6 flex justify-center">
          <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
            <CalendarIcon className="h-4 w-4" />
            Add to calendar
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </Panel>
  );
}
