"use client";

import Image from "next/image";
import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll>
            <div className="relative">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="/cinthya.jpg"
                  alt="Licda. Cinthya Chávez — Psicóloga clínica"
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover object-bottom scale-110 origin-bottom"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full -z-10" />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.2}>
            <div>
              <p className="text-sm font-medium text-primary-dark uppercase tracking-widest mb-2">
                Psicóloga clínica
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                Cinthya Chávez
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Con más de ocho años de experiencia clínica, me especializo en
                intervención cognitivo-conductual para adultos. Mi práctica
                integra técnicas respaldadas por evidencia con un enfoque
                centrado en la persona, orientado a objetivos concretos y
                adaptados a cada proceso individual.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Brindo atención en diversidad relacional, de género e identidad,
                así como en ansiedad, depresión y procesos de autoconocimiento.
                El espacio terapéutico está diseñado para ser un lugar seguro,
                sin juicios y orientado al cambio real.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Con más de 8 años de formación en entornos corporativos y consulta privada, ofrezco
                atención presencial y virtual, adaptando el proceso a las
                necesidades y circunstancias de cada consultante.
              </p>
              <Link
                href="/sobre-mi"
                className="inline-block mb-8 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Conocé más sobre mí
              </Link>
              <div className="border-t border-foreground/10 pt-6">
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-widest mb-4">Formación y credenciales</p>
                <ul className="space-y-2">
                  {[
                    "Licenciada en Psicología Clínica",
                    "Terapia cognitivo-conductual",
                    "Enfoque en diversidad relacional y de género",
                    "Colegio de Profesionales en Psicología de Costa Rica · Cod. 14176",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground/70">
                      <span className="w-1 h-1 rounded-full bg-primary/40 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
