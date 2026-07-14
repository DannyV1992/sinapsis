import type { Metadata } from "next";
import Link from "next/link";
import { config, formatPrice, getWhatsAppLink } from "@/lib/config";
import ProcesoSteps from "@/components/ProcesoSteps";
import TccDiagram from "@/components/TccDiagram";

import TrackingWhatsAppLink from "@/components/TrackingWhatsAppLink";

export const metadata: Metadata = {
  title: "Terapia Psicológica en Costa Rica | Sinapsis",
  description: "Terapia individual, de pareja y familiar en Costa Rica con enfoque cognitivo-conductual. Modalidad presencial y virtual. Agenda tu cita en línea.",
};

const servicios = [
  {
    id: "individual",
    title: "Terapia individual",
    description:
      "Un espacio confidencial para trabajar tus pensamientos, emociones y conductas. Identificamos los patrones que te frenan y construimos herramientas concretas para el cambio — no solo entender el problema, sino saber manejarlo.",
    price: config.prices.individual,
    duration: config.duration.individual,
    ideal: "ansiedad, depresión, autoestima, duelo, cambios de vida, orientación sexual e identidad de género.",
    bar: "bg-primary",
  },
  {
    id: "pareja",
    title: "Terapia de pareja",
    description:
      "Un proceso estructurado para mejorar la comunicación, salir de los conflictos que se repiten o atravesar una crisis sin que se rompa lo que construyeron. No es solo hablar — es construir un vínculo más honesto.",
    price: config.prices.pareja,
    duration: config.duration.pareja,
    ideal: "comunicación, infidelidad, diferencias de valores, convivencia. Cualquier tipo de pareja — diversidad afectivo-sexual bienvenida.",
    bar: "bg-accent",
  },
  {
    id: "familiar",
    title: "Terapia familiar",
    description:
      "Un espacio para las dinámicas del sistema familiar: roles que ya no funcionan, límites que nunca se pusieron, conflictos que se repiten entre generaciones. Participan los miembros que son parte del proceso.",
    price: config.prices.familiar,
    duration: config.duration.familiar,
    ideal: "conflictos familiares, crianza, adolescentes en crisis, familias diversas.",
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
            Terapia psicológica
            <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[240px]" />
          </h1>
          <p className="mt-5 text-white/65 text-lg max-w-xl leading-relaxed">
            Un proceso con dirección, preparado para lo que de verdad te trajo hasta acá.
          </p>
        </div>
      </section>

      {/* Intro enfoque */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TccDiagram />
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
                    <span className="font-semibold text-foreground/70">Ideal si: </span>
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
      <section className="py-24 bg-accent/20 border-t border-accent/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-foreground leading-snug mb-6">
                ¿Damos el primer paso?
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Podés agendar directamente o escribirme si tenés preguntas antes de dar el primer paso.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="/agendar"
                className="px-8 py-4 bg-primary-dark text-white rounded-full text-sm font-semibold text-center hover:-translate-y-px transition-all duration-300"
              >
                Agendar cita
              </Link>
              <TrackingWhatsAppLink
                href={getWhatsAppLink("Hola, vengo desde tu sitio web y tengo una consulta sobre los servicios de psicología.")}
                className="px-8 py-4 border border-foreground/30 text-foreground/85 rounded-full text-sm font-medium text-center hover:border-foreground/60 hover:text-foreground transition-all duration-300"
              >
                Escribir por WhatsApp
              </TrackingWhatsAppLink>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
