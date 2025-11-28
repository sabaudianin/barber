import type { Metadata } from "next";
import {
  limelight,
  ballet,
  geistMono,
  geistSans,
  bokor,
  diplomata,
} from "@/lib/fonts";
import "../styles/globals.css";

import { Navbar } from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Barber",
  description: "Barber Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${limelight.variable} ${ballet.variable} ${geistMono.variable} ${diplomata.variable} ${bokor.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
