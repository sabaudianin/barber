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
        <p className="font-bokor py-2 indent-2 text-zinc-400">
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
        <ul className="p-2 list-disc list-inside  space-y-1 mt-8 tracking-[0.25em]  bg-stone-800 font-mono text-xs text-zinc-300">
          <h2 className=" py-2 text-center font-lime text-xl text-white">
            Why Choose Us?
          </h2>
          <li className="font-sans">
            Skilled barbers with a passion for the craft
          </li>
          <li className="font-mono">
            Expert beard shaping and grooming rituals
          </li>
          <li className="">Complimentary coffee and a relaxed vibe</li>
          <li className="">Authentic Saska Kępa atmosphere</li>
          <li className="">No rush - quality and detail first</li>
        </ul>
      </div>
    </section>
  );
};
