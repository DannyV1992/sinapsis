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
              <p className="text-sm font-medium text-primary/70 uppercase tracking-widest mb-2">
                Hola, soy
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                Cinthya Chávez
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
              <p className="text-foreground/70 leading-relaxed mb-8">
                Llevo más de ocho años acompañando personas — primero en entornos
                corporativos, hoy en consulta privada. Me especializo en trabajar
                con quienes han cargado solas experiencias que raramente encuentran
                un lugar en la terapia tradicional.
              </p>
              <div className="border-t border-foreground/10 pt-6">
                <p className="text-xs font-medium text-foreground/40 uppercase tracking-widest mb-4">Formación y credenciales</p>
                <ul className="space-y-2">
                  {[
                    "Licenciada en Psicología Clínica",
                    "Terapia cognitivo-conductual",
                    "Enfoque en diversidad relacional y de género",
                    "Colegio de Profesionales en Psicología de Costa Rica · Cod. 14176",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground/50">
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
