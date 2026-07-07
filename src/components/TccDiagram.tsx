"use client";
import { useState } from "react";

const sectores = [
  {
    label: "Pensamientos",
    sub: "lo que te decís",
    color: "#c4908f",
    colorClass: "text-primary",
    borderClass: "border-primary",
    bgClass: "bg-primary/8",
    desc: "Las interpretaciones automáticas que hacemos de cada situación. Son creencias, juicios y predicciones que ocurren casi sin que nos demos cuenta — y que determinan cómo nos sentimos y actuamos.",
    // sector superior (12→4)
    d: "M150,150 L150,28 A122,122 0 0,1 255.6,211 Z",
    labelAngle: 330, // posición del label en grados (para calcular xy)
  },
  {
    label: "Emociones",
    sub: "lo que sentís",
    color: "#8aaa96",
    colorClass: "text-accent",
    borderClass: "border-accent",
    bgClass: "bg-accent/10",
    desc: "La respuesta afectiva que generan esos pensamientos. Ansiedad, tristeza, culpa — cada emoción tiene un pensamiento detrás. Entender esa conexión es el primer paso para cambiarla.",
    // sector inferior derecho (4→8)
    d: "M150,150 L255.6,211 A122,122 0 0,1 44.4,211 Z",
    labelAngle: 90,
  },
  {
    label: "Conductas",
    sub: "lo que hacés",
    color: "#4a3040",
    colorClass: "text-primary-dark",
    borderClass: "border-primary-dark",
    bgClass: "bg-primary-dark/6",
    desc: "Las acciones que tomás en respuesta a esas emociones. Evitar, confrontar, aislarse — cada conducta refuerza o debilita los pensamientos originales, cerrando el ciclo.",
    // sector inferior izquierdo (8→12)
    d: "M150,150 L44.4,211 A122,122 0 0,1 150,28 Z",
    labelAngle: 210,
  },
];

export default function TccDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const current = active !== null ? sectores[active] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

      {/* Texto izquierda */}
      <div className="relative">
        <p className="absolute -top-8 left-0 text-xs tracking-[0.3em] text-foreground/50 uppercase">Mi enfoque</p>
        <p className="text-foreground/70 text-base leading-relaxed mb-6">
          La terapia cognitivo-conductual (TCC) parte de una premisa sencilla: lo que pensamos influye en cómo nos sentimos, y cómo nos sentimos influye en cómo actuamos. Modificar uno de esos eslabones transforma los otros.
        </p>
        <p className="text-foreground/70 text-base leading-relaxed mb-6">
          A diferencia de otros enfoques, la TCC es estructurada, orientada a metas y con resultados medibles. Tiene décadas de respaldo científico y es el tratamiento con mayor evidencia para ansiedad, depresión, baja autoestima, duelo y dificultades de relacionamiento.
        </p>
        <p className="text-foreground/70 text-base leading-relaxed mb-6">
          En sesión, aprendés a identificar los pensamientos automáticos que disparan tus emociones, a cuestionar su validez y a sustituirlos por interpretaciones más realistas. No se trata de "pensar positivo" — se trata de pensar con más precisión.
        </p>
        <p className="text-foreground/70 text-base leading-relaxed mb-6">
          La TCC también trabaja directamente sobre las conductas: los patrones de evitación, la procrastinación, las reacciones impulsivas. Pequeños cambios en el comportamiento generan nuevas experiencias, y esas experiencias transforman las creencias.
        </p>
        <p className="text-foreground/70 text-base leading-relaxed">
          El proceso es colaborativo: vos traés el conocimiento de tu propia vida, yo aporto las herramientas. Juntas construimos un plan concreto, con objetivos claros y avances que podés medir.
        </p>
      </div>

      {/* Derecha: círculo + cuadro */}
      <div className="flex flex-col gap-6 bg-primary-dark/20 rounded-3xl p-8">

        {/* Círculo */}
        <div className="relative w-full max-w-[320px] mx-auto aspect-square mt-4">
          <p className="absolute -top-7 left-0 right-0 text-center text-xs tracking-[0.25em] uppercase text-foreground/50 font-medium select-none">
            Todo está conectado
          </p>
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-sm" style={{ filter: "drop-shadow(0 4px 24px rgba(196,144,143,0.15))" }}>
            <defs>
              <radialGradient id="glow-p" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c4908f" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c4908f" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-e" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8aaa96" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8aaa96" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-c" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4a3040" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#4a3040" stopOpacity="0" />
              </radialGradient>
            </defs>

            {sectores.map((s, i) => (
              <g key={s.label}>
                {/* Halo cuando está activo */}
                {active === i && (
                  <path d={s.d} fill={`url(#glow-${["p","e","c"][i]})`} transform="scale(1.08) translate(-12,-12)" />
                )}
                <path
                  d={s.d}
                  fill={s.color}
                  fillOpacity={active === i ? 0.92 : active === null ? 0.70 : 0.25}
                  stroke={s.color}
                  strokeOpacity={active === i ? 1 : 0.5}
                  strokeWidth={active === i ? 2 : 1}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setActive(active === i ? null : i)}
                />
              </g>
            ))}

            {/* Separadores entre sectores */}
            <line x1="150" y1="150" x2="150" y2="28"    stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            <line x1="150" y1="150" x2="255.6" y2="211" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            <line x1="150" y1="150" x2="44.4"  y2="211" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />

            {/* Círculo exterior */}
            <circle cx="150" cy="150" r="122" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

            {/* Círculo central */}
            <circle cx="150" cy="150" r="42" fill="#f7f4f2" stroke="#4a3040" strokeOpacity="0.12" strokeWidth="1" />
            <text x="150" y="145" textAnchor="middle" fill="#4a3040" fillOpacity="0.9" fontSize="10" fontWeight="700" letterSpacing="1.5">TCC</text>
            <text x="150" y="160" textAnchor="middle" fill="#4a3040" fillOpacity="0.65" fontSize="10.5" fontStyle="italic">ciclo cognitivo</text>

            {/*
              Sectores de 120° cada uno. Centroide a r=78px del centro.
              Pensamientos: arco 270°→30° (derecha-arriba), centroide 330° → (218, 111)
              Emociones:    arco  30°→150° (abajo),         centroide  90° → (150, 228)
              Conductas:    arco 150°→270° (izquierda-arriba), centroide 210° → (82, 111)
            */}
            <text x="150" y="228" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 0 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">1.</tspan> Pensamientos
            </text>
            <text x="82" y="111" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 1 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">2.</tspan> Emociones
            </text>
            <text x="218" y="111" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 2 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">3.</tspan> Conductas
            </text>
          </svg>
        </div>

        {/* Cuadro de descripción */}
        <div
          className={`rounded-2xl border transition-all duration-300 min-h-[120px] ${
            current
              ? "border-foreground/15 bg-white/80"
              : "border-foreground/15 bg-white/80"
          }`}
        >
          {current ? (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: current.color }} />
                <p className="text-sm font-bold text-foreground">{current.label}</p>
                <span className="text-xs text-foreground/40">— {current.sub}</span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">{current.desc}</p>
            </div>
          ) : (
            <div className="p-6 flex items-center justify-center h-full">
              <p className="text-xs text-foreground/50 italic text-center">
                Tocá un sector para explorar cada elemento del ciclo.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
