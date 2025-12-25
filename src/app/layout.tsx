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
    default: "Outfitted - Your wardrobe, perfected",
    template: "%s | Outfitted",
  },
  description: "AI-powered outfit suggestions and wardrobe organization. Plan outfits, get style advice based on weather and occasion.",
  keywords: ["wardrobe", "outfit", "fashion", "style", "clothes", "AI"],
  authors: [{ name: "Outfitted" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Outfitted - Your wardrobe, perfected",
    description: "AI-powered outfit suggestions and wardrobe organization",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
