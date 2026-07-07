"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimateOnScroll from "./AnimateOnScroll";
import { config, formatPrice } from "@/lib/config";
import Link from "next/link";

const modalities = [
  {
    name: "Individual",
    duration: "1 hora",
    price: formatPrice(config.prices.individual),
    description:
      "Sesiones centradas en tus necesidades. Trabajamos ansiedad, depresión, autoestima, duelo, relaciones y más. Tu proceso, tu ritmo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="w-10 h-10">
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    name: "Pareja",
    duration: "1.5 horas",
    price: formatPrice(config.prices.pareja),
    description:
      "Sesiones para mejorar la comunicación, resolver conflictos y reconectarse. Ambos miembros deben tener disposición de participar activamente.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="w-10 h-10">
        <circle cx="8.5" cy="8" r="3.5" />
        <circle cx="15.5" cy="8" r="3.5" />
        <path strokeLinecap="round" d="M2 20c0-3.5 3-6 6.5-6" />
        <path strokeLinecap="round" d="M22 20c0-3.5-3-6-6.5-6" />
        <path strokeLinecap="round" d="M9 20c0-3.5 2-5.5 3-5.5s3 2 3 5.5" />
      </svg>
    ),
  },
  {
    name: "Familiar",
    duration: "1.5 horas",
    price: formatPrice(config.prices.familiar),
    description:
      "Sesiones para toda la familia. Trabajamos dinámicas, roles y comunicación para fortalecer los vínculos desde adentro.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    name: "Online",
    duration: "Misma duración",
    price: "Mismo precio",
    description:
      "La misma eficacia y calidez desde cualquier lugar. Solo necesitás un espacio privado, cámara encendida y conexión estable a internet.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} className="w-10 h-10">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        <circle cx="15.5" cy="10.5" r="1.5" />
        <path strokeLinecap="round" d="M9 13s1-2 3-2 3 2 3 2" />
      </svg>
    ),
  },
];

export default function TransformSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-section-alt relative overflow-hidden border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              Modalidades de atención
            </h2>
            <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
              Elige la modalidad que mejor se adapte a lo que necesitas.
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.15}>
          <div className="max-w-2xl mx-auto">
            {/* Selector */}
            <div className="flex rounded-xl overflow-hidden border border-gray-100 mb-6">
              {modalities.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => setActive(i)}
                  className={`flex-1 py-3 px-2 text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                    active === i
                      ? "bg-primary text-white"
                      : "bg-white text-foreground/60 hover:bg-section-alt"
                  }`}
                >
                  <span className="w-5 h-5 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-current">
                    {m.icon}
                  </span>
                  {m.name}
                </button>
              ))}
            </div>

            {/* Panel de contenido */}
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center"
            >
              <div className="flex justify-center mb-5 text-primary">
                {modalities[active].icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground font-[family-name:var(--font-playfair)] mb-3">
                {modalities[active].name}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed mb-6">
                {modalities[active].description}
              </p>
              <div className="flex justify-center gap-6 text-xs text-foreground/40 uppercase tracking-widest mb-6">
                <span>{modalities[active].duration}</span>
                <span>·</span>
                <span className="text-primary font-medium">{modalities[active].price}</span>
              </div>
              <Link
                href="/agendar"
                className="inline-block px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors duration-300"
              >
                Agendar
              </Link>
              <Link
                href="/terapia#tipos-de-terapia"
                className="absolute bottom-4 right-5 text-xs font-semibold text-primary-dark hover:underline"
              >
                Ver más →
              </Link>
            </motion.div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
