"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

type Categoria = "todos" | "libros" | "podcasts" | "ted" | "documentales";

type Item = {
  titulo: string;
  autor: string;
  descripcion: string;
  etiquetas: string[];
  url: string;
  categoria: Categoria;
};

const items: Item[] = [
  // Libros
  {
    titulo: "El cuerpo lleva la cuenta",
    autor: "Bessel van der Kolk",
    descripcion: "Referencia fundamental sobre cómo el trauma se almacena en el cuerpo y cómo sanar desde enfoques somáticos y neurológicos.",
    etiquetas: ["Trauma", "Neurociencia"],
    url: "https://www.amazon.com/-/es/Bessel-van-der-Kolk/dp/0143127748",
    categoria: "libros",
  },
  {
    titulo: "Amar con los ojos abiertos",
    autor: "Jorge Bucay & Silvia Salinas",
    descripcion: "Una novela terapéutica sobre los vínculos amorosos, el apego y cómo construir relaciones más conscientes y saludables.",
    etiquetas: ["Vínculos", "Relaciones"],
    url: "https://www.amazon.com/-/es/Jorge-Bucay/dp/8484453529",
    categoria: "libros",
  },
  {
    titulo: "La trampa de la felicidad",
    autor: "Russ Harris",
    descripcion: "Introducción accesible a la Terapia de Aceptación y Compromiso (ACT). Ideal si querés aprender a relacionarte diferente con tus pensamientos.",
    etiquetas: ["ACT", "Ansiedad"],
    url: "https://www.amazon.com/-/es/Russ-Harris/dp/1590305841",
    categoria: "libros",
  },
  {
    titulo: "Minuto a minuto, día a día",
    autor: "Jon Kabat-Zinn",
    descripcion: "El libro que popularizó el mindfulness basado en evidencia (MBSR). Práctico, sin misticismo, con fundamentos científicos sólidos.",
    etiquetas: ["Mindfulness", "Estrés"],
    url: "https://www.amazon.com/-/es/Jon-Kabat-Zinn/dp/8449321050",
    categoria: "libros",
  },
  {
    titulo: "Inteligencia Emocional",
    autor: "Daniel Goleman",
    descripcion: "El clásico que revolucionó cómo entendemos las emociones en la vida cotidiana, el trabajo y las relaciones. Lectura obligatoria.",
    etiquetas: ["Emociones", "Autoconocimiento"],
    url: "https://www.amazon.com/-/es/Daniel-Goleman/dp/055338371X",
    categoria: "libros",
  },
  {
    titulo: "Attached",
    autor: "Amir Levine & Rachel Heller",
    descripcion: "Explica la teoría del apego aplicada a las relaciones adultas. Muy útil para entender patrones de ansiedad, evitación o seguridad.",
    etiquetas: ["Apego", "Relaciones"],
    url: "https://www.amazon.com/-/es/Amir-Levine/dp/1101400234",
    categoria: "libros",
  },
  {
    titulo: "Sentirse bien",
    autor: "David D. Burns",
    descripcion: "Manual práctico de TCC con técnicas concretas para trabajar pensamientos negativos, baja autoestima y depresión.",
    etiquetas: ["TCC", "Depresión"],
    url: "https://www.amazon.com/-/es/David-D-Burns/dp/0380810336",
    categoria: "libros",
  },
  {
    titulo: "El poder del ahora",
    autor: "Eckhart Tolle",
    descripcion: "Una perspectiva profunda sobre la presencia y el sufrimiento generado por la mente. Punto de encuentro entre espiritualidad y bienestar psicológico.",
    etiquetas: ["Mindfulness", "Autoconocimiento"],
    url: "https://www.amazon.com/-/es/Eckhart-Tolle/dp/1577314808",
    categoria: "libros",
  },
  // Podcasts
  {
    titulo: "Psicología Al Desnudo",
    autor: "Psi Mammoliti",
    descripcion: "Una psicóloga española que habla de salud mental de forma directa, sin filtros y con mucho humor. Muy popular en hispanohablantes.",
    etiquetas: ["En español"],
    url: "https://open.spotify.com/show/1TDJJoHWEq7Nbh3yEBOJOj",
    categoria: "podcasts",
  },
  {
    titulo: "Huberman Lab",
    autor: "Andrew Huberman",
    descripcion: "Neurocientífico de Stanford que explica ciencia del cerebro, estrés, sueño y bienestar con evidencia. Técnico pero muy accesible.",
    etiquetas: ["En inglés", "Neurociencia"],
    url: "https://open.spotify.com/show/79CkJF3UJTHFV8Dse3Oy0P",
    categoria: "podcasts",
  },
  {
    titulo: "Entiende Tu Mente",
    autor: "Molo, Luis Muiño & Mónica González",
    descripcion: "Tres psicólogos que analizan comportamientos cotidianos con respaldo científico. Episodios cortos, perfectos para el día a día.",
    etiquetas: ["En español"],
    url: "https://open.spotify.com/show/0sGGLIDnnijRPLef7InllD",
    categoria: "podcasts",
  },
  {
    titulo: "Ten Percent Happier",
    autor: "Dan Harris",
    descripcion: "Entrevistas con expertos en meditación, mindfulness y bienestar mental. Muy práctico para quien no tiene experiencia meditando.",
    etiquetas: ["En inglés", "Mindfulness"],
    url: "https://open.spotify.com/show/1CfW319UkBMVhCXfei8huv",
    categoria: "podcasts",
  },
  // TED
  {
    titulo: "El poder de la vulnerabilidad",
    autor: "Brené Brown",
    descripcion: "Una de las charlas TED más vistas de la historia. Brown explica por qué abrirse emocionalmente es un acto de valentía, no de debilidad.",
    etiquetas: ["20 min"],
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    categoria: "ted",
  },
  {
    titulo: "¿Cómo hacer que el estrés sea tu amigo?",
    autor: "Kelly McGonigal",
    descripcion: "La psicóloga revisa la evidencia y muestra que el problema no es el estrés en sí, sino cómo lo interpretamos.",
    etiquetas: ["15 min"],
    url: "https://www.ted.com/talks/kelly_mcgonigal_how_to_make_stress_your_friend",
    categoria: "ted",
  },
  {
    titulo: "Depresión, el secreto que compartimos",
    autor: "Andrew Solomon",
    descripcion: "Un relato honesto y profundo sobre qué se siente vivir con depresión, y por qué hablar de ello importa.",
    etiquetas: ["30 min"],
    url: "https://www.ted.com/talks/andrew_solomon_depression_the_secret_we_share",
    categoria: "ted",
  },
  {
    titulo: "Por qué todos deberíamos ir al psicólogo",
    autor: "Guy Winch",
    descripcion: "Argumenta por qué cuidamos más nuestra salud física que la emocional, y propone la \"higiene emocional\" cotidiana.",
    etiquetas: ["17 min"],
    url: "https://www.ted.com/talks/guy_winch_the_case_for_emotional_hygiene",
    categoria: "ted",
  },
  // Documentales
  {
    titulo: "The Mind, Explained",
    autor: "Netflix",
    descripcion: "Serie corta que explica el funcionamiento de la ansiedad, el sueño, la memoria y la meditación con rigor científico.",
    etiquetas: ["Serie", "Netflix"],
    url: "https://www.netflix.com/title/81098586",
    categoria: "documentales",
  },
  {
    titulo: "Stutz",
    autor: "Netflix",
    descripcion: "El actor Jonah Hill documenta sus sesiones con su terapeuta Phil Stutz. Muestra herramientas terapéuticas reales en un formato íntimo.",
    etiquetas: ["Documental", "Netflix"],
    url: "https://www.netflix.com/title/81387962",
    categoria: "documentales",
  },
  {
    titulo: "Take Your Pills: Xanax",
    autor: "Netflix",
    descripcion: "Documental sobre la epidemia de ansiedad y el uso masivo de benzodiacepinas. Abre la conversación sobre salud mental y medicalización.",
    etiquetas: ["Documental", "Netflix"],
    url: "https://www.netflix.com/title/81537802",
    categoria: "documentales",
  },
];

