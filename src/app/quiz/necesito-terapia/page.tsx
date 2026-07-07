"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const preguntas = [
  {
    texto: "¿Hay emociones (tristeza, ansiedad, rabia, vacío) que sentís que no podés controlar?",
    categoria: "emociones",
  },
  {
    texto: "¿Estas emociones o pensamientos interfieren con tu trabajo, estudios o vida diaria?",
    categoria: "funcionamiento",
  },
  {
    texto: "¿Evitás situaciones, personas o lugares por miedo, vergüenza o incomodidad?",
    categoria: "evitacion",
  },
  {
    texto: "¿Sentís que tus relaciones cercanas (familia, pareja, amigos) generan más malestar que bienestar?",
    categoria: "relaciones",
  },
  {
    texto: "¿Tenés pensamientos repetitivos o preocupaciones que no podés 'apagar'?",
    categoria: "pensamientos",
  },
  {
    texto: "¿Hay algo de tu historia personal o tu pasado que sentís que todavía te pesa?",
    categoria: "historia",
  },
  {
    texto: "¿Actuás de formas que después no entendés, o reaccionás más intensamente de lo que esperarías?",
    categoria: "autoconocimiento",
  },
  {
    texto: "¿Usás alguna conducta (comer, beber, trabajar, pantallas) para evitar sentir o pensar?",
    categoria: "conductas",
  },
];

type Respuesta = "si" | "no" | null;

export default function NecesitoTerapiaPage() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>(Array(preguntas.length).fill(null));
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const respondidas = respuestas.filter((r) => r !== null).length;
  const siCount = respuestas.filter((r) => r === "si").length;
  const todasRespondidas = respondidas === preguntas.length;

  function responder(i: number, valor: Respuesta) {
    setRespuestas((prev) => {
      const nuevo = [...prev];
      nuevo[i] = valor;
      return nuevo;
    });
  }

  function getResultado() {
    if (siCount <= 1) return {
      titulo: "Por ahora, no parece urgente",
      descripcion: "Tus respuestas no muestran señales de malestar significativo en este momento. Si en el futuro algo cambia, este checklist sigue disponible.",
      color: "border-teal-200 bg-teal-50",
      colorTitulo: "text-teal-700",
      cta: false,
    };
    if (siCount <= 4) return {
      titulo: "Podría ser un buen momento",
      descripcion: "Hay algunas áreas que merecen atención. No es alarma, pero sí una invitación a escucharte. La terapia puede ayudarte a entender estos patrones antes de que se intensifiquen.",
      color: "border-amber-200 bg-amber-50",
      colorTitulo: "text-amber-700",
      cta: true,
    };
    return {
      titulo: "Sí, la terapia puede ayudarte",
      descripcion: "Tus respuestas sugieren que hay varias áreas de tu vida que se verían beneficiadas con acompañamiento profesional. No tenés que resolver esto solo/a.",
      color: "border-primary/30 bg-primary/5",
      colorTitulo: "text-primary-dark",
      cta: true,
    };
  }

  const resultado = getResultado();

  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/70 transition-colors mb-6"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tests
          </Link>

          <h1 className="text-4xl font-bold text-primary-dark font-[family-name:var(--font-playfair)] mb-3">
            ¿Necesito terapia?
          </h1>
          <p className="text-foreground/55 leading-relaxed">
            Este checklist no es un diagnóstico — es una invitación a escucharte. Respondé con honestidad según cómo te sentís en este momento de tu vida.
          </p>
        </motion.div>

        {/* Preguntas */}
        {!mostrarResultado && (
          <div className="flex flex-col gap-4 mb-8">
            {preguntas.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl border p-5 transition-colors ${
                  respuestas[i] !== null ? "border-foreground/12" : "border-foreground/6"
                }`}
              >
                <p className="text-sm font-medium text-foreground/80 leading-relaxed mb-4">
                  <span className="text-foreground/25 mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {p.texto}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => responder(i, "si")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                      respuestas[i] === "si"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-foreground/5 text-foreground/50 hover:bg-foreground/10"
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => responder(i, "no")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                      respuestas[i] === "no"
                        ? "bg-foreground/15 text-foreground shadow-sm"
                        : "bg-foreground/5 text-foreground/50 hover:bg-foreground/10"
                    }`}
                  >
                    No
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Barra de progreso + botón */}
        {!mostrarResultado && (
          <div className="sticky bottom-6">
            <div className="bg-white rounded-2xl border border-foreground/8 shadow-lg p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-foreground/40 mb-1.5">
                  <span>{respondidas} de {preguntas.length} respondidas</span>
                  {todasRespondidas && <span className="text-primary font-semibold">¡Listo!</span>}
                </div>
                <div className="h-1.5 bg-foreground/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(respondidas / preguntas.length) * 100}%` }}
                  />
                </div>
              </div>
              <button
                disabled={!todasRespondidas}
                onClick={() => setMostrarResultado(true)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  todasRespondidas
                    ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                    : "bg-foreground/8 text-foreground/30 cursor-not-allowed"
                }`}
              >
                Ver resultado
              </button>
            </div>
          </div>
        )}

        {/* Resultado */}
        <AnimatePresence>
          {mostrarResultado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Resumen visual */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl font-bold text-primary tabular-nums">
                  {siCount}<span className="text-2xl text-foreground/25">/{preguntas.length}</span>
                </div>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  respondiste "sí" a {siCount} de las {preguntas.length} preguntas
                </p>
              </div>

              <div className={`rounded-2xl border p-6 mb-6 ${resultado.color}`}>
                <h2 className={`text-xl font-bold font-[family-name:var(--font-playfair)] mb-2 ${resultado.colorTitulo}`}>
                  {resultado.titulo}
                </h2>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {resultado.descripcion}
                </p>
              </div>

              {/* Nota de aclaración */}
              <p className="text-xs text-foreground/40 leading-relaxed mb-8 px-1">
                Este checklist es solo orientativo y no constituye un diagnóstico. La decisión de ir a terapia es personal — no necesitás una crisis para buscar apoyo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                {resultado.cta && (
                  <Link
                    href="/agendar"
                    className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Agendar una consulta
                  </Link>
                )}
                <button
                  onClick={() => { setRespuestas(Array(preguntas.length).fill(null)); setMostrarResultado(false); }}
                  className="flex-1 text-center px-6 py-3 bg-white border border-foreground/10 text-foreground/60 rounded-xl text-sm font-semibold hover:bg-foreground/5 transition-colors"
                >
                  Volver a responder
                </button>
                <Link
                  href="/quiz"
                  className="flex-1 text-center px-6 py-3 bg-white border border-foreground/10 text-foreground/60 rounded-xl text-sm font-semibold hover:bg-foreground/5 transition-colors"
                >
                  Ver otros tests
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
