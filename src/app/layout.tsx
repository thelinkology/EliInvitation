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

// Link previews must point at the address guests actually receive.
const siteUrl = process.env.SITE_URL || event.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Christening of ${event.babyName}`,
  description: `You are invited to the Christening of ${event.babyName} on ${eventDateLong}.`,
  // The preview picture itself comes from src/app/opengraph-image.tsx.
  openGraph: {
    title: `You're invited · Christening of ${event.babyName}`,
    description: `${eventDateLong} · ${event.ceremony.time} · ${event.ceremony.venue}`,
    url: "/",
    siteName: `Christening of ${event.babyName}`,
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `You're invited · Christening of ${event.babyName}`,
    description: `${eventDateLong} · ${event.ceremony.venue}`,
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
