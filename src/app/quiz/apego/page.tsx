"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePostHog } from "posthog-js/react";
import { gtagEvent } from "@/lib/gtag";

// ─── ECR-R: Experiences in Close Relationships — Revised (Fraley et al., 2000)
// 36 ítems, escala Likert 1–7
// Subescala Evitación: ítems 1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35 (pares impares, base 0: 0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34)
// Subescala Ansiedad:  ítems 2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36 (pares, base 0: 1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35)
// Ítems invertidos (R): el valor real = 8 - valor_marcado
// Evitación R: índices 0,2,4,6,8,10,12,14,16 — ítems 1,3,5,7,9,11,13,15,17 de la subescala evitación
// Ansiedad  R: índices 1,3,5,7,9,11,13,15,17 — ítems 2,4,6,8,10,12,14,16,18 de la subescala ansiedad (pero solo algunos)
// Ítems invertidos reales del ECR-R (índice base 0): 0,2,4,6,8,10,12,14,16 (evitación positivos) y 22,26,28 (ansiedad positivos)

const ITEMS: { texto: string; subescala: "evitacion" | "ansiedad"; invertido: boolean }[] = [
  // Evitación
  { texto: "Prefiero no mostrarle a mi pareja cómo me siento por dentro.", subescala: "evitacion", invertido: false },
  { texto: "Me preocupa que me abandonen.", subescala: "ansiedad", invertido: false },
  { texto: "Me siento muy cómodo/a siendo cercano/a a mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "Me preocupa mucho que las relaciones no duren.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta difícil permitirme depender de mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "No me preocupa quedarme solo/a.", subescala: "ansiedad", invertido: true },
  { texto: "Me siento incómodo/a cuando mi pareja quiere estar muy cerca de mí.", subescala: "evitacion", invertido: false },
  { texto: "Me frustra bastante que mi pareja no esté disponible cuando la necesito.", subescala: "ansiedad", invertido: false },
  { texto: "Me siento cómodo/a dependiendo de mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "No me preocupa demasiado que mi pareja me deje.", subescala: "ansiedad", invertido: true },
  { texto: "Me molesta que mi pareja quiera estar muy unida a mí.", subescala: "evitacion", invertido: false },
  { texto: "Necesito mucha seguridad de que mi pareja me quiere.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta relativamente fácil acercarme emocionalmente a mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "A veces siento que mi pareja no quiere acercarse tanto como yo quisiera.", subescala: "ansiedad", invertido: false },
  { texto: "Trato de evitar acercarme demasiado a mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "Cuando no puedo contactar a mi pareja, me angustio.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta difícil confiar completamente en mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "A veces siento que mis emociones están fuera de control.", subescala: "ansiedad", invertido: false },
  { texto: "Prefiero no mostrar mis necesidades emocionales a mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "Me preocupa no poder controlar mis sentimientos hacia mi pareja.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta difícil depender de otras personas.", subescala: "evitacion", invertido: false },
  { texto: "Raramente me preocupo por perder a mi pareja.", subescala: "ansiedad", invertido: true },
  { texto: "Prefiero no abrirme demasiado a mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "Siento pánico cuando pienso que puedo perder a mi pareja.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta difícil mostrarle afecto a mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "Me preocupa que me dejen de querer.", subescala: "ansiedad", invertido: false },
  { texto: "Soy bueno/a para compartir mis sentimientos con mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "Necesito que mi pareja me confirme constantemente que me quiere.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta cómodo abrirme emocionalmente con mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "Me molesta cuando mi pareja pasa tiempo sin mí.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta difícil abrirme con mi pareja.", subescala: "evitacion", invertido: false },
  { texto: "Me siento frustrado/a cuando mi pareja no está disponible.", subescala: "ansiedad", invertido: false },
  { texto: "Me resulta fácil sentirme cercano/a a mi pareja.", subescala: "evitacion", invertido: true },
  { texto: "Cuando discuto con mi pareja, siento que la relación se puede romper.", subescala: "ansiedad", invertido: false },
  { texto: "Me siento incómodo/a cuando mi pareja se acerca demasiado.", subescala: "evitacion", invertido: false },
  { texto: "Cuando estoy fuera de casa, me preocupa que mi pareja se interese por otra persona.", subescala: "ansiedad", invertido: false },
];

const OPCIONES = [
  { label: "Totalmente en desacuerdo", value: 1 },
  { label: "Bastante en desacuerdo",   value: 2 },
  { label: "Algo en desacuerdo",       value: 3 },
  { label: "Ni de acuerdo ni en desacuerdo", value: 4 },
  { label: "Algo de acuerdo",          value: 5 },
  { label: "Bastante de acuerdo",      value: 6 },
  { label: "Totalmente de acuerdo",    value: 7 },
];

function calcularSubescala(respuestas: number[], subescala: "evitacion" | "ansiedad") {
  let total = 0;
  let count = 0;
  ITEMS.forEach((item, i) => {
    if (item.subescala !== subescala) return;
    const v = item.invertido ? 8 - respuestas[i] : respuestas[i];
    total += v;
    count++;
  });
  return total / count; // promedio 1–7
}

type Nivel = "bajo" | "medio" | "alto";

function nivelDesde(promedio: number): Nivel {
  if (promedio < 3) return "bajo";
  if (promedio < 5) return "medio";
  return "alto";
}

const resultados: Record<string, { titulo: string; descripcion: string; recomendacion: string; color: string; titulo_color: string }> = {
  "bajo-bajo": {
    titulo: "Apego Seguro",
    descripcion: "Te sentís cómodo/a con la intimidad y no dependés en exceso de la validación de tu pareja. Podés acercarte sin miedo y estar solo/a sin angustia. Es el estilo de apego más saludable para las relaciones.",
    recomendacion: "Tus relaciones son probablemente una fuente de apoyo real. Seguir cultivando la comunicación emocional abierta mantiene este patrón.",
    color: "bg-teal-50 border-teal-200",
    titulo_color: "text-teal-700",
  },
  "bajo-medio": {
    titulo: "Apego predominantemente seguro con cierta ansiedad",
    descripcion: "Sos bastante cómodo/a con la cercanía, pero a veces experimentás preocupaciones sobre la disponibilidad o el afecto de tu pareja.",
    recomendacion: "Explorar de dónde vienen esas preocupaciones puede ayudarte a reducirlas. Suelen estar relacionadas con experiencias pasadas, no con la relación actual.",
    color: "bg-green-50 border-green-200",
    titulo_color: "text-green-700",
  },
  "bajo-alto": {
    titulo: "Apego Ansioso",
    descripcion: "Tendés a buscar mucha cercanía y validación, y te preocupa bastante la posibilidad de abandono o rechazo. No evitás la intimidad, pero la ansiedad puede generar dinámicas de dependencia.",
    recomendacion: "La terapia puede ayudarte a entender el origen de esa ansiedad y a construir mayor seguridad interna, sin depender tanto de la respuesta de tu pareja.",
    color: "bg-amber-50 border-amber-200",
    titulo_color: "text-amber-700",
  },
  "medio-bajo": {
    titulo: "Apego con tendencia evitativa leve",
    descripcion: "Podés relacionarte, pero preferís mantener cierta distancia emocional. No presentás ansiedad significativa — la incomodidad está más en la apertura que en el miedo al abandono.",
    recomendacion: "A veces esta distancia protege, pero también puede limitar la profundidad de los vínculos. Vale la pena explorar qué hay detrás de esa necesidad de espacio.",
    color: "bg-sky-50 border-sky-200",
    titulo_color: "text-sky-700",
  },
  "medio-medio": {
    titulo: "Apego Mixto",
    descripcion: "Mostrás rasgos de distintos estilos — a veces buscás cercanía y otras te protegés. Esto puede generar inconsistencia en cómo te relacionás.",
    recomendacion: "Explorar tus patrones en sesión puede darte mucha claridad. Los estilos mixtos suelen responder muy bien al trabajo terapéutico.",
    color: "bg-violet-50 border-violet-200",
    titulo_color: "text-violet-700",
  },
  "medio-alto": {
    titulo: "Apego con ansiedad predominante",
    descripcion: "Experimentás preocupaciones frecuentes sobre el abandono o el afecto de tu pareja, con algo de incomodidad también en la apertura emocional.",
    recomendacion: "El trabajo terapéutico enfocado en la regulación emocional y la historia de apego puede transformar significativamente estos patrones.",
    color: "bg-orange-50 border-orange-200",
    titulo_color: "text-orange-700",
  },
  "alto-bajo": {
    titulo: "Apego Evitativo",
    descripcion: "Tendés a mantener distancia emocional, te incomoda la dependencia y preferís no abrirte demasiado. No sentís mucha ansiedad de abandono, pero la intimidad puede resultarte difícil.",
    recomendacion: "El apego evitativo suele tener raíces en experiencias tempranas de invalidación emocional. La terapia puede ayudarte a construir vínculos más cercanos sin sentir amenaza.",
    color: "bg-blue-50 border-blue-200",
    titulo_color: "text-blue-700",
  },
  "alto-medio": {
    titulo: "Apego predominantemente evitativo",
    descripcion: "La evitación es tu patrón principal — preferís la independencia y te resulta difícil confiar o abrirte. Hay también algo de ansiedad en las relaciones.",
    recomendacion: "Este patrón puede llevar a relaciones superficiales o conflictivas. El trabajo terapéutico puede abrirte posibilidades de conexión que hoy se sienten lejanas.",
    color: "bg-indigo-50 border-indigo-200",
    titulo_color: "text-indigo-700",
  },
  "alto-alto": {
    titulo: "Apego Desorganizado",
    descripcion: "Presentás tanto alta evitación como alta ansiedad — buscás la cercanía pero también la temés, lo que puede crear patrones relacionales muy intensos o contradictorios.",
    recomendacion: "Este estilo suele asociarse con experiencias relacionales complejas. La psicoterapia es la herramienta más efectiva para trabajarlo. No estás roto/a — esto se puede transformar.",
    color: "bg-rose-50 border-rose-200",
    titulo_color: "text-rose-700",
  },
};

export default function ApegoPage() {
  const posthog = usePostHog();
  const [respuestas, setRespuestas] = useState<(number | null)[]>(Array(36).fill(null));
  const [itemActual, setItemActual] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  function responder(valor: number) {
    const nuevas = [...respuestas];
    nuevas[itemActual] = valor;
    setRespuestas(nuevas);
    if (itemActual < 35) {
      setItemActual(itemActual + 1);
    } else {
      const completadas = nuevas.filter((v) => v !== null) as number[];
      const pEvitacion = calcularSubescala(completadas.map((v, i) => v ?? 4), "evitacion");
      const pAnsiedad  = calcularSubescala(completadas.map((v, i) => v ?? 4), "ansiedad");
      posthog?.capture("quiz_completed", { quiz: "ECR-R", evitacion: pEvitacion.toFixed(2), ansiedad: pAnsiedad.toFixed(2) });
      gtagEvent("quiz_completed", { quiz_name: "ECR-R Apego" });
      setMostrarResultado(true);
    }
  }

  const respuestasFilled = respuestas.filter((v) => v !== null) as number[];
  const pEvitacion = mostrarResultado ? calcularSubescala(respuestasFilled.map((v) => v), "evitacion") : 0;
  const pAnsiedad  = mostrarResultado ? calcularSubescala(respuestasFilled.map((v) => v), "ansiedad")  : 0;
  const key = `${nivelDesde(pEvitacion)}-${nivelDesde(pAnsiedad)}`;
  const resultado = resultados[key] ?? resultados["medio-medio"];

  const progreso = ((itemActual + (mostrarResultado ? 1 : 0)) / 36) * 100;

  function reiniciar() {
    setRespuestas(Array(36).fill(null));
    setItemActual(0);
    setMostrarResultado(false);
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            ¿Cómo me vinculo con otros?
          </h1>
          <p className="mt-3 text-foreground/60">
            Pensá en cómo te sentís generalmente en tus relaciones de pareja o relaciones cercanas.
          </p>
        </motion.div>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2 text-right">
            {mostrarResultado ? "Completado" : `${itemActual + 1} de 36`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!mostrarResultado ? (
            <motion.div
              key={itemActual}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <p className="text-lg font-medium text-foreground mb-8 leading-relaxed">
                {ITEMS[itemActual].texto}
              </p>
              <div className="space-y-2">
                {OPCIONES.map((op) => (
                  <button
                    key={op.value}
                    onClick={() => responder(op.value)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-150 group flex items-center gap-3 ${
                      respuestas[itemActual] === op.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      respuestas[itemActual] === op.value ? "border-primary bg-primary" : "border-gray-300 group-hover:border-primary"
                    }`}>
                      {respuestas[itemActual] === op.value && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className={`text-sm transition-colors ${respuestas[itemActual] === op.value ? "text-primary font-medium" : "text-foreground/70 group-hover:text-primary"}`}>
                      {op.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Navegación */}
              {itemActual > 0 && (
                <button
                  onClick={() => setItemActual(itemActual - 1)}
                  className="mt-6 text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Pregunta anterior
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="resultado"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Puntuaciones visuales */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-5">Tus puntajes</p>
                <div className="space-y-4">
                  {[
                    { label: "Evitación", value: pEvitacion, color: "bg-blue-400" },
                    { label: "Ansiedad",  value: pAnsiedad,  color: "bg-rose-400" },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground/60 font-medium">{dim.label}</span>
                        <span className="text-foreground/40 tabular-nums">{dim.value.toFixed(1)} / 7</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${dim.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${((dim.value - 1) / 6) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground/35 mt-4 leading-relaxed">
                  Puntuación baja (&lt;3): poca evitación/ansiedad · Media (3–5): moderada · Alta (&gt;5): elevada
                </p>
              </div>

              {/* Resultado */}
              <div className={`p-6 rounded-2xl border ${resultado.color}`}>
                <p className={`text-xl font-bold font-[family-name:var(--font-playfair)] mb-2 ${resultado.titulo_color}`}>
                  {resultado.titulo}
                </p>
                <p className="text-foreground/65 text-sm leading-relaxed mb-3">{resultado.descripcion}</p>
                <p className="text-sm text-foreground/55 leading-relaxed">
                  <strong>Recomendación:</strong> {resultado.recomendacion}
                </p>
              </div>

              {/* CTA */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-foreground/70 mb-4 text-sm">
                  ¿Querés explorar tu estilo de apego con una profesional?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/agendar" className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors">
                    Agendar una sesión
                  </Link>
                  <button onClick={reiniciar} className="px-6 py-3 border-2 border-gray-200 text-foreground/60 rounded-xl font-medium text-sm hover:border-primary hover:text-primary transition-colors">
                    Repetir
                  </button>
                  <Link href="/quiz" className="px-6 py-3 border-2 border-gray-200 text-foreground/60 rounded-xl font-medium text-sm hover:border-primary hover:text-primary transition-colors">
                    Otros tests
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-section-alt rounded-xl">
                <p className="text-xs text-foreground/50 leading-relaxed">
                  <strong>Aviso:</strong> Basado en el ECR-R (Fraley, Waller & Brennan, 2000). Este cuestionario es una herramienta de reflexión, no un diagnóstico clínico. Solo un profesional puede realizar una evaluación completa.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
