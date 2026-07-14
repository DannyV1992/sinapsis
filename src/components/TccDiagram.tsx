"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const sectores = [
  {
    label: "Pensamientos",
    sub: "lo que te decís",
    color: "#c4908f",
    desc: "Las interpretaciones automáticas que hacemos de cada situación. Son creencias, juicios y predicciones que ocurren casi sin que nos demos cuenta — y que determinan cómo nos sentimos y actuamos.",
    // sector superior (12→4)
    d: "M150,150 L150,28 A122,122 0 0,1 255.6,211 Z",
  },
  {
    label: "Emociones",
    sub: "lo que sentís",
    color: "#8aaa96",
    desc: "La respuesta afectiva que generan esos pensamientos. Ansiedad, tristeza, culpa — cada emoción tiene un pensamiento detrás. Entender esa conexión es el primer paso para cambiarla.",
    // sector inferior derecho (4→8)
    d: "M150,150 L255.6,211 A122,122 0 0,1 44.4,211 Z",
  },
  {
    label: "Conductas",
    sub: "lo que hacés",
    color: "#4a3040",
    desc: "Las acciones que tomás en respuesta a esas emociones. Evitar, confrontar, aislarse — cada conducta refuerza o debilita los pensamientos originales, cerrando el ciclo.",
    // sector inferior izquierdo (8→12)
    d: "M150,150 L44.4,211 A122,122 0 0,1 150,28 Z",
  },
];

// ─── Popup flotante con la definición del sector ──────────────────────────────

function FloatingPopover({ coords, label, sub, color, texto }: {
  coords: { top: number; left: number };
  label: string;
  sub: string;
  color: string;
  texto: string;
}) {
  const W = 300;
  const left = Math.min(Math.max(coords.left - W / 2, 12), window.innerWidth - W - 12);
  const arrowLeft = coords.left - left - 6;
  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      style={{ position: "fixed", top: coords.top, left, width: W, zIndex: 9999 }}
      className="bg-white rounded-xl shadow-xl border border-foreground/8 p-4"
    >
      <div
        className="absolute top-0 w-3 h-3 bg-white border-l border-t border-foreground/8"
        style={{ left: arrowLeft, transform: "translateY(-50%) rotate(45deg)" }}
      />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <p className="text-sm font-bold text-foreground">{label}</p>
        <span className="text-xs text-foreground/40">— {sub}</span>
      </div>
      <p className="text-xs text-foreground/60 leading-relaxed">{texto}</p>
    </motion.div>,
    document.body
  );
}

