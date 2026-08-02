import "./globals.css";
import React from "react";
import { fraunces, cabinet } from "@/styles/fonts";
import { Providers } from "./providers";

export const metadata = {
  title: "Blue Ceylon — Sri Lanka Stays & Verified Discovery",
  description: "Discover verified boutique hotels, homestays, private guides, and tours in Sri Lanka.",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/images/favicon.ico",
    apple: "/images/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192",
        url: "/images/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome-512",
        url: "/images/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

/**
 * Root layout — minimal HTML shell only.
 * Navbar + Footer are provided by the (public) route group layout.
 * Dashboard and Admin have their own isolated full-screen layouts.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${cabinet.variable}`} suppressHydrationWarning>
      <body 
        className="min-h-screen flex flex-col antialiased bg-[#FDF6EC] dark:bg-[#081419] text-[#0E1B22] dark:text-[#EAF2F4] transition-colors"
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}