import Image from "next/image";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <section className="grid min-h-screen  mx-auto  bg-zinc-50 font-sans dark:bg-black">
      <Hero />
    </section>
  );
}
