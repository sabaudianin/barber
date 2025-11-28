import {
  Geist,
  Geist_Mono,
  Limelight,
  Ballet,
  Diplomata,
  Bokor,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const ballet = Ballet({
  variable: "--font-ballet",
  weight: "400",

  subsets: ["latin"],
});
export const bokor = Bokor({
  variable: "--font-bokor",
  weight: "400",

  subsets: ["latin"],
});
export const diplomata = Diplomata({
  variable: "--font-diplomata",
  weight: "400",

  subsets: ["latin"],
});
export const limelight = Limelight({
  variable: "--font-lime",
  weight: "400",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
