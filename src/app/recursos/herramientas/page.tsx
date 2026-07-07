"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── InfoPopover ──────────────────────────────────────────────────────────────

function FloatingPopover({ coords, label, texto, onClose }: {
  coords: { top: number; left: number };
  label: string;
  texto: string;
  onClose: () => void;
}) {
  const W = 288;
  const left = Math.min(coords.left - 16, window.innerWidth - W - 12);
  const arrowLeft = 14;
  return require("react-dom").createPortal(
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
      <p className="text-xs font-semibold text-primary mb-1.5">{label}</p>
      <p className="text-xs text-foreground/60 leading-relaxed">{texto}</p>
    </motion.div>,
    document.body
  );
}

function InfoPopover({ label, texto }: { label: string; texto: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!btnRef.current?.closest("[data-popover-root]")?.contains(e.target as Node)) setOpen(false);
    }
    function onScroll() { setOpen(false); }
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 8, left: r.left + r.width / 2 - 8 });
    }
    setOpen((v) => !v);
  }

  return (
    <span data-popover-root="" className="inline-block">
      <button
        ref={btnRef}
        onClick={toggle}
        className="inline-flex items-center gap-1.5 text-xs text-foreground/40 hover:text-primary transition-colors"
        aria-label="Cómo funciona esta técnica"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        ¿Cómo funciona?
      </button>

      <AnimatePresence>
        {open && typeof document !== "undefined" && (
          <FloatingPopover coords={coords} label={label} texto={texto} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── Respiración ──────────────────────────────────────────────────────────────

type Tecnica = "box" | "478";

const tecnicas = {
  box: {
    label: "Respiración cuadrada",
    descripcion: "4 tiempos iguales. Ideal para el estrés cotidiano y antes de situaciones difíciles.",
    como: "Inhalá por la nariz, retené el aire, exhalá despacio por la boca, retené vacío. Los 4 tiempos iguales crean un ritmo simétrico que calma el sistema nervioso.",
    fases: [
      { nombre: "Inhala",   duracion: 4, color: "#8aaa96" },
      { nombre: "Retén",    duracion: 4, color: "#c4908f" },
      { nombre: "Exhala",   duracion: 4, color: "#8aaa96" },
      { nombre: "Retén",    duracion: 4, color: "#c4908f" },
    ],
  },
  "478": {
    label: "Técnica 4-7-8",
    descripcion: "Activa el sistema nervioso parasimpático. Muy efectiva para conciliar el sueño o calmar ansiedad aguda.",
    como: "Inhalá por la nariz 4 segundos, retené el aire 7 segundos, exhalá completamente por la boca 8 segundos. La exhalación larga es la clave: activa el freno del sistema nervioso.",
    fases: [
      { nombre: "Inhala",   duracion: 4,  color: "#8aaa96" },
      { nombre: "Retén",    duracion: 7,  color: "#c4908f" },
      { nombre: "Exhala",   duracion: 8,  color: "#8aaa96" },
    ],
  },
};

type RespState = { faseIdx: number; tick: number; ciclos: number };
type RespAction =
  | { type: "TICK"; faseCount: number; duracion: number }
  | { type: "RESET" };

function respReducer(state: RespState, action: RespAction): RespState {
  if (action.type === "RESET") return { faseIdx: 0, tick: 0, ciclos: 0 };
  const next_tick = state.tick + 1;
  if (next_tick >= action.duracion) {
    const nextFase = (state.faseIdx + 1) % action.faseCount;
    return {
      faseIdx: nextFase,
      tick: 0,
      ciclos: nextFase === 0 ? state.ciclos + 1 : state.ciclos,
    };
  }
  return { ...state, tick: next_tick };
}

function Respiracion() {
  const [tecnica, setTecnica] = useState<Tecnica>("box");
  const [corriendo, setCorriendo] = useState(false);
  const [{ faseIdx, tick, ciclos }, dispatch] = useReducer(respReducer, { faseIdx: 0, tick: 0, ciclos: 0 });

  const cfg = tecnicas[tecnica];
  const fase = cfg.fases[faseIdx];

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => {
      dispatch({ type: "TICK", faseCount: cfg.fases.length, duracion: fase.duracion });
    }, 1000);
    return () => clearInterval(id);
  }, [corriendo, faseIdx, fase.duracion, cfg.fases.length]);

  function toggleCorriendo() {
    if (corriendo) {
      setCorriendo(false);
      dispatch({ type: "RESET" });
    } else {
      setCorriendo(true);
    }
  }

  function cambiarTecnica(t: Tecnica) {
    setCorriendo(false);
    dispatch({ type: "RESET" });
    setTecnica(t);
  }

  const progreso = tick / fase.duracion;

  // Tamaño del círculo: expand en inhala, contrae en exhala
  const esInhala = fase.nombre === "Inhala";
  const esReten = fase.nombre === "Retén";
  const escala = corriendo
    ? esInhala ? 0.7 + progreso * 0.3
    : esReten ? (faseIdx === 1 ? 1 : 0.7)
    : 1 - progreso * 0.3
    : 0.85;

  return (
    <div>
      {/* Selector técnica */}
      <div className="flex gap-2 mb-8">
        {(Object.keys(tecnicas) as Tecnica[]).map((t) => (
          <button
            key={t}
            onClick={() => cambiarTecnica(t)}
            className={`relative px-4 py-1.5 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
              tecnica === t
                ? "text-white"
                : "text-foreground/50 border border-foreground/15 hover:text-foreground/80 hover:border-foreground/30"
            }`}
          >
            {tecnica === t && (
              <motion.span
                layoutId="chip-bg-tecnica"
                className="absolute inset-0 rounded-full bg-primary-dark"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tecnicas[t].label}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">{cfg.descripcion}</p>
      <div className="mb-10">
        <InfoPopover label={cfg.label} texto={cfg.como} />
      </div>

      {/* Círculo animado */}
      <div className="flex flex-col items-center gap-10">
        <div className="relative flex items-center justify-center w-56 h-56">
          {/* Anillo exterior de progreso */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
            <circle cx="112" cy="112" r="100" fill="none" stroke="#e8e4e0" strokeWidth="3" />
            {corriendo && (
              <circle
                key={`${faseIdx}-${tecnica}`}
                cx="112" cy="112" r="100"
                fill="none"
                stroke={fase.color}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeLinecap="round"
                style={{
                  ["--ring-circumference" as string]: `${2 * Math.PI * 100}`,
                  animation: `breath-ring ${fase.duracion}s linear forwards`,
                }}
              />
            )}
          </svg>

          {/* Círculo principal */}
          <div
            className="w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
            style={{
              backgroundColor: fase.color + "22",
              border: `2px solid ${fase.color}55`,
              transform: `scale(${escala})`,
            }}
          >
            {corriendo ? (
              <>
                <span className="text-2xl font-bold tabular-nums" style={{ color: fase.color }}>
                  {fase.duracion - tick}
                </span>
                <span className="text-xs font-semibold text-foreground/50 mt-0.5">{fase.nombre}</span>
              </>
            ) : (
              <span className="text-sm text-foreground/40 font-medium">Listo</span>
            )}
          </div>
        </div>

        {/* Fases visuales */}
        <div className="flex gap-3">
          {cfg.fases.map((f, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 transition-opacity ${corriendo && faseIdx === i ? "opacity-100" : "opacity-30"}`}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
              <span className="text-[10px] text-foreground/50">{f.nombre} {f.duracion}s</span>
            </div>
          ))}
        </div>

        {ciclos > 0 && (
          <p className="text-sm text-foreground/40">{ciclos} {ciclos === 1 ? "ciclo completado" : "ciclos completados"}</p>
        )}

        <button
          onClick={toggleCorriendo}
          className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
            corriendo
              ? "bg-foreground/8 text-foreground/60 hover:bg-foreground/12"
              : "bg-primary text-white hover:bg-primary-dark shadow-sm hover:-translate-y-0.5"
          }`}
        >
          {corriendo ? "Detener" : "Comenzar"}
        </button>
      </div>
    </div>
  );
}

// ─── Grounding 5-4-3-2-1 ─────────────────────────────────────────────────────

const pasos54321 = [
  {
    numero: 5,
    sentido: "Vista",
    instruccion: "Nombrá 5 cosas que podés VER ahora mismo.",
    ejemplos: "El techo, una ventana, tus manos, una silla, la luz...",
    color: "bg-sky-50 border-sky-200",
    acento: "text-sky-600",
    boton: "bg-sky-500 hover:bg-sky-600",
    barra: "bg-sky-400",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    ),
  },
  {
    numero: 4,
    sentido: "Tacto",
    instruccion: "Tocá 4 cosas y sentí su textura.",
    ejemplos: "Tu ropa, la silla, el piso con los pies, una mesa...",
    color: "bg-amber-50 border-amber-200",
    acento: "text-amber-600",
    boton: "bg-amber-500 hover:bg-amber-600",
    barra: "bg-amber-400",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    ),
  },
  {
    numero: 3,
    sentido: "Oído",
    instruccion: "Escuchá 3 sonidos distintos en tu entorno.",
    ejemplos: "El ventilador, voces, el viento, el tráfico, tu respiración...",
    color: "bg-violet-50 border-violet-200",
    acento: "text-violet-600",
    boton: "bg-violet-500 hover:bg-violet-600",
    barra: "bg-violet-400",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M8.464 8.464a5 5 0 000 7.072" />
    ),
  },
  {
    numero: 2,
    sentido: "Olfato",
    instruccion: "Identificá 2 aromas en tu entorno.",
    ejemplos: "Aire fresco, comida, tu ropa, un perfume, el ambiente...",
    color: "bg-rose-50 border-rose-200",
    acento: "text-rose-600",
    boton: "bg-rose-500 hover:bg-rose-600",
    barra: "bg-rose-400",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19c-4.418 0-8-3.134-8-7 0-1.607.59-3.085 1.563-4.237C6.54 6.554 8 5.25 8 3.5a.5.5 0 011 0c0 1.5 1.5 2.5 2.5 3.5S14 9.5 14 11c0 1.5-.5 2-1 3s1 2 1 2" />
    ),
  },
  {
    numero: 1,
    sentido: "Gusto",
    instruccion: "Notá 1 sabor en tu boca o tomá un sorbo de algo.",
    ejemplos: "Agua, café, el sabor neutro de tu boca...",
    color: "bg-teal-50 border-teal-200",
    acento: "text-teal-600",
    boton: "bg-teal-500 hover:bg-teal-600",
    barra: "bg-teal-400",
    icono: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
  },
];

function Grounding() {
  const [pasoActivo, setPasoActivo] = useState(0);
  const [completados, setCompletados] = useState<boolean[]>(Array(5).fill(false));
  const [terminado, setTerminado] = useState(false);

  function completarPaso() {
    const nuevos = [...completados];
    nuevos[pasoActivo] = true;
    setCompletados(nuevos);
    if (pasoActivo < 4) {
      setPasoActivo(pasoActivo + 1);
    } else {
      setTerminado(true);
    }
  }

  function reiniciar() {
    setPasoActivo(0);
    setCompletados(Array(5).fill(false));
    setTerminado(false);
  }

  const paso = pasos54321[pasoActivo];

  if (terminado) {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-6">
        <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-primary-dark mb-2">
            Bien hecho
          </h3>
          <p className="text-sm text-foreground/55 leading-relaxed max-w-xs">
            Acabás de traer tu mente al presente. Notá cómo está tu cuerpo ahora comparado con hace un momento.
          </p>
        </div>
        <button
          onClick={reiniciar}
          className="px-6 py-2.5 bg-foreground/8 text-foreground/60 rounded-xl text-sm font-semibold hover:bg-foreground/12 transition-colors"
        >
          Repetir
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-foreground/50 mb-8 leading-relaxed max-w-md">
        Técnica de anclaje sensorial para momentos de ansiedad o disociación. Te trae al presente usando tus 5 sentidos.
      </p>

      {/* Indicadores de paso */}
      <div className="flex gap-2 mb-8">
        {pasos54321.map((p, i) => (
          <button
            key={i}
            onClick={() => !completados[i] && i <= pasoActivo && setPasoActivo(i)}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              completados[i] || i === pasoActivo ? p.barra : "bg-foreground/10"
            } ${i === pasoActivo ? "opacity-100" : completados[i] ? "opacity-70" : "opacity-30"}`}
          />
        ))}
      </div>

      {/* Paso activo */}
      <div className={`rounded-2xl border p-6 mb-6 ${paso.color}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/70`}>
            <svg className={`w-6 h-6 ${paso.acento}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {paso.icono}
            </svg>
          </div>
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${paso.acento} opacity-70`}>
              Paso {paso.numero} · {paso.sentido}
            </span>
            <p className="text-base font-semibold text-foreground mt-0.5 leading-snug">
              {paso.instruccion}
            </p>
          </div>
        </div>
        <p className="text-sm text-foreground/45 italic pl-16 mb-6">
          Ejemplos: {paso.ejemplos}
        </p>
        <div className="flex justify-end">
          <button
            onClick={completarPaso}
            className={`px-6 py-3 text-white rounded-xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 transition-all ${paso.boton}`}
          >
            {pasoActivo < 4 ? "Siguiente →" : "Terminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

type Herramienta = "respiracion" | "grounding";

export default function HerramientasPage() {
  const [activa, setActiva] = useState<Herramienta>("respiracion");

  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-foreground/35 uppercase mb-3">Recursos</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-dark font-[family-name:var(--font-playfair)] mb-3">
            Herramientas de Bienestar
          </h1>
          <p className="text-foreground/55 text-base leading-relaxed max-w-md mx-auto">
            Técnicas basadas en evidencia para momentos de ansiedad, estrés o desconexión. Podés usarlas en cualquier momento.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-foreground/8 pb-6">
          {(["respiracion", "grounding"] as Herramienta[]).map((h) => (
            <button
              key={h}
              onClick={() => setActiva(h)}
              className={`relative px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
                activa === h
                  ? "text-white"
                  : "text-foreground/50 border border-foreground/15 hover:text-foreground/80 hover:border-foreground/30"
              }`}
            >
              {activa === h && (
                <motion.span
                  layoutId="chip-bg-herramienta"
                  className="absolute inset-0 rounded-full bg-primary-dark"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{h === "respiracion" ? "Respiración" : "Grounding 5-4-3-2-1"}</span>
            </button>
          ))}
        </div>

        {activa === "respiracion" && <Respiracion />}
        {activa === "grounding" && <Grounding />}

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-accent/10 border border-accent/20 px-6 py-6 text-center">
          <p className="text-foreground/70 text-sm leading-relaxed">
            Estas técnicas son un primer paso. Si el malestar persiste o querés herramientas personalizadas,{" "}
            <Link href="/agendar" className="font-semibold text-primary hover:text-primary-dark transition-colors underline underline-offset-2">
              podés agendar una consulta.
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
