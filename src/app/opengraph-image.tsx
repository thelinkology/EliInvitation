import { event } from "@/config/event";
import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/shareCard";

/** Link-preview picture for the general invitation (and personal /i/ links). */
export const alt = `You're invited to the Christening of ${event.babyName}`;
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  // Regular guests go straight to the reception.
  return renderShareCard({
    eyebrow: "You are invited to the",
    title: "CHRISTENING",
    subtitle: "of our little one",
    time: event.reception.startTime,
    venue: event.reception.venue,
  });
}
