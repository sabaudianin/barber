import React from "react";
import Image from "next/image";

export const AboutUs = () => {
  return (
    <section className="p-2 bg-stone-700">
      <div>
        <h2 className="font-diplomata py-2">
          Witamy w Barber Shop Saska Kępa - nowoczesnym barbershopie
          zakorzenionym w klasycznym rzemiośle męskiej pielęgnacji.
        </h2>
        <div className=" p-2 w-1/2 mx-auto  sepia">
          <Image
            src="/images/vintage.png"
            width={200}
            height={100}
            alt="Scissors avatar"
            className=" mx-auto sepia"
          />
        </div>

        <p className="font-lime py-2 indent-2">
          Zlokalizowani w sercu artystycznej warszawskiej Saskiej Kępy, łączymy
          mistrzowskie rzemiosło, swobodną atmosferę i pasję do precyzji.
          Specjalizujemy się w czystych fade&apos;ach, wyrazistych cięciach oraz
          indywidualnie dopasowanej stylizacji brody, łącząc tradycyjne techniki
          z nowoczesnymi trendami.
        </p>

        <article className="grid lg:grid-cols-2 lg:items-stretch">
          <ul className="p-2 list-inside  space-y-1 tracking-[0.25em] bg-stone-800 lg:h-full flex flex-col font-mono text-xs text-zinc-300 mt-auto">
            <h2 className="py-2 text-center font-lime text-xl text-white">
              Dlaczego My?
            </h2>
            <li className="font-sans">
              <span className="text-xl">💈</span>Doświadczeni barberzy z pasją
              do swojego fachu
            </li>
            <li className="font-mono">
              <span className="text-xl">💈</span>Profesjonalne modelowanie brody
              i rytuały pielęgnacyjne
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>Darmowa kawa i luźna,
              relaksująca atmosfera
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>Autentyczny klimat Saskiej Kępy
            </li>
            <li className="">
              {" "}
              <span className="text-xl">💈</span>Bez pośpiechu - jakość i
              dbałość o detale na pierwszym miejscu
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
