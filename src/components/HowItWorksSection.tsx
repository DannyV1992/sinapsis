"use client";

import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

const steps = [
  {
    number: "1",
    title: "Agenda tu cita",
    description:
      "Elige el horario que mejor te funcione según la disponibilidad real del calendario.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    number: "2",
    title: "Primera sesión",
    description:
      "Nos conocemos, hablamos sobre lo que te trae aquí y definimos juntos los objetivos del proceso.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    number: "3",
    title: "Tu proceso",
    description:
      "Avanzamos a tu ritmo con sesiones regulares, herramientas prácticas y acompañamiento continuo.",
    cta: true,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-background border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
              Iniciar tu proceso terapéutico es más sencillo de lo que piensas.
            </p>
          </div>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15}>
              <div className="text-center relative">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 relative z-10">
                  <svg
                    className="w-7 h-7 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {step.icon}
                  </svg>
                </div>
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold mb-3">
                  Paso {step.number}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
                {"cta" in step && (
                  <Link
                    href="/terapia#proceso"
                    className="inline-block mt-3 text-xs font-semibold text-primary-dark hover:underline"
                  >
                    Ver el proceso completo →
                  </Link>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
