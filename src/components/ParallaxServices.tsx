"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "Terapia individual",
    description: "Sesiones personalizadas para ansiedad, depresión, autoestima y crecimiento personal.",
    gradient: "from-purple-500/20 to-indigo-500/20",
  },
  {
    title: "Terapia de pareja",
    description: "Mejora la comunicación y fortalece el vínculo con herramientas terapéuticas efectivas.",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    title: "Manejo de ansiedad",
    description: "Técnicas cognitivo-conductuales y mindfulness para recuperar tu calma.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Terapia online",
    description: "Sesiones virtuales con la misma calidez. Desde la comodidad de tu hogar.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Orientación vocacional",
    description: "Descubre tu vocación con acompañamiento psicológico especializado.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Talleres grupales",
    description: "Inteligencia emocional, manejo del estrés y comunicación asertiva.",
    gradient: "from-violet-500/20 to-purple-500/20",
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            Servicios
          </h2>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
            Diferentes modalidades de atención adaptadas a tus necesidades.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-6 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 h-full">
                <div className="w-2 h-2 rounded-full bg-accent mb-4 group-hover:scale-[3] group-hover:bg-primary transition-all duration-500" />
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
