"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/lib/config";

const steps = [
  {
    number: "01",
    title: "Primera consulta",
    subtitle: "Nos conocemos sin compromisos",
    description:
      "La primera sesión no es terapia todavía — es una conversación. Me contás qué te trae, yo te explico cómo trabajo, y evaluamos juntos si somos un buen match. No hay obligación de continuar si no sentís que es el espacio adecuado para vos.",
    what: [
      "Escucho tu situación actual sin juicios",
      "Te explico el enfoque cognitivo-conductual en términos simples",
      "Resolvemos dudas sobre el proceso, precios y modalidad",
      "Decidimos juntos si tiene sentido continuar",
    ],
    result: "Claridad sobre si quieres iniciar el proceso y con qué enfoque.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Evaluación inicial",
    subtitle: "Entendemos qué está pasando realmente",
    description:
      "Antes de intervenir, necesito entender. En las primeras sesiones construimos juntos un mapa claro de tu situación: qué pensamientos, emociones y conductas están involucrados, desde cuándo, y qué factores los mantienen activos.",
    what: [
      "Historia personal y contexto de vida",
      "Identificación de patrones de pensamiento y conducta",
      "Establecimiento de objetivos concretos y medibles",
      "Definición del número estimado de sesiones",
    ],
    result: "Un plan terapéutico claro con objetivos específicos y un camino definido.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    number: "04",
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
    number: "05",
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


export default function ProcesoPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary-dark pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] leading-tight mb-6">
              ¿Cómo es el proceso
              <br />
              <span className="text-primary">terapéutico?</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed mb-10">
              No hay magia ni atajos. Lo que hay es un proceso estructurado, honesto y adaptado a vos.
              Aquí te explico exactamente qué esperar — desde la primera sesión hasta el cierre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              La TCC no es solo hablar — es aprender a cambiar
            </h2>
            <p className="text-foreground/60 text-base leading-relaxed">
              La Terapia Cognitivo-Conductual es el enfoque con mayor respaldo científico en psicología clínica.
              Trabaja sobre la relación entre tus pensamientos, emociones y conductas — y te da herramientas
              concretas para interrumpir los patrones que te frenan. No es terapia de por vida ni de hablar
              por hablar: tiene objetivos, estructura y resultados medibles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              El proceso, paso a paso
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Sin sorpresas. Así es exactamente cómo trabajamos.
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
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
                  {/* Number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-[6.5rem] h-[6.5rem] hidden lg:flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm relative z-10">
                      <span className="text-xs font-bold text-primary/60 tracking-widest mb-1">{step.number}</span>
                      <div className="text-accent">{step.icon}</div>
                    </div>
                    <div className="flex lg:hidden w-12 h-12 items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm relative z-10">
                      <div className="text-accent">{step.icon}</div>
                    </div>
                  </div>

                  {/* Content */}
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
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-accent-light border-t border-accent/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              El cambio no ocurre solo —
              <br />
              <span className="text-primary-dark">pero tampoco tenés que hacerlo sin acompañamiento.</span>
            </h2>
            <p className="text-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Si llegaste hasta aquí, algo en vos ya está listo para comenzar.
              Agendá tu primera consulta o escribime si tenés alguna duda.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 bg-primary-dark hover:bg-primary text-white font-semibold px-8 py-4 rounded-full transition-colors"
              >
                Agendar consulta
              </Link>
              <a
                href={getWhatsAppLink("Hola, leí sobre el proceso terapéutico y tengo una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-primary-dark/40 text-primary-dark hover:bg-primary-dark/10 font-medium px-8 py-4 rounded-full transition-colors"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