export default function TccDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Cerrar al hacer click fuera o al hacer scroll
  useEffect(() => {
    if (active === null) return;
    function handler(e: MouseEvent) {
      if (!svgRef.current?.contains(e.target as Node)) setActive(null);
    }
    function onScroll() { setActive(null); }
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [active]);

  function toggle(i: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (active === i) { setActive(null); return; }
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    setCoords({ top: r.bottom + 10, left: r.left + r.width / 2 });
    setActive(i);
  }

  const current = active !== null ? sectores[active] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14 items-center">

      {/* Texto izquierda */}
      <div className="relative flex flex-col gap-5">
        <p className="absolute -top-8 left-0 text-xs tracking-[0.3em] text-foreground/50 uppercase">Mi enfoque</p>
        <p className="text-foreground/70 text-sm leading-relaxed">
          La terapia cognitivo-conductual (TCC) parte de una premisa sencilla: lo que pensamos influye en cómo nos sentimos, y cómo nos sentimos influye en cómo actuamos. Modificar uno de esos eslabones transforma los otros. Es estructurada, orientada a metas y con décadas de evidencia detrás — el tratamiento mejor respaldado para ansiedad, depresión, duelo y dificultades de relacionamiento.
        </p>
        <p className="text-foreground/70 text-sm leading-relaxed">
          En sesión aprendés a identificar los pensamientos automáticos que disparan tus emociones, a cuestionar su validez y a sustituirlos por interpretaciones más realistas. No se trata de "pensar positivo" — se trata de pensar con más precisión. Y trabajamos directo sobre las conductas: la evitación, la procrastinación, las reacciones impulsivas que sostienen el ciclo.
        </p>
        <p className="text-foreground/70 text-sm leading-relaxed">
          El proceso es colaborativo: vos traés el conocimiento de tu propia vida, yo aporto las herramientas. Juntos construimos un plan concreto, con objetivos claros y avances que podés medir.
        </p>
      </div>

      {/* Derecha: solo el círculo */}
      <div className="flex flex-col gap-4 bg-primary-dark/20 rounded-3xl px-6 pt-7 pb-8">

        <p className="text-center text-xs tracking-[0.25em] uppercase text-foreground/50 font-medium select-none">
          Todo está conectado
        </p>

        {/* Círculo */}
        <div className="relative w-full max-w-[240px] mx-auto aspect-square">
          <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-full drop-shadow-sm" style={{ filter: "drop-shadow(0 4px 24px rgba(196,144,143,0.15))" }}>
            <style>{`
              @keyframes tcc-ping {
                0%   { r:42; stroke-opacity:0.7; }
                80%  { r:58; stroke-opacity:0; }
                100% { r:58; stroke-opacity:0; }
              }
              @keyframes tcc-glow { 0%,100% { stroke-opacity:0.4; } 50% { stroke-opacity:1; } }
            `}</style>
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
                  onClick={(e) => toggle(i, e)}
                />
              </g>
            ))}

            {/* Separadores entre sectores */}
            <line x1="150" y1="150" x2="150" y2="28"    stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            <line x1="150" y1="150" x2="255.6" y2="211" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
            <line x1="150" y1="150" x2="44.4"  y2="211" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />

            {/* Círculo exterior */}
            <circle cx="150" cy="150" r="122" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />

            {/* Etiquetas de sectores */}
            <text x="150" y="228" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 0 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">1.</tspan> Pensamientos
            </text>
            <text x="82" y="111" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 1 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">2.</tspan> Emociones
            </text>
            <text x="218" y="111" textAnchor="middle" dominantBaseline="middle" fill="white" fillOpacity={active === 2 ? 1 : 0.85} fontSize="11" fontWeight="600" className="select-none pointer-events-none">
              <tspan fontWeight="700">3.</tspan> Conductas
            </text>

            {/* Círculo central */}
            <circle cx="150" cy="150" r="42" fill="#f7f4f2" stroke="#4a3040" strokeOpacity="0.12" strokeWidth="1" className="pointer-events-none" />
            {/* Anillos que invitan a tocar: radar expansivo + borde pulsante (encima del relleno) */}
            {active === null && (
              <g className="pointer-events-none">
                <circle cx="150" cy="150" fill="none" stroke="#4a3040" strokeWidth="1.5"
                  style={{ animation: "tcc-ping 2s ease-out infinite" }} />
                <circle cx="150" cy="150" fill="none" stroke="#4a3040" strokeWidth="1.5"
                  style={{ animation: "tcc-ping 2s ease-out infinite 1s" }} />
                <circle cx="150" cy="150" r="42" fill="none" stroke="#4a3040" strokeWidth="2"
                  style={{ animation: "tcc-glow 2s ease-in-out infinite" }} />
              </g>
            )}
            {active === null ? (
              <>
                <text x="150" y="146" textAnchor="middle" fill="#4a3040" fillOpacity="0.85" fontSize="9.5" fontWeight="700" letterSpacing="0.5" className="select-none pointer-events-none">Toca un</text>
                <text x="150" y="159" textAnchor="middle" fill="#4a3040" fillOpacity="0.85" fontSize="9.5" fontWeight="700" letterSpacing="0.5" className="select-none pointer-events-none">sector</text>
              </>
            ) : (
              <>
                <text x="150" y="145" textAnchor="middle" fill="#4a3040" fillOpacity="0.9" fontSize="10" fontWeight="700" letterSpacing="1.5" className="select-none pointer-events-none">TCC</text>
                <text x="150" y="160" textAnchor="middle" fill="#4a3040" fillOpacity="0.65" fontSize="10.5" fontStyle="italic" className="select-none pointer-events-none">ciclo cognitivo</text>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Popup con la definición */}
      <AnimatePresence>
        {current && typeof document !== "undefined" && (
          <FloatingPopover coords={coords} label={current.label} sub={current.sub} color={current.color} texto={current.desc} />
        )}
      </AnimatePresence>
    </div>
  );
}
