"use client";

import { VisitButton } from "@/elements/visitButton/VisitButton";

export const Navbar = () => {
  return (
    <section>
      <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-4 md:py-6">
        <div className="flex items-center gap-3">
          <p className="font-diplomata text-xl">Barber</p>
        </div>

        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-zinc-300">
          <button className="hover:text-amber-300 transition">Usługi</button>
          <button className="hover:text-amber-300 transition">Cennik</button>
          <button className="hover:text-amber-300 transition">Galeria</button>
          <button className="hover:text-amber-300 transition">Kontakt</button>
          <VisitButton />
        </nav>
      </header>
    </section>
  );
};
