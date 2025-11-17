"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  staggerContainer,
  slideInRightScale,
  slideInLeftScale,
  fadeInScaleUp,
  slideInRight,
  slideInLeft,
} from "@/lib/motion";

export const Hero = () => {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr] place-items-center min-h-[500px]">
      <div className="absolute inset-0 ">
        <Image
          src="/images/poster.jpg"
          alt="barber"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="col-start-2 text-right space-y-12 z-10 "
      >
        <motion.p
          variants={slideInRight}
          className="uppercase tracking-[0.3em] text-sm "
        >
          since 2014
        </motion.p>
        <motion.p
          variants={slideInLeft}
          className="text-[10px] uppercase tracking-[0.25em] text-zinc-400"
        >
          classic • modern • razor
        </motion.p>
        <motion.h2
          variants={slideInRightScale}
          className="font-lime text-4xl lg:text-6xl"
        >
          WARSAW BARBER SHOP
        </motion.h2>
        <motion.h3
          variants={slideInLeftScale}
          className="font-ballet tracking-[.2em]"
        >
          Klasyczne strzyżenia, trymowanie brody, hot towel shave i klimat, dla
          którego chce się wracać.
        </motion.h3>
        <motion.button
          variants={fadeInScaleUp}
          onClick={() => console.log("CLICK")}
          className="font-mono rounded py-2 px-4 bg-amber-400/60 font-semibold shadow-lg shadow-amber-400/30"
        >
          Umów wizytę
        </motion.button>
      </motion.div>
    </section>
  );
};
