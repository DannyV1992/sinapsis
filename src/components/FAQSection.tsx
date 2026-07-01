"use client";

import { useState } from "react";
import AnimateOnScroll from "./AnimateOnScroll";

const faqs = [
  {
    question: "¿Qué esperar en la primera sesión?",
    answer:
      "En la primera sesión nos conocemos, hablamos sobre lo que te trae aquí y definimos juntos los objetivos del proceso. Es un espacio seguro y sin juicios. No necesitas preparar nada especial, solo venir con disposición.",
  },
  {
    question: "¿Cuánto dura una sesión?",
    answer:
      "Las sesiones individuales duran 1 hora. Las sesiones de pareja o familia duran 1 hora y media. La primera sesión puede extenderse un poco más para conocerte mejor.",
  },
  {
    question: "¿Es confidencial?",
    answer:
      "Absolutamente. Todo lo que compartas en sesión está protegido por el secreto profesional. Tu información es completamente privada.",
  },
  {
    question: "¿Cómo sé si necesito terapia?",
    answer:
      "Si sientes que algo te impide vivir plenamente — ya sea ansiedad, tristeza, conflictos en tus relaciones o simplemente quieres conocerte mejor — la terapia puede ayudarte.",
  },
  {
    question: "¿Cuántas sesiones necesitaré?",
    answer:
      "Depende de cada persona y sus objetivos. Algunos procesos son breves (8-12 sesiones) y otros son más profundos. Lo definimos juntos según tu progreso. Se recomienda no darse de alta por cuenta propia y esperar la recomendación del profesional.",
  },
  {
    question: "¿Ofrecen sesiones online?",
    answer:
      "Sí. Las sesiones virtuales tienen la misma eficacia que las presenciales. Necesitas un espacio privado sin interrupciones, cámara encendida, conexión estable a internet y no estar realizando otras actividades.",
  },
  {
    question: "¿Cómo funciona la terapia de pareja?",
    answer:
      "Se requiere que ambos miembros de la pareja deseen asistir al proceso. Si alguno no desea participar, se recomienda iniciar con sesión individual. Ambos deben asistir a las sesiones.",
  },
  {
    question: "¿Cuánto cuesta y qué métodos de pago aceptan?",
    answer:
      "Terapia individual (1 hora): ₡30,000. Terapia de pareja o familiar (1.5 horas): ₡45,000. Aceptamos transferencia bancaria, SINPE Móvil y efectivo. El pago se realiza al finalizar cada sesión.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-foreground/60 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-24 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
              Preguntas frecuentes
            </h2>
            <p className="mt-4 text-foreground/60">
              Resolvemos las dudas más comunes antes de tu primera sesión.
            </p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
