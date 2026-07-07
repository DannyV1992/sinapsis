import type { Metadata } from "next";
import Link from "next/link";
import { config, formatPrice, getWhatsAppLink } from "@/lib/config";
import ProcesoSteps from "@/components/ProcesoSteps";

export const metadata: Metadata = {
  title: "Servicios de psicología — Sinapsis",
  description: "Consulta psicológica individual, de pareja y familiar en San José, Costa Rica. Enfoque cognitivo-conductual, modalidad presencial y virtual.",
};

const servicios = [
  {
    id: "individual",
    title: "Terapia individual",
    description:
      "Un espacio confidencial para trabajar en tus pensamientos, emociones y comportamientos. A través del enfoque cognitivo-conductual, identificamos patrones que te limitan y construimos estrategias concretas para el cambio.",
    price: config.prices.individual,
    duration: config.duration.individual,
    ideal: "Ansiedad, depresión, autoestima, duelo, orientación sexual e identidad de género, transiciones vitales.",
    bar: "bg-primary",
  },
  {
    id: "pareja",
    title: "Terapia de pareja",
    description:
      "Proceso estructurado para parejas que quieren mejorar su comunicación, resolver conflictos recurrentes o atravesar una crisis juntas. El objetivo es construir un vínculo más honesto y funcional.",
    price: config.prices.pareja,
    duration: config.duration.pareja,
    ideal: "Crisis de comunicación, infidelidad, diferencias de valores, convivencia, diversidad afectivo-sexual.",
    bar: "bg-accent",
  },
  {
    id: "familiar",
    title: "Terapia familiar",
    description:
      "Espacio para trabajar dinámicas del sistema familiar: roles, límites, comunicación y conflictos intergeneracionales. Participan los miembros relevantes para el proceso terapéutico.",
    price: config.prices.familiar,
    duration: config.duration.familiar,
    ideal: "Conflictos familiares, crianza, adolescentes en crisis, diversidad en el núcleo familiar.",
    bar: "bg-primary-dark",
  },
];


export default function ServiciosPage() {
  return (
    <main className="pt-16 lg:pt-20">

      {/* Hero */}
      <section className="relative bg-primary-dark pt-20 pb-14 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">
            Consulta psicológica
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-6xl sm:text-7xl font-bold text-white flex items-center gap-5">
            Psicología
            <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[240px]" />
          </h1>
        </div>
      </section>

      {/* Intro enfoque */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-24 items-start">
            <div>
              <p className="text-xs tracking-[0.3em] text-foreground/50 uppercase mb-6">
                Mi enfoque
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                Trabajo desde la terapia cognitivo-conductual (TCC), un enfoque basado en evidencia que conecta lo que pensamos, lo que sentimos y lo que hacemos. No se trata solo de hablar — se trata de entender los patrones y construir herramientas reales para cambiarlos.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                Tengo formación especializada en diversidad sexual, de género y estructuras relacionales. Mis consultas son un espacio libre de juicios, donde podés ser quien sos sin necesidad de explicar o justificar tu identidad.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                El proceso terapéutico tiene estructura, metas claras y avanza a tu ritmo.
              </p>
            </div>

            {/* Datos clave */}
            <div className="space-y-8">
              {[
                { number: "TCC", label: "enfoque cognitivo-conductual" },
                { number: "LGBTQ+", label: "espacio afirmativo" },
                { number: "San José", label: "consulta presencial y virtual" },
              ].map((s) => (
                <div key={s.label} className="border-b border-foreground/8 pb-8">
                  <p className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-primary mb-1">
                    {s.number}
                  </p>
                  <p className="text-xs tracking-[0.2em] text-foreground/50 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="tipos-de-terapia" className="bg-section-alt border-t border-foreground/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-xs tracking-[0.3em] text-foreground/50 uppercase mb-5">Consulta</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-5 mb-14">
            Tipos de terapia
            <span className="flex-1 h-px bg-foreground/15 hidden sm:block" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicios.map((s) => (
              <div
                key={s.id}
                className="group rounded-2xl border border-foreground/8 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/8 transition-all duration-300 flex flex-col"
              >
                <div className={`h-1.5 ${s.bar}`} />
                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-5">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-foreground mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs tracking-[0.15em] text-foreground/40 uppercase">
                      {formatPrice(s.price)} · {s.duration} min
                    </p>
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed mb-5 flex-1">
                    {s.description}
                  </p>
                  <p className="text-xs text-foreground/50 leading-relaxed mb-6">
                    <span className="font-semibold text-foreground/70">Indicado para: </span>
                    {s.ideal}
                  </p>
                  <Link
                    href={`/agendar?service=${s.id}`}
                    className="w-full text-center px-5 py-2.5 bg-foreground/5 group-hover:bg-primary group-hover:text-white text-foreground/60 rounded-full text-xs font-semibold transition-all duration-300"
                  >
                    Agendar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Proceso terapéutico */}
      <section id="proceso" className="py-20 lg:py-28 bg-background border-t border-foreground/6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.3em] text-foreground/50 uppercase mb-5">Proceso</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-5 mb-6">
            ¿Cómo funciona?
            <span className="flex-1 h-px bg-foreground/15 hidden sm:block" />
          </h2>
          <p className="text-foreground/60 text-base leading-relaxed mb-14 max-w-2xl">
            No hay magia ni atajos. Lo que hay es un proceso estructurado, honesto y adaptado a vos — desde la primera sesión hasta el cierre.
          </p>
          <ProcesoSteps />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-dark border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white leading-snug mb-6">
                ¿Listo/a para empezar?
              </p>
              <p className="text-white/75 text-lg leading-relaxed">
                Podés agendar directamente o escribirme si tenés preguntas antes de dar el primer paso.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="/agendar"
                className="px-8 py-4 bg-accent text-primary-dark rounded-full text-sm font-semibold text-center hover:-translate-y-px transition-all duration-300"
              >
                Agendar cita
              </Link>
              <a
                href={getWhatsAppLink("Hola, tengo una consulta sobre los servicios de psicología.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/30 text-white/85 rounded-full text-sm font-medium text-center hover:border-white/60 hover:text-white transition-all duration-300"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
