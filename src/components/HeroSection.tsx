"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import NeuronBackground from "./NeuronBackground";

export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-light/10" />
      <NeuronBackground />

      <div className="relative max-w-4xl mx-auto px-4 text-center z-10 bg-background/20 backdrop-blur-[2px] rounded-3xl py-12 px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight font-[family-name:var(--font-playfair)]"
          >
            {"Tu bienestar emocional".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              className="block text-primary mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              comienza aquí
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-8 text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed"
        >
          En Sinapsis creemos que cuidar tu salud mental es un acto de
          valentía. Te acompañamos en tu proceso con profesionalismo y
          calidez humana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/agendar"
            className="group relative px-8 py-4 bg-primary text-white rounded-full text-lg font-medium overflow-hidden transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10">Agendar mi cita</span>
            <div className="absolute inset-0 bg-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
          <a
            href="#servicios"
            className="px-8 py-4 border-2 border-primary text-primary rounded-full text-lg font-medium hover:bg-primary hover:text-white transition-all duration-300"
          >
            Ver servicios
          </a>
        </motion.div>

      </div>
    </section>
  );
}
