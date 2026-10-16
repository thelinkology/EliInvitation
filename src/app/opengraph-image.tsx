/* eslint-disable @next/next/no-img-element -- ImageResponse renders plain <img>; next/image does not apply here. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { event } from "@/config/event";

/**
 * The picture shown when the invitation link is shared (Messenger, Viber,
 * Facebook, iMessage…). Built once at deploy time: the baby's photo on the
 * left, the invitation wording on the right, in the site's colors and fonts.
 */

export const alt = `You're invited to the Christening of ${event.babyName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const root = process.cwd();
const [photo, script, display, sans] = await Promise.all([
  readFile(join(root, "public", event.photos.share.src)),
  readFile(join(root, "assets/fonts/pinyon-script-latin-400-normal.ttf")),
  readFile(join(root, "assets/fonts/playfair-display-latin-500-normal.ttf")),
  readFile(join(root, "assets/fonts/jost-latin-500-normal.ttf")),
]);
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

const dateLine = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));

// Small decorative pieces, as SVG data URIs.
const svg = (markup: string) => `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;
const heart = (color: string) =>
  svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 22"><path fill="${color}" d="M12 21S1 14.4 1 7.2A5.6 5.6 0 0 1 12 4.6 5.6 5.6 0 0 1 23 7.2C23 14.4 12 21 12 21z"/></svg>`);
const star = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#e0b85c" d="M12 0L13.9 10.1L24 12L13.9 13.9L12 24L10.1 13.9L0 12L10.1 10.1Z"/></svg>`,
);
const bear = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 112">
  <circle cx="26" cy="30" r="19" fill="#d7ad85"/><circle cx="94" cy="30" r="19" fill="#d7ad85"/>
  <circle cx="26" cy="30" r="10" fill="#f6e3cc"/><circle cx="94" cy="30" r="10" fill="#f6e3cc"/>
  <ellipse cx="60" cy="64" rx="46" ry="42" fill="#d7ad85"/><ellipse cx="60" cy="80" rx="19" ry="14" fill="#f6e3cc"/>
  <ellipse cx="60" cy="73" rx="6.5" ry="4.8" fill="#5a3f36"/>
  <path d="M60 77.5v4.5M53.5 83c3.5 4 9.5 4 13 0" stroke="#5a3f36" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <circle cx="42" cy="60" r="4.6" fill="#5a3f36"/><circle cx="78" cy="60" r="4.6" fill="#5a3f36"/>
  <ellipse cx="32" cy="76" rx="8" ry="5" fill="#f6a9bf" opacity="0.75"/><ellipse cx="88" cy="76" rx="8" ry="5" fill="#f6a9bf" opacity="0.75"/>
  <path d="M96 20C88 8 76 10 78 18C80 24 90 22 96 20ZM96 20C104 8 116 10 114 18C112 24 102 22 96 20Z" fill="#f29bb8" stroke="#d8708f" stroke-width="1.5"/>
  <circle cx="96" cy="20" r="4" fill="#d8708f"/>
</svg>`);
const balloon = (fill: string) =>
  svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 150"><path d="M30 80c-4 10 6 16 0 26s6 16 0 26" stroke="#c9a27e" stroke-width="1.4" fill="none"/><ellipse cx="30" cy="40" rx="26" ry="32" fill="${fill}"/><ellipse cx="20" cy="26" rx="6" ry="10" fill="#fff" opacity="0.55" transform="rotate(-20 20 26)"/><path d="M26 72h8l-2 6h-4z" fill="${fill}"/></svg>`);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff1f5" }}>
        {/* Photo, framed in an arch */}
        <div
          style={{
            display: "flex",
            width: 470,
            height: "100%",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "linear-gradient(180deg, #fde3ec 0%, #fff4d6 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 392,
              height: 568,
              padding: 10,
              borderRadius: "196px 196px 0 0",
              background: "linear-gradient(180deg, #f6b9cb 0%, #f0d999 60%, #f8d76f 100%)",
            }}
          >
            <img
              src={photoSrc}
              alt=""
              width={372}
              height={558}
              style={{ objectFit: "cover", objectPosition: "50% 30%", borderRadius: "186px 186px 0 0" }}
            />
          </div>
        </div>

        {/* Wording */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #fffaf0 0%, #fff8fa 55%, #fff1f5 100%)",
            color: "#5a3f36",
          }}
        >
          <img src={balloon("#f6b9cb")} alt="" width={46} height={115} style={{ position: "absolute", top: 34, left: 40 }} />
          <img src={balloon("#f8d76f")} alt="" width={56} height={140} style={{ position: "absolute", top: 18, right: 46 }} />
          <img src={star} alt="" width={20} height={20} style={{ position: "absolute", top: 150, left: 120 }} />
          <img src={star} alt="" width={14} height={14} style={{ position: "absolute", top: 70, right: 170 }} />
          <img src={star} alt="" width={16} height={16} style={{ position: "absolute", bottom: 120, right: 70 }} />

          <div style={{ fontFamily: "Jost", fontSize: 22, letterSpacing: 7, color: "#86601a", textTransform: "uppercase" }}>
            You are invited to the
          </div>
          <div style={{ fontFamily: "Playfair", fontSize: 74, letterSpacing: 4, color: "#b04d6c", marginTop: 6 }}>CHRISTENING</div>
          <div style={{ fontFamily: "Pinyon", fontSize: 40, color: "#8b6a4f", marginTop: -8 }}>of our little one</div>
          <div style={{ fontFamily: "Pinyon", fontSize: 84, color: "#b04d6c", marginTop: 4, lineHeight: 1.1 }}>{event.babyName}</div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
            <div style={{ width: 90, height: 2, background: "#e0b85c" }} />
            <img src={heart("#ee9ab3")} alt="" width={22} height={20} style={{ margin: "0 14px" }} />
            <div style={{ width: 90, height: 2, background: "#e0b85c" }} />
          </div>

          <div style={{ fontFamily: "Playfair", fontSize: 30, letterSpacing: 2, marginTop: 18 }}>
            {`${dateLine} · ${event.ceremony.time}`}
          </div>
          <div style={{ fontFamily: "Jost", fontSize: 22, color: "#75594f", marginTop: 8 }}>
            {`${event.ceremony.venue} · ${event.city}`}
          </div>

          <img src={bear} alt="" width={96} height={90} style={{ position: "absolute", bottom: 22, left: 40 }} />
          <img src={heart("#f6b9cb")} alt="" width={26} height={24} style={{ position: "absolute", bottom: 46, right: 120 }} />
          <img src={heart("#f1c34c")} alt="" width={18} height={16} style={{ position: "absolute", bottom: 86, right: 84 }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pinyon", data: script, style: "normal", weight: 400 },
        { name: "Playfair", data: display, style: "normal", weight: 500 },
        { name: "Jost", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
