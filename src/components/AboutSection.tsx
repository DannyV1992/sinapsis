"use client";

import Image from "next/image";
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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                Sobre mí
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Decidí dedicarme a la consulta privada porque creo que hay
                personas que merecen un espacio donde su forma de vivir, de amar y
                de existir sea tratada como válida desde el primer momento — sin
                tener que justificarse ni simplificarse para ser comprendidas.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Trabajo con un enfoque cognitivo-conductual: definimos objetivos
                concretos juntos y avanzamos con técnicas respaldadas por
                evidencia. Me interesa que el proceso sea tuyo, no que se adapte a
                un molde que no encaja con quién sos.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Tengo más de ocho años de trayectoria acompañando personas en
                entornos corporativos y en consulta. Hoy me especializo en atender a
                quienes han cargado solos experiencias que no siempre encuentran
                espacio en la terapia tradicional.
              </p>
              <ul className="space-y-3">
                {[
                  "Licenciada en Psicología Clínica",
                  "Terapia cognitivo-conductual",
                  "Enfoque en diversidad relacional y de género",
                  "Miembro del Colegio de Profesionales en Psicología de Costa Rica (Cod. 14176)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
