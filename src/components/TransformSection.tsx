"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimateOnScroll from "./AnimateOnScroll";
import { config, formatPrice } from "@/lib/config";

const modalities = [
  { name: "Individual", icon: "🧠" },
  { name: "Pareja", icon: "💛" },
  { name: "Familiar", icon: "🏡" },
  { name: "Online", icon: "💻" },
];

const descriptions = [
  `Sesiones de una hora centradas en tus necesidades. Trabajamos ansiedad, depresión, autoestima, duelo y más. Tu proceso, tu ritmo.\n\n${formatPrice(config.prices.individual)} por sesión`,
  `Sesiones de hora y media para mejorar la comunicación, resolver conflictos y reconectarse. Ambos miembros deben tener disposición de participar.\n\n${formatPrice(config.prices.pareja)} por sesión`,
  `Sesiones de hora y media para toda la familia. Trabajamos dinámicas, roles y comunicación para fortalecer los vínculos.\n\n${formatPrice(config.prices.familiar)} por sesión`,
  "La misma eficacia y calidez desde cualquier lugar. Solo necesitas un espacio privado y conexión estable.\n\nMismo precio según el servicio elegido",
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
            <div className="flex rounded-xl overflow-hidden border border-gray-100 mb-6">
              {modalities.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => setActive(i)}
                  className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                    active === i
                      ? "bg-primary text-white"
                      : "bg-white text-foreground/60 hover:bg-section-alt"
                  }`}
                >
                  <span className="block text-lg mb-0.5">{m.icon}</span>
                  {m.name}
                </button>
              ))}
            </div>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm"
            >
              <span className="text-5xl block mb-4">{modalities[active].icon}</span>
              <h3 className="text-xl font-semibold text-foreground mb-2">{modalities[active].name}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{descriptions[active]}</p>
            </motion.div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
