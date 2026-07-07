"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Primera consulta",
    subtitle: "Nos conocemos y entendemos qué está pasando",
    description:
      "La primera sesión es una conversación y una evaluación al mismo tiempo. Me contás qué te trae, exploramos juntos qué pensamientos, emociones y conductas están involucrados, y construimos un mapa claro de tu situación. Al final de esta sesión ya tenés claridad sobre cómo seguir — sin obligación de continuar si no sentís que es el espacio adecuado para vos.",
    what: [
      "Escucho tu situación actual sin juicios",
      "Identificación de patrones de pensamiento y conducta",
      "Establecimiento de objetivos concretos y medibles",
      "Resolvemos dudas sobre el proceso, precios y modalidad",
      "Decidimos juntos si tiene sentido continuar",
    ],
    result: "Un plan terapéutico claro, objetivos definidos, y la decisión informada de si querés iniciar el proceso.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Trabajo terapéutico",
    subtitle: "Donde ocurre el cambio real",
    description:
      "Cada sesión tiene estructura y propósito. No es solo hablar — es identificar qué patrones te frenan, aprender a cuestionarlos, y practicar alternativas en tu vida cotidiana. La TCC funciona porque no solo entendés el problema: desarrollás habilidades concretas para manejarlo.",
    what: [
      "Reestructuración cognitiva: cuestionás creencias que te limitan",
      "Técnicas de regulación emocional para el día a día",
      "Exposición gradual a situaciones evitadas (cuando aplica)",
      "Registro de pensamientos y conductas entre sesiones",
    ],
    result: "Herramientas que se quedan con vos, no solo alivio temporal.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Seguimiento y ajuste",
    subtitle: "El proceso se adapta a vos",
    description:
      "La terapia no es lineal. Hay semanas de avance claro y semanas que se sienten como retroceso — eso también es parte del proceso. Revisamos regularmente cómo vas, qué está funcionando y qué necesita ajustarse. Tu ritmo es válido.",
    what: [
      "Revisión periódica de objetivos planteados",
      "Ajuste de técnicas según tu respuesta",
      "Espacio para lo que surge fuera de la agenda inicial",
      "Comunicación abierta si algo no está funcionando",
    ],
    result: "Un proceso flexible que responde a tu realidad, no a un protocolo rígido.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Cierre del proceso",
    subtitle: "Cuando ya no me necesitás tanto",
    description:
      "El objetivo de la terapia no es que dependás de ella — es que desarrollés la autonomía para manejarte solo. El cierre es planeado, gradual y celebra el camino recorrido. Podés volver en cualquier momento si lo necesitás; eso no es un fracaso, es inteligencia emocional.",
    what: [
      "Revisión de los cambios logrados desde el inicio",
      "Plan de prevención de recaídas personalizado",
      "Identificación de señales de alerta a futuro",
      "Espacio abierto para retomar proceso cuando lo necesités",
    ],
    result: "Autonomía real. Las herramientas son tuyas, no mías.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

export default function ProcesoSteps() {
  return (
    <div className="relative">
      <div className="hidden lg:block absolute left-[3.25rem] top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-accent/30 to-primary/10" />
      <div className="space-y-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative flex gap-6 lg:gap-10"
          >
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-[6.5rem] h-[6.5rem] hidden lg:flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm relative z-10">
                <span className="text-xs font-bold text-primary/60 tracking-widest mb-1">{step.number}</span>
                <div className="text-accent">{step.icon}</div>
              </div>
              <div className="flex lg:hidden w-12 h-12 items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm relative z-10">
                <div className="text-accent">{step.icon}</div>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground/50 italic">{step.subtitle}</p>
                </div>
                <span className="hidden sm:block text-4xl font-black text-gray-100 select-none">
                  {step.number}
                </span>
              </div>
              <p className="text-foreground/70 leading-relaxed mb-5">{step.description}</p>
              <div className="grid sm:grid-cols-2 gap-2 mb-5">
                {step.what.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground/60">{item}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-start gap-2">
                <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-foreground/70">
                  <span className="text-foreground">Resultado: </span>
                  {step.result}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
