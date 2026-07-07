import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppLink } from "@/lib/config";
import TallerSlideshow from "@/components/TallerSlideshow";
import TalleresCards from "@/components/TalleresCards";

export const metadata: Metadata = {
  title: "Empresas y Talleres",
  description: "Talleres de bienestar organizacional, comunicación asertiva y diversidad para equipos de trabajo en Costa Rica.",
};

export default function EmpresasPage() {
  return (
    <main className="pt-16 lg:pt-20">

      {/* Hero */}
      <section className="relative bg-primary-dark pt-20 pb-14 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm tracking-[0.3em] text-white/50 uppercase mb-3">
            Bienestar organizacional
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-6xl sm:text-7xl font-bold text-white flex items-center gap-5">
            Empresas
            <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[240px]" />
          </h1>
        </div>
      </section>

      {/* Propuesta */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Texto + Slideshow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div>
              <p className="text-xs tracking-[0.3em] text-foreground/50 uppercase mb-6">
                Mi experiencia corporativa
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                Antes de abrir consulta privada, pasé más de ocho años trabajando en entornos corporativos — diseñando iniciativas de bienestar organizacional, facilitando team buildings y desarrollando talleres de cultura de equipos.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                Ese recorrido me dio una perspectiva que pocas psicólogas clínicas tienen: entiendo la dinámica de las organizaciones desde adentro. No llego con un taller genérico — llego con contexto real de lo que viven los equipos.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                Trabajo con empresas de distintos tamaños y sectores. Todo proceso parte de entender qué necesita específicamente tu equipo.
              </p>
            </div>
            <TallerSlideshow />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 border-t border-foreground/8 pt-12">
            {[
              { number: "8+", label: "años en entornos corporativos" },
              { number: "200+", label: "personas acompañadas en talleres" },
              { number: "15+", label: "temáticas disponibles" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-primary mb-1">
                  {s.number}
                </p>
                <p className="text-xs tracking-[0.2em] text-foreground/50 uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talleres */}
      <section className="bg-section-alt border-t border-foreground/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-xs tracking-[0.3em] text-foreground/50 uppercase mb-5">Talleres</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-foreground flex items-center gap-5 mb-14">
            Algunas temáticas que imparto
            <span className="flex-1 h-px bg-foreground/15 hidden sm:block" />
          </h2>

          <TalleresCards />
        </div>
      </section>

      {/* CTA corporativo */}
      <section className="py-24 bg-accent/20 border-t border-accent/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-center">
            {/* Video */}
            <div className="w-full max-w-[220px] mx-auto lg:mx-0 aspect-[9/16] overflow-hidden rounded-lg bg-foreground/5 shrink-0">
              <video
                src="/taller-video-1.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Texto + botones */}
            <div>
              <p className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-foreground leading-snug mb-6">
                ¿Tu equipo necesita esto?
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                Conversemos sobre lo que necesita tu organización. No trabajo con paquetes cerrados — cada proceso parte de entender tu contexto, ya sea adaptando un taller existente o diseñando algo desde cero para tu equipo y tus objetivos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={getWhatsAppLink("Hola, me interesa consultar sobre talleres y servicios para empresas.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-primary-dark text-white rounded-full text-sm font-semibold text-center hover:-translate-y-px transition-all duration-300"
                >
                  Escribir por WhatsApp
                </a>
                <Link
                  href="/#contacto"
                  className="px-8 py-4 border border-foreground/20 text-foreground/70 rounded-full text-sm font-medium text-center hover:border-foreground/40 hover:text-foreground transition-all duration-300"
                >
                  Enviar mensaje
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
