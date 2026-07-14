"use client";

import { useState } from "react";

const items = [
  {
    tag: "Comunidad LGBTQ+",
    body: "La terapia afirmativa no es solo \"aceptar\" tu orientación o identidad — es trabajar ansiedad, autoestima, vínculos, duelos o lo que sea que te trajo, desde un marco que entiende las experiencias específicas de la comunidad: el coming out, la homonegatividad internalizada, la construcción de identidad y más.",
  },
  {
    tag: "Relaciones no monógamas",
    body: "Las estructuras relacionales no monógamas traen sus propios retos: gestión de celos, comunicación entre múltiples personas, límites, inseguridad, acuerdos que cambian. Se trabajan esos temas con conocimiento real de cómo funcionan estas estructuras — no desde el supuesto de que la solución es la monogamia.",
  },
  {
    tag: "Deconstrucción religiosa",
    body: "Salir de un sistema religioso puede afectar la identidad, los vínculos familiares, la culpa, la sexualidad y la forma en que te relacionás con el mundo. Se trabaja ese proceso de manera integral: lo que perdiste, lo que estás construyendo y el impacto emocional que tiene en tu vida cotidiana.",
  },
  {
    tag: "Identidades no normativas",
    body: "Neurodivergencia, identidades de género no binarias, formas de vivir fuera de lo normativo — estas experiencias a menudo traen una carga extra: el esfuerzo de enmascararse, la sensación de no encajar, el agotamiento de explicarse. Se trabaja desde el reconocimiento de esa carga, no desde la expectativa de \"adaptarse\".",
  },
];

export default function MiPlusCards() {
  const [open, setOpen] = useState<string | null>(null);

  const selected = items.find((i) => i.tag === open);

  return (
    <>
      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {items.map((item) => (
          <button
            key={item.tag}
            onClick={() => setOpen(item.tag)}
            className="border border-white/20 rounded-xl px-4 py-3 text-center bg-white/5 hover:bg-white/10 hover:border-white/35 transition-colors duration-200 cursor-pointer"
          >
            <p className="text-sm text-white/70">{item.tag}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {open && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setOpen(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-primary-dark border border-white/15 rounded-2xl max-w-lg w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Mi plus</p>
            <h3 className="text-xl font-semibold text-white mb-4">{selected.tag}</h3>
            <p className="text-base text-white/70 leading-relaxed">{selected.body}</p>
          </div>
        </div>
      )}
    </>
  );
}
