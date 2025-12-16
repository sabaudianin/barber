"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { VisitButton } from "@/elements/visitButton/VisitButton";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleOpen = () => setMobileOpen((prev) => !prev);
  const close = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: { key: string }) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  return (
    <section>
      <header className="relative z-20 h-20  flex items-center justify-between px-2 md:px-8 py-4 md:py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <p className="font-diplomata text-xl text-[var(--color-accent)] font-bold tracking-widest">
            Barber Shop
          </p>
        </div>

        <div className="md:hidden">
          <button onClick={toggleOpen}>
            {mobileOpen ? <MdClose /> : <GiHamburgerMenu />}
          </button>
        </div>

        <nav
          className={`hidden md:flex gap-8 font-semibold uppercase tracking-[0.05em] text-zinc-300 font-lime  `}
        >
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
        </nav>

        <div
          onClick={close}
          className={[
            "md:hidden absolute left-0 right-0 z-10 h-screen",

            "bg-black/50 transition-opacity",
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
        />

        {mobileOpen && (
          <nav
            className={`md:hidden top-20 left-0 fixed flex flex-col gap-8 h-[calc(100vh-5rem)] w-72 p-8 bg-stone-900/90 backdrop-blur transition-transform duration-900 ease-out z-12 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
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
