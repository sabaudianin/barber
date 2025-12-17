"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { navLinks } from "@/lib/navigationLinks";
import { usePathname } from "next/navigation";
import { VisitButton } from "@/elements/visitButton/VisitButton";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

const isLinkActive = (href: string, pathname: string) => {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}`);
};

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleOpen = () => setMobileOpen((prev) => !prev);
  const close = () => setMobileOpen(false);
  const pathname = usePathname();

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
      <header className="relative z-20 h-20 flex items-center justify-between px-2 md:px-8 py-4 md:py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <p className="font-diplomata text-xl text-[var(--color-accent)] font-bold tracking-widest">
            Barber Shop
          </p>
        </div>

        <div className="md:hidden ">
          <button
            onClick={toggleOpen}
            className="relative p-2 rounded tranition-transform active:scale-95"
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={mobileOpen}
          >
            <GiHamburgerMenu
              className={`text-2xl font-bold text-[var(--color-accent)] transition-all duration-300 ease-out ${
                mobileOpen
                  ? "opacity-0 scale-75 rotate-90"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />

            <MdClose
              className={`absolute inset-0 m-auto text-2xl font-bold text-[var(--color-accent)] transition-all duration-300 ease-out ${
                mobileOpen ? "opacity-100  rotate-0" : "opacity-0  -rotate-90"
              }`}
            />
          </button>
        </div>

        <nav
          className={`hidden md:block font-semibold uppercase tracking-[0.05em] text-zinc-300 font-lime  `}
        >
          <ul className="flex gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.url, pathname);
              return (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className={`transition-colors duration-300 hover:text-[var(--accent-light)] ${
                      active && "text-[var(--color-accent)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          onClick={close}
          className={[
            "md:hidden absolute left-0 top-20 right-0 z-10 h-screen",

            "bg-black/50 transition-opacity",
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
        />

        <nav
          className={`md:hidden top-20 left-0 fixed space-y-8 h-[calc(100vh-5rem)] w-72 p-8 bg-stone-900/90 backdrop-blur transition-transform duration-500 ease-out z-12 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.url, pathname);
              return (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className={`transition-colors duration-300 hover:text-[var(--accent-light)] ${
                      active && "text-[var(--color-accent)]"
                    }`}
                    onClick={close}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
          <VisitButton />
        </nav>
      </header>
    </section>
  );
};
