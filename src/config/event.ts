/**
 * Everything guests read on the invitation lives here.
 *
 * Values marked TODO still need your input. Nothing in this file is secret:
 * it ships to every visitor, so never put phone numbers or other private
 * information here (those belong in your Google Sheet).
 */

export const event = {
  babyName: "Zane Emillienne",
  /** The invitation's public address. Used for link previews when the link is shared. */
  siteUrl: "https://eli.link-ui.com",
  babyFirstName: "Zane",
  /** "her" or "him" — used in sentences like "welcoming her into the family of God". */
  babyPronoun: "her" as "her" | "him",
  /** TODO: Parents' names, shown in the closing signature, e.g. "Juan & Maria". */
  parents: "Mommy & Daddy",
  /** TODO: Optional hashtag for photos. Set to "" to hide it. */
  hashtag: "#babyEli",

  /**
   * Background music, played after the guest taps the envelope. Put an MP3 you
   * have the rights to use in /public/music and set its path, e.g. "/music/lullaby.mp3".
   * Leave src as "" to hide the player.
   */
  music: { src: "", title: "Zane's Christening", artist: "" },

  /** TODO: A short letter from the parents, shown near the end. */
  parentsMessage: [
    "As we celebrate the beginning of Zane's journey of faith, we would be deeply honored to have you with us on this very special day. Your presence, love, and prayers will make this precious occasion even more meaningful to our family.",
    "We look forward to celebrating this beautiful blessing with you and creating cherished memories together.",
  ],

  /** Ceremony start, with the Philippines UTC offset (+08:00). */
  startsAt: "2026-12-06T12:00:00+08:00",
  /** Celebration end — used for the "Add to calendar" button. */
  endsAt: "2026-12-06T16:00:00+08:00",
  /** Time zone used to display every date and time on the site. */
  timeZone: "Asia/Manila",
  /** TODO: Last day to RSVP (currently two weeks before). Submissions are refused after this moment. */
  rsvpDeadline: "2026-11-08T23:59:59+08:00",
  /**
   * Most people one response can bring from the shared links (/ and /ninong-ninang),
   * including the guest. Personal /i/CODE links use "Max Guests" from the Sheet instead.
   */
  openRsvpMaxGuests: 5,

  /** Short location shown under the date in the hero. */
  city: "Tierra Vista, Marikina City",

  ceremony: {
    title: "Holy Baptism",
    venue: "Jesus Church",
    address: "#17 St. Paul Street, Tierra Vista, Nangka, Marikina City",
    time: "12:00 NN",
    note: "Kindly arrive 15–20 minutes early",
    /** Optional: a photo in /public/images (e.g. "/images/church.jpg"). Leave "" to show the illustration. */
    image: "",
    /** Optional: replace with the "Share → Copy link" URL from Google Maps for a precise pin. */
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Jesus+Church+17+St.+Paul+Street+Tierra+Vista+Nangka+Marikina+City",
  },

  reception: {
    title: "Celebration",
    venue: "Tierra Vista Clubhouse",
    address: "#8 St. Paul Street, Tierra Vista, Nangka, Marikina City",
    time: "1:00 PM – 4:00 PM",
    note: "Right beside Jesus Church",
    /** When guests should arrive — regular guests skip the ceremony and come straight here. */
    startsAt: "2026-12-06T13:00:00+08:00",
    startTime: "1:00 PM",
    /** Optional: a photo in /public/images. Leave "" to show the illustration. */
    image: "",
    /** Optional: replace with the "Share → Copy link" URL from Google Maps for a precise pin. */
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Tierra+Vista+Clubhouse+8+St.+Paul+Street+Tierra+Vista+Nangka+Marikina+City",
  },

  attire: {
    godparents: {
      label: "Ninongs & Ninangs",
      colors: "White",
      palette: [{ name: "White", hex: "#FFFFFF" }],
    },
    guests: {
      label: "Guests",
      colors: "Yellow or Baby Pink",
      palette: [
        { name: "Yellow", hex: "#FBE8AB" },
        { name: "Baby Pink", hex: "#F6BFD0" },
      ],
    },
  },

  giftGuide: {
    intro:
      "Your presence and prayers are the greatest gifts. Should you wish to bless Zane with something more, here are a few things she'll love:",
    items: [
      /** TODO: update the diaper size closer to the date — babies grow fast! */
      { icon: "diaper", title: "Rascals Diapers", detail: "Size: to follow" },
      { icon: "wipes", title: "EQ Water Wipes", detail: "" },
      { icon: "bottle", title: "Mustela Products", detail: "Diaper Rash Cream · Cleansing Water" },
      { icon: "envelope", title: "Monetary Gifts", detail: "For Zane's future" },
    ],
    /**
     * Optional QR codes for monetary gifts (e.g. GCash, bank). Save the QR image in
     * /public/images and add { label: "GCash", src: "/images/gcash-qr.png" }. Empty = hidden.
     */
    qrCodes: [] as { label: string; src: string }[],
  },

  /** Health reminders shown as icons. TODO: edit, remove, or reorder as you like. */
  protocol: {
    intro:
      "To keep our little one and all our guests safe and well, we kindly ask everyone to observe these simple reminders. Those with colds or flu-like symptoms are gently asked to wear a face mask.",
    items: [
      { icon: "nokiss", label: "No kissing the baby" },
      { icon: "sanitize", label: "Sanitize your hands" },
      { icon: "nosmoking", label: "No smoking or vaping" },
    ],
  },

  /** Photos in /public/images. Alt text is read aloud by screen readers. */
  photos: {
    /** Photo used in the link-preview picture (src/app/opengraph-image.tsx). */
    share: { src: "/images/OriginalImage.jpg" },
    hero: {
      src: "/images/AIedit4.jpg",
      alt: "Zane smiling in a teddy-bear bonnet, surrounded by teddy bears and roses",
      width: 896,
      height: 1200,
    },
    saveTheDate: { src: "/images/AIedit1.jpg", alt: "Zane in a sparkly tutu resting on soft clouds", width: 896, height: 1200 },
    godparent: { src: "/images/AIedit3.jpg", alt: "Zane in a pink cape and star headband on a cloud", width: 896, height: 1200 },
    rsvp: { src: "/images/AIedit2.jpg", alt: "Zane in a pink knit outfit among roses and baby's breath", width: 1264, height: 843 },
    message: { src: "/images/OriginalImage.jpg", alt: "Zane smiling in a cream teddy-bear hood", width: 1184, height: 1776 },
  },
} as const;

