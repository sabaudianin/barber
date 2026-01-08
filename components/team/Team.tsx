import React from "react";
import Image from "next/image";

export const barbers = [
  {
    name: "Klaudia",
    img: "/images/klaudia.jpg",
    desc: "Specjalistka od klasycznych cięć i perfekcyjnych fade'ów. Spokój, precyzja i dopracowane detale.",
  },
  {
    name: "Maja",
    img: "/images/maja.jpg",
    desc: "Mistrzyni brody i konturu. Stawia na naturalny efekt, dopasowanie do twarzy i świetną pielęgnację.",
  },
  {
    name: "Kacper",
    img: "/images/kacper.jpg",
    desc: "Szybkie, równe cięcia i czyste przejścia. Lubi nowoczesne formy i ostre wykończenia.",
  },
  {
    name: "Marek ",
    img: "/images/marek.jpg",
    desc: "Klasyka barberska: nożyczki, brzytwa i porządny rytuał. Idealny wybór na elegancki, ponadczasowy look.",
  },
] as const;

export const Team = () => {
  return (
    <section className="p-2 py-8 max-w-7xl mx-auto px-4">
      <article>
        <h3 className="font-lime text-2xl py-4 text-center">
          Poznaj naszych barberów:
        </h3>
        <ul className="grid  gap-6 sm:gap-8 lg:grid-cols-2">
          {barbers.map((barb) => (
            <li
              key={barb.name}
              className=" group mx-auto bg-stone-700/70  rounded-2xl border border-[var(--color-accent)] shadow-sm transition hover:border-amber-300 hover:scale-101 duration-300 "
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={barb.img}
                  alt={barb.name}
                  fill
                  className="object-cover sepia transition-transform duration-500 "
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="p-5 sm:p-6">
                <h4 className="text-center text-2xl sm:text-3xl font-extrabold font-ballet tracking-[6px] text-white">
                  {barb.name}
                </h4>

                <div className="mx-auto my-3 h-px w-24 bg-[var(--color-accent)]/60" />

                <p className="mx-auto max-w-prose text-center font-lime text-xs sm:text-sm tracking-widest text-zinc-200/90">
                  {barb.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};
