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
                Acompaño a personas que atraviesan ansiedad, depresión, duelo,
                estrés, crisis de pareja o esa sensación de que algo no está
                bien y no saben exactamente qué. Trabajo desde la terapia
                cognitivo-conductual: un marco con evidencia detrás, con
                dirección y con un fin.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Pero la ciencia no sirve de nada si sientes que la persona que
                tienes enfrente no te entiende. Por eso escucho antes de
                proponer — y por eso mi consulta es un lugar donde nada es tabú.
                A muchos también los trae eso: temas que otros espacios reciben
                con sorpresa o con un juicio silencioso. Acá son parte de la
                vida, no algo a corregir.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-8">
                Esta experiencia clínica se complementa con más de 8 años en ambientes corporativos,
                trabajando en bienestar y felicidad organizacional, con amplio conocimiento en la
                ejecución de team buildings, cultura organizacional, talleres y charlas para el
                desarrollo profesional.
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
                    "Ansiedad, depresión, duelo y crisis de pareja",
                    "Espacio afirmativo: diversidad relacional y sexualidad",
                    "8+ años en bienestar organizacional",
                    "Colegio de Profesionales en Psicología de Costa Rica (Cod. 14176)",
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
