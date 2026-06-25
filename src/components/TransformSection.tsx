"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const transformations = [
  {
    before: "Ansiedad constante",
    after: "Calma interior",
    icon: "🌊",
  },
  {
    before: "Relaciones conflictivas",
    after: "Comunicación efectiva",
    icon: "🤝",
  },
  {
    before: "Baja autoestima",
    after: "Confianza en ti mismo/a",
    icon: "✨",
  },
  {
    before: "Estrés abrumador",
    after: "Herramientas para el balance",
    icon: "⚖️",
  },
];

export default function TransformSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 bg-section-alt relative overflow-hidden border-t border-gray-100">
      <motion.div style={{ opacity }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ y }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Transforma tu vida
          </h2>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
            Estos son algunos de los cambios que mis pacientes experimentan
            durante su proceso terapéutico.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {transformations.map((item, i) => (
            <motion.div
              key={item.before}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-center gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground/40 line-through">
                      {item.before}
                    </span>
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-sm font-semibold text-primary">
                      {item.after}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated underline */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
