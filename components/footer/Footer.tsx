import { FaWhatsapp, FaCalendarAlt } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";

export const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* GRID: mobile = 1 kolumna, duże = 3 kolumny */}
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Kolumna 1 */}
          <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <p className="font-diplomata text-xl font-bold tracking-widest text-[var(--color-accent)]">
              Barber Shop
            </p>
            <p className="font-lime text-neutral-300">
              Kompletne usługi barberskie na Saskiej Kępie w Warszawie
            </p>

            <div className="mt-2 space-y-1 text-sm text-neutral-300">
              <p>PON-PT 10-18</p>
              <p>SOB 9-15</p>
            </div>
          </div>

          {/* Kolumna 2 */}
          <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <p className="font-diplomata text-base">Lokalizacja:</p>
            <p className="text-neutral-300">
              ul. Zwyciężców 15/12, Saska Kępa, 02-599 Warszawa
            </p>

            <div className="mt-2 space-y-1 text-sm text-neutral-300">
              <p>barbershop@saska.pl</p>
              <p>+48 793 386 445</p>
            </div>
          </div>

          {/* Kolumna 3 */}
          <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <p className="font-diplomata text-base">Pytania:</p>

            <FaWhatsapp className="text-4xl text-green-500" />

            <p className="text-neutral-300">
              Dodaj nas na WhatsAppie lub po prostu zadzwoń
            </p>

            <a
              href="tel:+48793386445"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-neutral-100 ring-1 ring-white/10 transition hover:bg-neutral-800 lg:justify-start"
            >
              <BsFillTelephoneFill className="text-green-500" />
              +48 793 386 445
            </a>

            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm text-neutral-100 ring-1 ring-white/10 transition hover:bg-neutral-800 lg:justify-start"
            >
              <FaCalendarAlt className="text-blue-500" />
              Umów wizytę on-Line
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-neutral-400">
          <hr className="mb-2" />© {new Date().getFullYear()} Barber Shop -
          Saska Kępa
        </div>
      </div>
    </footer>
  );
};
