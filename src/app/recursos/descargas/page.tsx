import Link from "next/link";

const descargas = [
  {
    titulo: "Diario de Pensamientos TCC",
    descripcion: "5 plantillas para registrar situaciones, emociones, pensamientos automáticos, evidencia y alternativas. Basado en el formato clásico de la Terapia Cognitivo-Conductual.",
    detalle: "1 página de instrucciones · 5 páginas de registro",
    formato: "PDF — A4, imprimible",
    color: "bg-rose-50 border-rose-200/60",
    acento: "text-rose-600",
    href: "/api/descargas/diario-tcc",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
];

const proximamente = [
  {
    titulo: "Plantilla Mood Tracker",
    descripcion: "Registro semanal de estado de ánimo, calidad del sueño y disparadores de ansiedad. Diseño para imprimir o usar en tablet.",
  },
  {
    titulo: "Guía de Higiene del Sueño",
    descripcion: "Infografía con los 8 hábitos más respaldados por la evidencia para mejorar la calidad del sueño.",
  },
  {
    titulo: "Registro de Actividades Agradables",
    descripcion: "Planilla para activar conductas positivas, útil en procesos de depresión o baja motivación.",
  },
];

export default function DescargasPage() {
  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold tracking-widest text-foreground/35 uppercase mb-3">Recursos</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark font-[family-name:var(--font-playfair)] mb-4">
            Materiales Descargables
          </h1>
          <p className="text-foreground/55 text-base leading-relaxed max-w-lg mx-auto">
            Plantillas y guías para complementar tu proceso terapéutico. Gratuitas, listas para imprimir o usar digitalmente.
          </p>
        </div>

        {/* Descargas disponibles */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-5">
            Disponibles ahora
          </h2>
          <div className="flex flex-col gap-4">
            {descargas.map((d) => (
              <div
                key={d.titulo}
                className={`rounded-2xl border p-6 ${d.color}`}
              >
                <div className="flex gap-5 items-start">
                  {/* Ícono */}
                  <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                    <svg className={`w-6 h-6 ${d.acento}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {d.icono}
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground font-[family-name:var(--font-playfair)] mb-1">
                      {d.titulo}
                    </h3>
                    <p className="text-sm text-foreground/55 leading-relaxed mb-3">{d.descripcion}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-foreground/40 mb-4">
                      <span>{d.detalle}</span>
                      <span>·</span>
                      <span>{d.formato}</span>
                    </div>
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark hover:-translate-y-0.5 transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Próximamente */}
        <section className="mb-14">
          <h2 className="text-xs font-semibold tracking-widest text-foreground/40 uppercase mb-5">
            Próximamente
          </h2>
          <div className="flex flex-col gap-3">
            {proximamente.map((p) => (
              <div
                key={p.titulo}
                className="bg-white/50 rounded-2xl border border-foreground/6 px-6 py-4 flex gap-4 items-start opacity-60"
              >
                <div className="w-8 h-8 rounded-lg bg-foreground/6 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground/60">{p.titulo}</p>
                  <p className="text-xs text-foreground/40 mt-0.5 leading-relaxed">{p.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-accent/10 border border-accent/20 px-6 py-6 text-center">
          <p className="text-foreground/70 text-sm leading-relaxed">
            Estos materiales son un apoyo, no un reemplazo del trabajo terapéutico. Si querés usarlos con acompañamiento,{" "}
            <Link href="/agendar" className="font-semibold text-primary hover:text-primary-dark transition-colors underline underline-offset-2">
              podés agendar una consulta.
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
