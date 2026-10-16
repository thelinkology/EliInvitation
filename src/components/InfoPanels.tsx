import Image from "next/image";

import { BabysBreath } from "@/components/art/Ribbons";
import { AlphabetBlocks, GiftBox, SittingTeddy } from "@/components/art/Nursery";
import { DressFigure, ShirtFigure } from "@/components/art/Scenes";
import { BottleIcon, DiaperIcon, EnvelopeIcon, NoKissIcon, NoSmokingIcon, SanitizeIcon, WipesIcon } from "@/components/icons";
import { Panel, PanelTitle, PillLabel } from "@/components/Panel";
import { Reveal } from "@/components/Reveal";
import { event } from "@/config/event";

/* ------------------------------------------------------------------ */
/* Dress code                                                          */
/* ------------------------------------------------------------------ */

/** Dress code with outfit illustrations. Highlights the viewer's own group. */
export function DressCodePanel({ viewer }: { viewer?: "godparent" | "guest" }) {
  const { godparents, guests } = event.attire;
  const youBadge = (
    <span className="ml-2 rounded-full bg-rose-600 px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-[0.15em] text-white uppercase">
      You
    </span>
  );

  return (
    <Panel
      labelledBy="dress-title"
      tone="cream"
      className="pb-20"
      decor={
        <>
          <SittingTeddy className="fx fx-teddy fx-d1 pointer-events-none absolute top-16 -left-2 w-24 -rotate-6" tie="pink" />
          <BabysBreath flip className="fx fx-flower fx-d2 pointer-events-none absolute top-14 -right-4 w-28" />
        </>
      }
    >
      <PanelTitle id="dress-title" main="Dress" trail="Code" />
      <p className="fx fx-text fx-d1 mx-auto mt-3 max-w-xs text-center font-serif text-lg leading-snug text-ink-soft">
        We would be delighted if you could join us in your best semi-formal attire, following our color palette.
      </p>

      <div className="mx-auto mt-8 max-w-[400px] space-y-6">
        <Reveal variant="left">
          <div className={`rounded-3xl bg-paper/90 p-5 text-center ring-1 ${viewer === "godparent" ? "ring-2 ring-rose-400" : "ring-blush-200"}`}>
            <PillLabel>For Godparents</PillLabel>
            {viewer === "godparent" && youBadge}
            <p className="mt-3 font-display text-lg font-medium text-ink">Strictly {godparents.colors}</p>
            <p className="font-sans text-xs text-ink-soft">Ninongs &amp; Ninangs</p>
            <div className="mt-4 flex items-end justify-center gap-4">
              <ShirtFigure color="#ffffff" pants="#fffaf0" className="fx fx-pop fx-d3 h-28" />
              <DressFigure color="#ffffff" className="fx fx-pop h-28" />
              <Swatches palette={godparents.palette} />
            </div>
          </div>
        </Reveal>

        <Reveal variant="right">
          <div className={`rounded-3xl bg-paper/90 p-5 text-center ring-1 ${viewer === "guest" ? "ring-2 ring-rose-400" : "ring-blush-200"}`}>
            <PillLabel tone="yellow">For Guests</PillLabel>
            {viewer === "guest" && youBadge}
            <p className="mt-3 font-display text-lg font-medium text-ink">{guests.colors}</p>
            <p className="font-sans text-xs text-ink-soft">Outfit suggestions</p>
            <div className="mt-4 flex items-end justify-center gap-2">
              <ShirtFigure color={guests.palette[0].hex} className="fx fx-pop fx-d1 h-24" />
              <DressFigure color={guests.palette[1].hex} className="fx fx-pop fx-d2 h-24" />
              <ShirtFigure color={guests.palette[1].hex} pants="#e9dcc6" className="fx fx-pop fx-d3 h-24" />
              <DressFigure color={guests.palette[0].hex} className="fx fx-pop h-24" />
            </div>
            <div className="mt-4 flex justify-center">
              <Swatches palette={guests.palette} row />
            </div>
          </div>
        </Reveal>
      </div>
    </Panel>
  );
}

