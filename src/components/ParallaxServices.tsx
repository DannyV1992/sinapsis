"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    title: "Problemáticas que atiendo",
    subtitle: "Cuando algo no está bien y quieres cambiarlo",
    color: "from-primary to-primary-light",
    services: [
      { name: "Ansiedad y estrés", phrase: "Recupera tu calma" },
      { name: "Depresión", phrase: "Encuentra tu luz" },
      { name: "Ataques de pánico", phrase: "Recupera el control" },
      { name: "Duelo y pérdidas", phrase: "Honra lo que fue" },
      { name: "Duelos relacionales", phrase: "Soltar también es sanar" },
      { name: "Trauma y TEPT", phrase: "Sana tu historia" },
      { name: "Trastornos alimentarios", phrase: "Reconcíliate con tu cuerpo" },
      { name: "Adicciones", phrase: "Rompe el ciclo" },
      { name: "Abuso psicológico", phrase: "Mereces relaciones sanas" },
      { name: "Burnout", phrase: "No es pereza, es agotamiento" },
    ],
  },
  {
    title: "Desarrollo personal",
    subtitle: "Crecer no siempre requiere estar mal",
    color: "from-accent to-amber-400",
    services: [
      { name: "Autoconcepto", phrase: "Mírate con otros ojos" },
      { name: "Regulación emocional", phrase: "Siente sin ahogarte" },
      { name: "Comunicación asertiva", phrase: "Di lo que necesitas" },
      { name: "Bienestar sexual", phrase: "Sin tabúes" },
      { name: "Establecimiento de límites", phrase: "Aprende a decir no" },
      { name: "Baja autoestima", phrase: "Mereces reconocerte" },
      { name: "Cambios de hábitos", phrase: "Transforma tu día a día" },
      { name: "Toma de decisiones", phrase: "Avanza con claridad" },
    ],
  },
  {
    title: "Atención especializada",
    subtitle: "Porque tu experiencia merece ser comprendida",
    color: "from-pink-500 to-rose-400",
    services: [
      { name: "Comunidad LGBTQ+", phrase: "Espacio seguro" },
      { name: "Relaciones no monógamas", phrase: "Relaciones éticas" },
      { name: "Sobrevivientes de abuso religioso", phrase: "Sanar sin juicio" },
      { name: "Comunidad migrante", phrase: "Acompañamiento en el desarraigo" },
      { name: "Cambios corporales irreversibles", phrase: "Adaptarse a un cuerpo diferente" },
      { name: "Duelo reproductivo", phrase: "Tu dolor es real" },
      { name: "Crianza en hogares monoparentales", phrase: "Lo que cargaste no era tuyo" },
      { name: "Secuelas de bullying", phrase: "Las secuelas no son invisibles" },
    ],
  },
];

export default function ParallaxServices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section id="servicios" ref={containerRef} className="py-24 relative border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Áreas de atención
          </h2>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
            Desde un enfoque cognitivo-conductual y contextual, planteamos objetivos juntos y trabajamos con herramientas y técnicas psicológicas respaldadas por evidencia científica para lograr el cambio que buscas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-1.5 bg-gradient-to-r ${cat.color}`} />
              <div className="p-6">
                <h3 className="font-bold text-foreground text-lg">{cat.title}</h3>
                <p className="text-xs text-foreground/50 italic mb-5">{cat.subtitle}</p>
                <div className="space-y-3">
                  {cat.services.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.1 + i * 0.06 }}
                      className="group flex items-start gap-3 py-1"
                    >
                      <div className={`w-1 h-6 rounded-full bg-gray-200 group-hover:bg-gradient-to-b ${cat.color} transition-all mt-0.5`} />
                      <div>
                        <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">{s.name}</p>
                        <p className="text-[11px] text-foreground/0 group-hover:text-foreground/50 transition-all h-0 group-hover:h-4 overflow-hidden italic">{s.phrase}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
