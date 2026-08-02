import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const cabinet = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});