function Swatches({ palette, row = false }: { palette: readonly { name: string; hex: string }[]; row?: boolean }) {
  return (
    <ul className={`flex ${row ? "flex-row gap-5" : "flex-col gap-2"}`}>
      {palette.map((c) => (
        <li key={c.hex} className="flex flex-col items-center gap-1">
          <span className="h-10 w-10 rounded-full border-4 border-paper shadow-md ring-1 ring-gold-300" style={{ backgroundColor: c.hex }} aria-hidden="true" />
          <span className="text-[11px] text-ink-soft">{c.name}</span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Gift guide                                                          */
/* ------------------------------------------------------------------ */

const GIFT_ICONS = { diaper: DiaperIcon, wipes: WipesIcon, bottle: BottleIcon, envelope: EnvelopeIcon } as const;

export function GiftGuidePanel() {
  const { intro, items, qrCodes } = event.giftGuide;
  return (
    <Panel
      labelledBy="gifts-title"
      tone="yellow"
      className="pb-40"
      decor={
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-center gap-0">
          <GiftBox className="fx fx-pop fx-d1 w-20" color="yellow" />
          <SittingTeddy className="fx fx-teddy fx-d2 -mx-2 w-28" tie="pink" />
          <GiftBox className="fx fx-pop fx-d3 w-24" color="pink" />
        </div>
      }
    >
      <PanelTitle id="gifts-title" main="Gift" trail="Guide" />
      <p className="fx fx-text fx-d1 mx-auto mt-3 max-w-xs text-center font-serif text-lg leading-snug text-ink-soft">{intro}</p>

      <ul className="mx-auto mt-7 grid max-w-[400px] grid-cols-2 gap-3">
        {items.map((item, i) => {
          const Icon = GIFT_ICONS[item.icon];
          const pink = i % 2 === 0;
          return (
            <li key={item.title}>
              <Reveal delay={i * 110} variant="zoom" className="h-full">
                <div className="flex h-full flex-col items-center rounded-3xl bg-paper/95 px-3 py-4 text-center ring-1 ring-blush-200">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${pink ? "bg-blush-100 text-rose-600" : "bg-butter-100 text-gold-700"}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-2 font-display text-[1.05rem] leading-tight font-medium text-ink">{item.title}</span>
                  {item.detail && <span className="mt-1 text-xs leading-snug text-ink-soft">{item.detail}</span>}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {qrCodes.length > 0 && (
        <div className="mx-auto mt-6 max-w-[400px] text-center">
          <p className="font-serif text-base text-ink-soft">For monetary gifts, you may use the QR codes below:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4">
            {qrCodes.map((qr) => (
              <figure key={qr.src} className="rounded-2xl bg-white p-2 shadow-md ring-1 ring-blush-200">
                <div className="relative h-32 w-32">
                  <Image src={qr.src} alt={`${qr.label} QR code`} fill sizes="128px" className="object-contain" />
                </div>
                <figcaption className="mt-1 font-sans text-xs font-medium text-ink">{qr.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      <p className="fx fx-text mt-6 text-center font-script text-3xl text-cocoa">Thank you for your love &amp; generosity</p>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Health reminders                                                    */
/* ------------------------------------------------------------------ */

const PROTOCOL_ICONS = { nokiss: NoKissIcon, sanitize: SanitizeIcon, nosmoking: NoSmokingIcon } as const;

export function ProtocolPanel() {
  const { intro, items } = event.protocol;
  return (
    <Panel
      labelledBy="protocol-title"
      tone="pink"
      className="pb-32"
      decor={
        <>
          <BabysBreath className="fx fx-flower pointer-events-none absolute top-14 -left-4 w-28" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <AlphabetBlocks letters="ZANE" className="fx fx-blocks fx-d1 w-44" />
          </div>
        </>
      }
    >
      <PanelTitle id="protocol-title" main="Health" trail="Reminders" />
      <p className="fx fx-text fx-d1 mx-auto mt-3 max-w-xs text-center font-serif text-lg leading-snug text-ink-soft">{intro}</p>
      <ul className="mx-auto mt-8 grid max-w-[400px] grid-cols-3 gap-2">
        {items.map((item, i) => {
          const Icon = PROTOCOL_ICONS[item.icon];
          return (
            <li key={item.label} className="flex min-w-0 flex-col items-center text-center">
              <Reveal delay={i * 140} variant="pop">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blush-300 bg-paper text-rose-600 shadow-[0_10px_24px_-14px_rgba(176,77,108,0.7)] ring-4 ring-butter-100">
                  <Icon className="h-10 w-10" />
                </span>
                <span className="mt-2 block font-sans text-xs leading-snug font-medium text-ink">{item.label}</span>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
