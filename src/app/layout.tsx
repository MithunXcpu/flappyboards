import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const SITE_URL = "https://flappyboards.xyz";

export const metadata: Metadata = {
  title: "FlappyBoards — Turn any TV into a retro split-flap display",
  description:
    "A hyper-realistic Vestaboard split-flap display emulator with 3D animations and synced audio. Free and open source. Made by Cozy.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "FlappyBoards",
    description: "Turn any TV into a retro split-flap display. Free & open source.",
    type: "website",
    url: SITE_URL,
    siteName: "FlappyBoards",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlappyBoards",
    description: "Turn any TV into a retro split-flap display. Free & open source.",
    creator: "@vec0zy",
  },
  authors: [{ name: "Cozy", url: "https://x.com/vec0zy" }],
  creator: "Cozy",
  keywords: [
    "split-flap display",
    "vestaboard",
    "retro display",
    "airport terminal",
    "flip board",
    "tv display",
    "open source",
  ],
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
