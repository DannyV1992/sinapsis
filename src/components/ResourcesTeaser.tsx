"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const resources = [
  {
    icon: "✦",
    title: "Tests de bienestar",
    description: "Evaluaciones validadas para conocer tu estado emocional actual.",
    href: "/quiz",
    cta: "Hacer un test",
  },
  {
    icon: "◈",
    title: "Herramientas interactivas",
    description: "Respiración guiada y técnica grounding para momentos difíciles.",
    href: "/recursos/herramientas",
    cta: "Explorar",
  },
  {
    icon: "◇",
    title: "Biblioteca",
    description: "Libros, podcasts y documentales recomendados sobre salud mental.",
    href: "/recursos/biblioteca",
    cta: "Ver recursos",
  },
  {
    icon: "◉",
    title: "Líneas de apoyo",
    description: "Contactos de crisis disponibles en Costa Rica, sin costo.",
    href: "/recursos/apoyo",
    cta: "Ver contactos",
  },
];

export default function ResourcesTeaser() {
  return (
    <section className="py-28 bg-primary-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">
            Mientras decidís
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-playfair)] text-white leading-snug">
            Algo que puede ayudarte ahora mismo
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={item.href}
                className="group flex flex-col h-full p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-accent/40 transition-all duration-300"
              >
                <span className="text-accent text-xl mb-4 block">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2 text-base">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1">
                  {item.description}
                </p>
                <span className="mt-5 text-sm text-accent/80 group-hover:text-accent transition-colors duration-200">
                  {item.cta} →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
