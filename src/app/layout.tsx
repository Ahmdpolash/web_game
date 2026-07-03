import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forest Memory Adventure — Cute Animal Matching Game",
  description: "Test your memory by matching pairs of cute animal cards. Challenge your high scores and share your accuracy on social media!",
  openGraph: {
    title: "Forest Memory Adventure — Cute Animal Matching Game",
    description: "Test your memory by matching pairs of cute animal cards. Challenge your high scores!",
    siteName: "Forest Memory",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Forest Memory Adventure Game Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forest Memory Adventure — Cute Animal Matching Game",
    description: "Test your memory by matching pairs of cute animal cards. Challenge your high scores!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
