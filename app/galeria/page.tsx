import Image from "next/image";

export default function Galeria() {
  return (
    <section className="p-2">
      <p className="text-center text-xl p-3 font-bold font-lime">Galeria</p>
      <div className="grid gap-4 lg:gap-8">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900/70 rounded p-2">
          <Image
            src="/images/bla.jpg"
            alt="fryzjer-galeria"
            fill
            sizes="auto"
            className="object-cover sepia brightness-90 contrast-125 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden  rounded p-2">
          <Image
            src="/images/oga.jpg"
            alt="fryzjer-galeria"
            fill
            sizes="auto"
            className=" object-cover sepia brightness-50 contrast-125 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded p-2">
          <Image
            src="/images/lolo0.jpg"
            alt="fryzjer-galeria"
            fill
            sizes="auto"
            className=" object-cover sepia brightness-60 contrast-125 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900/70 rounded p-2">
          <Image
            src="/images/mos.jpg"
            alt="fryzjer-galeria"
            fill
            sizes="auto"
            className=" object-cover sepia brightness-60 contrast-125 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <p className="p-2 text-center text-white/40">All Foto Pixabay</p>
    </section>
  );
}
