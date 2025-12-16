import React from "react";
import Image from "next/image";

export const AboutUs = () => {
  return (
    <section className="p-2 bg-stone-700">
      <div>
        <h2 className="font-bokor py-2 text-xl text-center">
          Welcome to Barber House Saska Kępa, a modern barbershop rooted in the
          classic craft of men&apos;s grooming.
        </h2>
        <p className="font-bokor py-2 indent-2 text-zinc-400 text-lg">
          Located in the heart of Warsaw&apos;s artistic Saska Kępa district, we
          blend skilled craftsmanship, a relaxed atmosphere, and a passion for
          precision. We specialize in clean fades, sharp cuts, and tailored
          beard work, combining traditional techniques with today;&apos;s
          trends.
        </p>

        <div className=" p-2 w-1/2 mx-auto  sepia">
          <Image
            src="/images/vintage.png"
            width={200}
            height={100}
            alt="Scissors avatar"
            className=" mx-auto sepia"
          />
        </div>
        <article className="grid lg:grid-cols-2 lg:items-stretch">
          <ul className="p-2 list-inside  space-y-1 tracking-[0.25em] bg-stone-800 lg:h-full flex flex-col font-mono text-xs text-zinc-300 mt-auto">
            <h2 className="py-2 text-center font-lime text-xl text-white">
              Why Choose Us?
            </h2>
            <li className="font-sans">
              <span className="text-xl">💈</span>Skilled barbers with a passion
              for the craft
            </li>
            <li className="font-mono">
              <span className="text-xl">💈</span>Expert beard shaping and
              grooming rituals
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>Complimentary coffee and a
              relaxed vibe
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>Authentic Saska Kępa atmosphere
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>No rush - quality and detail
              first
            </li>
          </ul>
          <div className="relative h-80 p-2 lg:h-full">
            <div className="w-full absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_50%,_rgba(0,0,0,0.75)_90%,_rgba(0,0,0,0.99)_100%)] rounded z-10" />
            <Image
              src="/images/equipment.jpg"
              fill
              alt="Barber equipment"
              className="object-cover rounded"
              sizes="(min-width: 800px) 50vw, 100vw"
            />
          </div>
        </article>
      </div>
    </section>
  );
};
