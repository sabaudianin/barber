"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  staggerContainer,
  slideInRightScale,
  slideInLeftScale,
  longFadeInScaleUp,
  slideInLeft,
} from "@/lib/motion";

export const Cta = () => {
  return (
    <section className="p-4 max-w-hd mx-auto shadow-sm  my-4">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4 items-center  "
      >
        <motion.h2
          variants={slideInLeft}
          className="col-span-1 md:col-span-6 text-center font-lime text-xl md:text-3xl tracking-widest py-16"
        >
          Witaj u najlepszych barberów w Warszawie
        </motion.h2>

        <motion.div
          variants={slideInRightScale}
          className="relative justify-self-end w-full max-w-md rounded  text-center"
        >
          <Image
            src="/images/cta2.jpg"
            alt="razor shave "
            width={500}
            height={400}
            className="w-full h-96 object-cover rounded"
          />
          <motion.h3
            variants={longFadeInScaleUp}
            className="absolute font-ballet tracking-[.2em] text-2xl top-80  left-25 font-semibold"
          >
            Nowoczosne trendy
          </motion.h3>
        </motion.div>

        <motion.div
          variants={slideInLeftScale}
          className="relative justify-self-center w-full max-w-md "
        >
          <div className="w-full absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0,_rgba(0,0,0,0.75)_50%,_rgba(0,0,0,0.99)_100%)] rounded" />

          <Image
            src="/images/cta1.jpg"
            alt="razor shave color"
            width={500}
            height={400}
            className=" w-full h-96 object-cover rounded"
          />
          <motion.h3
            variants={longFadeInScaleUp}
            className=" absolute font-ballet tracking-[.2em] text-2xl top-80 left-25 font-semibold"
          >
            Hot towel shave
          </motion.h3>
        </motion.div>

        <motion.div
          variants={slideInRightScale}
          className="relative justify-self-start w-full max-w-md rounded  "
        >
          <Image
            src="/images/comb.jpg"
            alt="blade shave "
            width={500}
            height={400}
            className="w-full h-96 object-cover rounded"
          />
          <motion.h3
            variants={longFadeInScaleUp}
            className="absolute font-ballet tracking-[.2em] text-2xl z-50 top-80 left-25 font-semibold"
          >
            Klasyczne strzyżenia
          </motion.h3>
        </motion.div>
      </motion.div>
    </section>
  );
};
