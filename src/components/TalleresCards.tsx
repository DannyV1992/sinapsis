"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categorias = ["Todos", "Bienestar", "Liderazgo", "Cultura e inclusión"] as const;
type Categoria = (typeof categorias)[number];

const talleres: { title: string; description: string; duracion: string; categoria: Categoria }[] = [
  {
    title: "Manejo del estrés y prevención del burnout",
    description:
      "Herramientas prácticas para que los equipos identifiquen señales de agotamiento y construyan estrategias de autocuidado sostenibles dentro del entorno laboral.",
    duracion: "3–4 horas",
    categoria: "Bienestar",
  },
  {
    title: "Síndrome del impostor",
    description:
      "Identificar los patrones de pensamiento que sabotean la confianza profesional y construir una autoeficacia más auténtica y sostenida.",
    duracion: "2–3 horas",
    categoria: "Bienestar",
  },
  {
    title: "Adaptación al cambio y resiliencia",
    description:
      "Estrategias psicológicas para navegar transiciones organizacionales, incertidumbre y presión sostenida sin perder el rendimiento ni el bienestar.",
    duracion: "3–4 horas",
    categoria: "Bienestar",
  },
  {
    title: "Comunicación asertiva en equipos",
    description:
      "Estrategias de comunicación clara, escucha activa y retroalimentación efectiva. Técnicas para reducir conflictos y fortalecer la capacidad de dar y recibir retroalimentación con seguridad y respeto.",
    duracion: "3–4 horas",
    categoria: "Liderazgo",
  },
  {
    title: "Inteligencia emocional aplicada",
    description:
      "Reconocer y gestionar las propias emociones para tomar mejores decisiones y liderar con más efectividad. Incluye regulación emocional, empatía y gestión de conflictos interpersonales.",
    duracion: "3–4 horas",
    categoria: "Liderazgo",
  },
  {
    title: "Toma de decisiones estratégica",
    description:
      "Mejorar la confianza y competencia al decidir bajo presión o incertidumbre. Herramientas para reducir sesgos y actuar con mayor claridad.",
    duracion: "2–3 horas",
    categoria: "Liderazgo",
  },
  {
    title: "Diversidad e inclusión",
    description:
      "Espacio formativo sobre diversidad de identidades, orientaciones y estructuras relacionales en el trabajo — desde una perspectiva psicológica, no solo de compliance.",
    duracion: "2–4 horas",
    categoria: "Cultura e inclusión",
  },
  {
    title: "Acoso sexual y laboral",
    description:
      "Concientización sobre conductas de acoso, marcos legales y protocolos de acción. Enfocado en prevención, detección y respuesta responsable.",
    duracion: "2–3 horas",
    categoria: "Cultura e inclusión",
  },
  {
    title: "Salud mental y destigmatización en el trabajo",
    description:
      "Reducir el estigma alrededor de la salud mental en entornos laborales y generar culturas donde pedir ayuda no se vea como debilidad.",
    duracion: "2–3 horas",
    categoria: "Cultura e inclusión",
  },
];

export default function TalleresCards() {
  const [activa, setActiva] = useState<Categoria>("Todos");

  const filtrados = activa === "Todos" ? talleres : talleres.filter((t) => t.categoria === activa);

  return (
    <div>
      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiva(cat)}
            className={`relative px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200
              ${activa === cat
                ? "text-white"
                : "text-foreground/50 border border-foreground/15 hover:text-foreground/80 hover:border-foreground/30"
              }`}
          >
            {activa === cat && (
              <motion.span
                layoutId="chip-bg"
                className="absolute inset-0 rounded-full bg-primary-dark"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Grid de cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtrados.map((t) => (
            <motion.div
              key={t.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="group bg-background border border-foreground/8 rounded-xl p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-foreground leading-snug group-hover:text-primary-dark transition-colors duration-200">
                  {t.title}
                </h3>
              </div>
              <p className="text-foreground/65 text-sm leading-relaxed flex-1">
                {t.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-foreground/6">
                <span className="text-xs tracking-[0.15em] text-primary/85 uppercase">
                  {t.duracion}
                </span>
                <span className="text-xs tracking-[0.1em] text-foreground/30 uppercase">
                  {t.categoria}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
