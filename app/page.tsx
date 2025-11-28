import Image from "next/image";
import { Hero } from "@/components/hero/Hero";
import { AboutUs } from "@/components/about/AboutUs";
import { Cta } from "@/components/cta/Cta";

export default function Home() {
  return (
    <section className="grid min-h-screen  mx-auto  bg-zinc-50 font-sans dark:bg-black">
      <Hero />
      <Cta />
      <AboutUs />
    </section>
  );
}
