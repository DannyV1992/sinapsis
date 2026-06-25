"use client";

import AnimateOnScroll from "./AnimateOnScroll";

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-20 bg-section-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll>
            <div className="relative">
              <div className="w-full aspect-[4/5] bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-16 h-16 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-primary/60">Foto profesional</p>
                </div>
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
                Soy psicóloga clínica con más de X años de experiencia
                acompañando a personas en su proceso de autoconocimiento y
                bienestar emocional. Mi enfoque integra diversas corrientes
                terapéuticas para adaptarme a las necesidades únicas de cada
                paciente.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Creo firmemente que cada persona tiene dentro de sí los
                recursos necesarios para sanar y crecer. Mi rol es facilitar
                ese proceso en un espacio seguro, confidencial y libre de
                juicios.
              </p>
              <ul className="space-y-3">
                {[
                  "Licenciatura en Psicología Clínica",
                  "Maestría en Terapia Cognitivo-Conductual",
                  "Especialización en Ansiedad y Estrés",
                  "Miembro del Colegio de Profesionales en Psicología",
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
