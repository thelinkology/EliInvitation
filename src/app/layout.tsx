import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script, Playfair_Display } from "next/font/google";

import { event, eventDateLong } from "@/config/event";
import "./globals.css";

const pinyon = Pinyon_Script({ variable: "--font-pinyon", weight: "400", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", weight: ["400", "500", "600"], subsets: ["latin"] });

const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Christening of ${event.babyName}`,
  description: `You are invited to the Christening of ${event.babyName} on ${eventDateLong}.`,
  openGraph: {
    title: `You're invited · Christening of ${event.babyName}`,
    description: `${eventDateLong} · ${event.ceremony.venue}`,
    images: [{ url: event.photos.hero.src, width: event.photos.hero.width, height: event.photos.hero.height }],
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fde4ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pinyon.variable} ${cormorant.variable} ${jost.variable} ${playfair.variable} antialiased`}>
      <body className="page-backdrop min-h-dvh">{children}</body>
    </html>
  );
}
