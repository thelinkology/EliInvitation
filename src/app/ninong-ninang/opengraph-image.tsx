import { event } from "@/config/event";
import { renderShareCard, SHARE_CARD_SIZE } from "@/lib/shareCard";

/** Link-preview picture for the godparent invitation. */
export const alt = `Will you be my Ninong or Ninang? A special request from ${event.babyName}`;
export const size = SHARE_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderShareCard({ eyebrow: "Will you be my", title: "NINONG", subtitle: "or Ninang?" });
}
