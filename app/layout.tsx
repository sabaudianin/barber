import type { Metadata } from "next";
import { limelight, ballet, diplomata } from "@/lib/fonts";
import "../styles/globals.css";

import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import Provider from "./provider";

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
        className={` ${limelight.variable} ${ballet.variable}  ${diplomata.variable} antialiased`}
      >
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
