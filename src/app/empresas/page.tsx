import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getWhatsAppLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Empresas y Talleres",
  description: "Talleres de bienestar organizacional, comunicación asertiva y diversidad para equipos de trabajo en Costa Rica.",
};

const talleres = [
  {
    title: "Manejo del estrés y prevención del burnout",
    description:
      "Herramientas prácticas para que los equipos identifiquen señales de agotamiento y construyan estrategias de autocuidado sostenibles dentro del entorno laboral.",
    duracion: "3–4 horas / sesión única o proceso",
  },
  {
    title: "Comunicación asertiva en equipos",
    description:
      "Técnicas para mejorar la comunicación interna, reducir conflictos y fortalecer la capacidad de dar y recibir retroalimentación con seguridad.",
    duracion: "3–4 horas / sesión única o proceso",
  },
  {
    title: "Diversidad, inclusión y salud mental",
    description:
      "Espacio formativo para líderes y equipos sobre diversidad de identidades, orientaciones y estructuras relacionales en el lugar de trabajo — desde una perspectiva psicológica, no solo de compliance.",
    duracion: "2–4 horas / adaptable",
  },
  {
    title: "Inteligencia emocional aplicada",
    description:
      "Reconocimiento y regulación emocional, empatía, gestión de conflictos interpersonales. Para equipos que quieren mejorar su clima laboral desde adentro.",
    duracion: "3–4 horas / sesión única o proceso",
  },
  {
    title: "Taller a la medida",
    description:
      "Si tenés una necesidad específica de tu organización, podemos diseñar un taller o proceso que se adapte a tu equipo, industria y objetivos.",
    duracion: "Consultar",
  },
];

export default function EmpresasPage() {
  return (
    <main className="pt-16 lg:pt-20">

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-primary-dark">
        <Image
          src="/cinthya.jpg"
          alt="Empresas y talleres"
          fill
          className="object-cover object-center opacity-15"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
            <h1 className="font-[family-name:var(--font-cormorant)] text-5xl sm:text-6xl font-light tracking-[0.08em] text-white uppercase flex items-center gap-5 mb-4">
              Empresas
              <span className="flex-1 h-px bg-white/15 hidden sm:block max-w-[200px]" />
            </h1>
            <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light italic text-white/50 max-w-lg">
              Bienestar organizacional y talleres para equipos.
            </p>
          </div>
        </div>
      </section>

      {/* Propuesta */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-24 items-start">
            <div>
              <p className="font-[family-name:var(--font-dancing)] text-3xl text-primary/50 mb-6">
                Mi experiencia corporativa
              </p>
              <p className="text-foreground/65 text-lg leading-relaxed mb-5">
                Antes de abrir consulta privada, pasé más de ocho años trabajando en entornos corporativos — diseñando iniciativas de bienestar organizacional, facilitando team buildings y desarrollando talleres de cultura de equipos.
              </p>
              <p className="text-foreground/65 text-base leading-relaxed mb-5">
                Ese recorrido me dio una perspectiva que pocas psicólogas clínicas tienen: entiendo la dinámica de las organizaciones desde adentro. No llego con un taller genérico — llego con contexto real de lo que viven los equipos.
              </p>
              <p className="text-foreground/65 text-base leading-relaxed">
                Trabajo con empresas de distintos tamaños y sectores. Todo proceso parte de entender qué necesita específicamente tu equipo.
              </p>
            </div>

            {/* Stats / credenciales */}
            <div className="space-y-8">
              {[
                { number: "8+", label: "años en entornos corporativos" },
                { number: "100+", label: "personas acompañadas en talleres" },
                { number: "5", label: "talleres disponibles" },
              ].map((s) => (
                <div key={s.label} className="border-b border-foreground/8 pb-8">
                  <p className="font-[family-name:var(--font-cormorant)] text-5xl font-light text-primary mb-1">
                    {s.number}
                  </p>
                  <p className="text-xs tracking-[0.2em] text-foreground/40 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Talleres */}
      <section className="bg-section-alt border-t border-foreground/6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <p className="text-xs tracking-[0.3em] text-foreground/35 uppercase mb-5">Talleres</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light tracking-[0.08em] text-foreground uppercase flex items-center gap-5 mb-14">
            Lo que ofrezco
            <span className="flex-1 h-px bg-foreground/15 hidden sm:block" />
          </h2>

          <div className="space-y-0">
            {talleres.map((t, i) => (
              <div key={t.title} className={`py-10 border-t border-foreground/8 ${i === talleres.length - 1 ? "border-b" : ""}`}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_auto] gap-5 lg:gap-12 items-start">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-light tracking-wide text-foreground uppercase">
                    {t.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{t.description}</p>
                  <p className="text-xs tracking-[0.15em] text-primary/60 uppercase whitespace-nowrap">{t.duracion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA corporativo */}
      <section className="py-24 bg-primary-dark border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light italic text-white/70 leading-snug mb-6">
                ¿Tu equipo necesita esto?
              </p>
              <p className="text-white/45 text-base leading-relaxed">
                Conversemos sobre lo que necesita tu organización. No hay un paquete estándar — cada proceso parte de entender tu contexto específico.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <a
                href={getWhatsAppLink("Hola, me interesa consultar sobre talleres y servicios para empresas.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-accent text-primary-dark rounded-full text-sm font-semibold text-center hover:-translate-y-px transition-all duration-300"
              >
                Escribir por WhatsApp
              </a>
              <Link
                href="/#contacto"
                className="px-8 py-4 border border-white/20 text-white/70 rounded-full text-sm font-medium text-center hover:border-white/40 hover:text-white transition-all duration-300"
              >
                Enviar mensaje
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