export type EventConfig = typeof event;

const dateFmt = new Intl.DateTimeFormat("en-PH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: event.timeZone,
});

const shortDateFmt = new Intl.DateTimeFormat("en-PH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: event.timeZone,
});

function dayMonthYear(date: Date): string {
  const parts = Object.fromEntries(shortDateFmt.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.day} · ${parts.month} · ${parts.year}`;
}

const deadlineFmt = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: event.timeZone,
});

/** "Sunday, December 6, 2026" */
export const eventDateLong = dateFmt.format(new Date(event.startsAt));
/** "06 · 12 · 2026" */
export const eventDateDots = dayMonthYear(new Date(event.startsAt));
/** "November 22, 2026" */
export const rsvpDeadlineLabel = deadlineFmt.format(new Date(event.rsvpDeadline));

export const monogram = event.babyFirstName.trim().charAt(0).toUpperCase() || "♡";

/**
 * What each kind of invitee attends. Ninongs and Ninangs come to the church
 * ceremony and the reception; regular guests go straight to the reception.
 */
export function scheduleFor(isGodparent: boolean) {
  return isGodparent
    ? { startsAt: event.startsAt, startTime: event.ceremony.time, venue: event.ceremony.venue, address: event.ceremony.address }
    : { startsAt: event.reception.startsAt, startTime: event.reception.startTime, venue: event.reception.venue, address: event.reception.address };
}

/** Google Calendar "add event" link: ceremony + reception for godparents, reception only for guests. */
export function googleCalendarUrl(isGodparent: boolean): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const plan = scheduleFor(isGodparent);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Christening of ${event.babyName}`,
    dates: `${fmt(new Date(plan.startsAt))}/${fmt(new Date(event.endsAt))}`,
    details: isGodparent
      ? `${event.ceremony.title} at ${event.ceremony.venue} (${event.ceremony.time}), followed by the celebration at ${event.reception.venue} (${event.reception.time}).`
      : `Christening celebration at ${event.reception.venue} (${event.reception.time}).`,
    location: `${plan.venue}, ${plan.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
