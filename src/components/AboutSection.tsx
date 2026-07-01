"use client";

import AnimateOnScroll from "./AnimateOnScroll";

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 border-t border-gray-100">
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
                Psicóloga clínica con enfoque cognitivo-conductual. Me apasiona
                una terapia que respeta la diversidad en todas sus formas — de
                identidad, de relaciones, de creencias y de formas de existir.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Atiendo problemáticas como ansiedad, depresión, trauma y
                desarrollo personal. A la vez, me he especializado en acompañar
                a personas cuyas experiencias no siempre encuentran un espacio
                que las comprenda — diversidad relacional, identidades no
                normativas, abuso religioso y procesos de deconstrucción,
                entre otros.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Si necesitas un espacio donde puedas ser, sin filtros ni
                explicaciones, aquí lo vas a encontrar.
              </p>
              <ul className="space-y-3">
                {[
                  "Licenciada en Psicología Clínica",
                  "Terapia cognitivo-conductual",
                  "Enfoque en diversidad relacional y de género",
                  "Miembro del Colegio de Profesionales en Psicología de Costa Rica",
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
