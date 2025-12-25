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
  title: {
    default: "Outfitted - Din garderobe, perfeksjonert",
    template: "%s | Outfitted",
  },
  description: "AI-drevet antrekksforslag og garderobeorganisering. Planlegg antrekk, få stilråd basert på vær og anledning.",
  keywords: ["garderobe", "antrekk", "mote", "stil", "klær", "outfit", "AI"],
  authors: [{ name: "Outfitted" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Outfitted - Din garderobe, perfeksjonert",
    description: "AI-drevet antrekksforslag og garderobeorganisering",
    type: "website",
    locale: "nb_NO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
