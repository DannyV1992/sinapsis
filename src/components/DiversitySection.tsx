"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const communities = [
  "Comunidad LGBTQ+",
  "Relaciones no monógamas y poliamoría",
  "Sobrevivientes de abuso religioso",
  "Procesos de deconstrucción de creencias",
  "Identidades de género no normativas",
  "Comunidad migrante",
  "Duelo reproductivo",
  "Crianza en hogares monoparentales",
  "Secuelas de bullying",
  "Cambios corporales irreversibles",
];

export default function DiversitySection() {
  return (
    <section className="py-32 bg-primary-dark relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Columna izquierda: statement */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center gap-4 font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light tracking-[0.08em] text-white uppercase mb-10"
            >
              Atención especializada
              <span className="flex-1 h-px bg-white/15 hidden sm:block" />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-[family-name:var(--font-cormorant)] text-3xl sm:text-4xl font-light italic text-white/80 mb-8 leading-snug"
            >
              Si tu vida no cabe en lo &ldquo;normal&rdquo;,<br />aquí sí cabe.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-white/50 text-base leading-relaxed mb-10 max-w-sm"
            >
              Este es un espacio donde no tenés que explicar quién sos antes de empezar a sanar. Me he especializado en acompañar a personas cuyas experiencias no siempre encuentran un lugar que las comprenda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/agendar"
                  className="inline-block px-8 py-4 bg-accent text-primary-dark rounded-full text-base font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-accent/20"
                >
                  Agendar mi cita
                </Link>
                <Link
                  href="/relaciones"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/70 rounded-full text-base font-medium hover:border-white/40 hover:text-white transition-all duration-300"
                >
                  Saber más
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Columna derecha: lista de comunidades */}
          <div className="lg:pt-24">
            {communities.map((community, i) => (
              <motion.div
                key={community}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex items-center gap-5 py-4 border-b border-white/10 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent flex-shrink-0 transition-colors duration-300" />
                <span className="text-white/65 text-lg group-hover:text-white/90 transition-colors duration-300">
                  {community}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
