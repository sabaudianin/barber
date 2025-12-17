"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  slideInLeft,
  slideInRight,
  fadeInScaleUp,
  staggerContainer,
  listItemPop,
} from "@/lib/motion";

export const AboutUs = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="p-2 bg-stone-700 max-w-7xl mx-auto px-4">
      <motion.article
        className="grid gap-10 items-center lg:grid-cols-[1fr_auto_1fr] py-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.h2
          className="font-lime py-2 leading-relaxed tracking-widest"
          variants={reduceMotion ? undefined : slideInLeft}
        >
          Witamy w Barber Shop Saska Kępa - nowoczesnym barbershopie
          zakorzenionym w klasycznym rzemiośle męskiej pielęgnacji.
        </motion.h2>

        <motion.div
          className="relative mx-auto h-64 w-64 lg:w-80 lg:h-80 sepia"
          variants={reduceMotion ? undefined : fadeInScaleUp}
          whileHover={reduceMotion ? undefined : { rotate: -1, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <Image
            src="/images/vintage.png"
            fill
            alt="Scissors avatar"
            className="object-contain sepia"
            sizes="(min-width: 1024px) 320px, 256px"
          />
        </motion.div>

        <motion.p
          className="font-lime py-2 indent-2 tracking-wide"
          variants={reduceMotion ? undefined : slideInRight}
        >
          Zlokalizowani w sercu artystycznej warszawskiej Saskiej Kępy, łączymy
          mistrzowskie rzemiosło, swobodną atmosferę i pasję do precyzji.
          Specjalizujemy się w czystych fade&apos;ach, wyrazistych cięciach oraz
          indywidualnie dopasowanej stylizacji brody, łącząc tradycyjne techniki
          z nowoczesnymi trendami.
        </motion.p>
      </motion.article>

      <article className="grid lg:grid-cols-2 lg:items-stretch">
        <motion.ul
          className="p-2 list-inside  space-y-1 tracking-[0.25em] bg-stone-800 lg:h-full flex flex-col font-mono text-xs text-zinc-300 mt-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2
            className="py-2 text-center font-lime text-xl text-white"
            variants={reduceMotion ? undefined : fadeInScaleUp}
          >
            Dlaczego My?
          </motion.h2>
          {[
            "Doświadczeni barberzy z pasją do swojego fachu",
            "Profesjonalne modelowanie brody i rytuały pielęgnacyjne",
            "Darmowa kawa i luźna, relaksująca atmosfera",
            "Autentyczny klimat Saskiej Kępy",
            "Bez pośpiechu - jakość i dbałość o detale na pierwszym miejscu",
          ].map((txt) => (
            <motion.li
              key={txt}
              className="font-sans"
              variants={listItemPop}
            >
              <span className="text-xl">💈</span>
              {txt}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div
          className="relative h-80 p-2 lg:h-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={reduceMotion ? undefined : slideInRight}
        >
          <div className="w-full absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_50%,_rgba(0,0,0,0.75)_90%,_rgba(0,0,0,0.99)_100%)] rounded z-10" />
          <Image
            src="/images/equipment.jpg"
            fill
            alt="Barber equipment"
            className="object-cover rounded"
            sizes="(min-width: 800px) 50vw, 100vw"
          />
        </motion.div>
      </article>
    </section>
  );
};
