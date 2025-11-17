import Image from "next/image";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="p-2">
        <Hero />
      </main>
    </div>
  );
}