const tabs: { id: Categoria; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "libros", label: "Libros" },
  { id: "podcasts", label: "Podcasts" },
  { id: "ted", label: "Charlas TED" },
  { id: "documentales", label: "Documentales" },
];

const categoriaConfig: Record<Exclude<Categoria, "todos">, { color: string; acento: string }> = {
  libros:       { color: "bg-rose-50   border-rose-200/60",   acento: "text-rose-400" },
  podcasts:     { color: "bg-teal-50   border-teal-200/60",   acento: "text-teal-500" },
  ted:          { color: "bg-orange-50 border-orange-200/60", acento: "text-orange-400" },
  documentales: { color: "bg-violet-50 border-violet-200/60", acento: "text-violet-400" },
};

export default function BibliotecaPage() {
  const [activo, setActivo] = useState<Categoria>("todos");

  const filtrados = activo === "todos" ? items : items.filter((i) => i.categoria === activo);

  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header editorial */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-foreground/35 uppercase mb-3">Recursos</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark font-[family-name:var(--font-playfair)] mb-4">
            Biblioteca
          </h1>
          <p className="text-foreground/55 text-lg max-w-lg">
            Libros, podcasts, charlas y documentales que podrian resultarte interesantes para acompañar tu proceso de autoconocimiento.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-foreground/8 pb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivo(tab.id)}
              className={`relative px-4 py-1.5 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
                activo === tab.id
                  ? "text-white"
                  : "text-foreground/50 border border-foreground/15 hover:text-foreground/80 hover:border-foreground/30"
              }`}
            >
              {activo === tab.id && (
                <motion.span
                  layoutId="chip-bg-biblioteca"
                  className="absolute inset-0 rounded-full bg-primary-dark"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
          <span className="ml-auto text-sm text-foreground/30 self-center tabular-nums">
            {filtrados.length} {filtrados.length === 1 ? "recurso" : "recursos"}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtrados.map((item, i) => {
            const cfg = categoriaConfig[item.categoria as Exclude<Categoria, "todos">];
            return (
              <a
                key={`${item.categoria}-${item.titulo}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg ${cfg.color}`}
              >
                {/* Número */}
                <span className={`text-5xl font-bold leading-none mb-4 select-none transition-opacity group-hover:opacity-70 ${cfg.acento} opacity-20`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Contenido */}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground/35 uppercase tracking-wider mb-1">
                    {item.autor}
                  </p>
                  <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-playfair)] leading-snug mb-2 group-hover:text-primary-dark transition-colors">
                    {item.titulo}
                  </h2>
                  <p className="text-sm text-foreground/55 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.etiquetas.map((e) => (
                      <span
                        key={e}
                        className="text-xs font-medium bg-white/70 text-foreground/50 px-2 py-0.5 rounded-full"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <svg
                    className={`w-4 h-4 shrink-0 opacity-0 group-hover:opacity-60 transition-all translate-x-0 group-hover:translate-x-0.5 ${cfg.acento}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-accent/10 border border-accent/20 px-6 py-6 text-center">
          <p className="text-foreground/70 text-sm leading-relaxed">
            Estos recursos complementan —pero no reemplazan— el acompañamiento profesional. Si querés dar un paso más,{" "}
            <Link href="/agendar" className="font-semibold text-primary hover:text-primary-dark transition-colors underline underline-offset-2">
              podés agendar una consulta.
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
