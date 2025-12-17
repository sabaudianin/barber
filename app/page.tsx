import { Hero } from "@/components/hero/Hero";
import { AboutUs } from "@/components/about/AboutUs";
import { Cta } from "@/components/cta/Cta";
import { Team } from "@/components/team/Team";

export default function Home() {
  return (
    <section className="grid min-h-screen bg-zinc-50 font-sans dark:bg-black ">
      <Hero />
      <Cta />
      <AboutUs />
      <Team />
    </section>
  );
}
