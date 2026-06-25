"use client";

import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function CTABanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white" />
      </div>
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <AnimateOnScroll>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-playfair)] leading-tight">
            El primer paso es el más importante
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            No tienes que tener todo resuelto para empezar. Solo necesitas la
            disposición de dar el primer paso. Yo te acompaño en el camino.
          </p>
          <Link
            href="/agendar"
            className="inline-block mt-8 px-8 py-4 bg-white text-primary rounded-full text-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Agendar mi primera cita
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
