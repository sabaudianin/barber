"use client";
import Link from "next/link";
import { useState } from "react";

import { VisitButton } from "@/elements/visitButton/VisitButton";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleOpen = () => setMobileOpen((prev) => !prev);

  return (
    <section>
      <header className="relative z-20 flex items-center justify-between px-2 md:px-8 py-6 md:py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <p className="font-diplomata text-xl text-[var(--color-accent)] font-bold tracking-widest">
            Barber Shop
          </p>
        </div>
        <div>
          <button onClick={toggleOpen}>
            {mobileOpen ? <GiHamburgerMenu /> : <MdClose />}
          </button>
        </div>

        <nav className="hidden md:flex gap-8 font-semibold uppercase tracking-[0.05em] text-zinc-300 font-lime  ">
          <button className="hover:text-[var(--accent-light)] transition">
            Usługi
          </button>
          <button className="hover:text-[var(--accent-light)] transition">
            Cennik
          </button>
          <button className="hover:text-[var(--accent-light)] transition">
            Galeria
          </button>
          <button className="hover:text-[var(--accent-light)] transition">
            Kontakt
          </button>
          <VisitButton />
        </nav>

        {mobileOpen && (
          <nav className="flex flex-col absolute">
            {" "}
            <button className="hover:text-[var(--accent-light)] transition">
              Usługi
            </button>
            <button className="hover:text-[var(--accent-light)] transition">
              Cennik
            </button>
            <button className="hover:text-[var(--accent-light)] transition">
              Galeria
            </button>
            <button className="hover:text-[var(--accent-light)] transition">
              Kontakt
            </button>
            <VisitButton />
          </nav>
        )}
      </header>
    </section>
  );
};
