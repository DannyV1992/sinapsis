"use client";

import { useState, useEffect, useRef, useReducer } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── InfoPopover ──────────────────────────────────────────────────────────────

function FloatingPopover({ coords, label, texto }: {
  coords: { top: number; left: number };
  label: string;
  texto: string;
}) {
  const W = 288;
  const left = Math.min(coords.left - 16, window.innerWidth - W - 12);
  const arrowLeft = 14;
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
          <FloatingPopover coords={coords} label={label} texto={texto} />
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

function Respiracion({ tecnicaInicial = "478" }: { tecnicaInicial?: Tecnica }) {
  const [corriendo, setCorriendo] = useState(false);
  const [{ faseIdx, tick, ciclos }, dispatch] = useReducer(respReducer, { faseIdx: 0, tick: 0, ciclos: 0 });

  const cfg = tecnicas[tecnicaInicial];
  const fase = cfg.fases[faseIdx];

  useEffect(() => {
    setCorriendo(false);
    dispatch({ type: "RESET" });
  }, [tecnicaInicial]);

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

  const progreso = tick / fase.duracion;

  const esInhala = fase.nombre === "Inhala";
  const esReten = fase.nombre === "Retén";
  const escala = corriendo
    ? esInhala ? 0.7 + progreso * 0.3
    : esReten ? (faseIdx === 1 ? 1 : 0.7)
    : 1 - progreso * 0.3
    : 0.85;

  return (
    <div>
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
                key={`${faseIdx}-${tecnicaInicial}`}
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
    instruccion: "Nombrá 5 cosas que podés ver ahora mismo.",
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
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">
        Técnica de anclaje sensorial para momentos de ansiedad o disociación. Te trae al presente usando tus 5 sentidos.
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Grounding 5-4-3-2-1"
          texto="Cuando hay ansiedad, la mente se va al pasado o al futuro. Esta técnica interrumpe ese patrón forzando la atención al momento presente a través de los sentidos. El conteo descendente estructura la atención y hace más difícil que los pensamientos intrusivos se impongan."
        />
      </div>

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

// ─── Escáner Corporal ─────────────────────────────────────────────────────────

const zonasEscaner = [
  { nombre: "Cabeza y rostro",  duracion: 30, instruccion: "Notá tu frente, mandíbula y cuero cabelludo. ¿Hay tensión? No trates de cambiarla, solo observá.",  bg: "bg-violet-50 border-violet-200", acento: "text-violet-600", barra: "bg-violet-400" },
  { nombre: "Cuello y hombros", duracion: 30, instruccion: "Observá si tus hombros están elevados o tensos. Dejá que desciendan con naturalidad.",                bg: "bg-sky-50 border-sky-200",       acento: "text-sky-600",    barra: "bg-sky-400"    },
  { nombre: "Pecho y espalda",  duracion: 30, instruccion: "Sentí el movimiento de tu pecho al respirar. ¿Hay presión, calor o apertura en esta zona?",           bg: "bg-rose-50 border-rose-200",     acento: "text-rose-600",   barra: "bg-rose-400"   },
  { nombre: "Abdomen",          duracion: 30, instruccion: "¿Tu abdomen está tenso o suelto? Dejá que se relaje con cada exhalación.",                             bg: "bg-amber-50 border-amber-200",   acento: "text-amber-600",  barra: "bg-amber-400"  },
  { nombre: "Manos y brazos",   duracion: 30, instruccion: "¿Tus manos están apretadas o abiertas? Recorre mentalmente desde los hombros hasta los dedos.",        bg: "bg-teal-50 border-teal-200",     acento: "text-teal-600",   barra: "bg-teal-400"   },
  { nombre: "Piernas y pies",   duracion: 30, instruccion: "Sentí el contacto de tus pies con el piso. Recorre desde las caderas hasta los dedos.",                bg: "bg-orange-50 border-orange-200", acento: "text-orange-600", barra: "bg-orange-400" },
];

function EscanerCorporal() {
  const [corriendo, setCorriendo] = useState(false);
  const [zonaIdx, setZonaIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const zona = zonasEscaner[zonaIdx];
  const progreso = tick / zona.duracion;

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [corriendo, zonaIdx]);

  useEffect(() => {
    if (!corriendo || tick < zona.duracion) return;
    if (zonaIdx < zonasEscaner.length - 1) {
      setZonaIdx((z) => z + 1);
      setTick(0);
    } else {
      setCorriendo(false);
      setTerminado(true);
    }
  }, [tick, corriendo, zonaIdx, zona.duracion]);

  function toggleCorriendo() {
    if (corriendo) {
      setCorriendo(false);
      setZonaIdx(0);
      setTick(0);
      setTerminado(false);
    } else {
      setTerminado(false);
      setCorriendo(true);
    }
  }

  function reiniciar() {
    setCorriendo(false);
    setZonaIdx(0);
    setTick(0);
    setTerminado(false);
  }

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
            Escáner completado
          </h3>
          <p className="text-sm text-foreground/55 leading-relaxed max-w-xs">
            Tomaste un momento para conectar con tu cuerpo. Notá cómo estás ahora comparado con antes de empezar.
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
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">
        Recorrido guiado por el cuerpo para detectar tensión y volver al presente. Cada zona dura 30 segundos.
      </p>
      <div className="mb-10">
        <InfoPopover
          label="Escáner corporal"
          texto="Llevás la atención, de forma sistemática, por distintas partes del cuerpo. No buscás relajarte a la fuerza: solo observás. La observación sin juicio, por sí sola, reduce la activación del sistema nervioso."
        />
      </div>

      {/* Indicadores de zona */}
      <div className="flex gap-1.5 mb-8">
        {zonasEscaner.map((z, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i === zonaIdx ? z.barra : i < zonaIdx ? z.barra : "bg-foreground/10"} ${i < zonaIdx ? "opacity-50" : i === zonaIdx ? "opacity-100" : "opacity-30"}`}
          />
        ))}
      </div>

      {/* Zona activa */}
      <div className={`rounded-2xl border p-6 mb-8 ${zona.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold uppercase tracking-widest opacity-70 ${zona.acento}`}>
            {zonaIdx + 1} / {zonasEscaner.length} · {zona.nombre}
          </span>
          {corriendo && (
            <div className={`text-3xl font-bold tabular-nums ${zona.acento}`}>
              {zona.duracion - tick}s
            </div>
          )}
        </div>
        <p className="text-sm text-foreground/60 leading-relaxed">{zona.instruccion}</p>
        {corriendo && (
          <div className="mt-4 h-1 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${zona.barra}`}
              style={{ width: `${progreso * 100}%`, transition: "width 1s linear" }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-center">
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

// ─── Rueda de Emociones (Plutchik) ───────────────────────────────────────────

type NivelEmocion = {
  similares: string;
  sensaciones: string;
  mensaje: string;
  proposito: string;
  opuesto: string;
};

type EmocionP = {
  primaria: string;
  intensa: string;
  leve: string;
  color: string;
  dataPrimaria: NivelEmocion;
  dataIntensa: NivelEmocion;
  dataLeve: NivelEmocion;
};

const emocionesP: EmocionP[] = [
  {
    primaria: "Alegría", intensa: "Éxtasis", leve: "Serenidad",
    color: "#f9c74f",
    dataPrimaria: { similares: "Emocionada, Satisfecha",           sensaciones: "Sensación de energía y posibilidad",  mensaje: "La vida va bien",                                        proposito: "Enciende la creatividad, la conexión, da energía",                            opuesto: "Tristeza"     },
    dataIntensa:  { similares: "Encantada, Eufórica",              sensaciones: "Abundancia de energía",               mensaje: "Esto es mejor de lo que imaginé",                        proposito: "Fortalece relaciones, aumenta la creatividad, construye recuerdos",            opuesto: "Pena"         },
    dataLeve:     { similares: "Tranquila, Pacífica",              sensaciones: "Relajada, corazón abierto",           mensaje: "Algo esencial, puro o con propósito está sucediendo",    proposito: "Renovar energía, crear conexiones, reflexionar para aprender",                opuesto: "Melancolía"   },
  },
  {
    primaria: "Confianza", intensa: "Admiración", leve: "Aceptación",
    color: "#90be6d",
    dataPrimaria: { similares: "Aceptante, Segura",                sensaciones: "Calidez",                             mensaje: "Esto es seguro",                                         proposito: "Abrirse, conectar, construir alianzas",                                        opuesto: "Disgusto"     },
    dataIntensa:  { similares: "Conectada, Orgullosa",             sensaciones: "Resplandeciente",                     mensaje: "Quiero apoyar a esta persona o cosa",                    proposito: "Fortalecer el compromiso con una persona o idea",                              opuesto: "Aversión"     },
    dataLeve:     { similares: "Abierta, Receptiva",               sensaciones: "Paz",                                 mensaje: "Estamos juntos en esto",                                 proposito: "Crear relaciones y comunidad",                                                 opuesto: "Aburrimiento" },
  },
  {
    primaria: "Miedo", intensa: "Terror", leve: "Aprensión",
    color: "#43aa8b",
    dataPrimaria: { similares: "Estresada, Asustada",              sensaciones: "Agitada",                             mensaje: "Algo que me importa está en riesgo",                     proposito: "Proteger lo que nos importa",                                                  opuesto: "Ira"          },
    dataIntensa:  { similares: "Alarmada, Petrificada",            sensaciones: "Difícil respirar",                    mensaje: "Hay un gran peligro",                                    proposito: "Buscar seguridad para uno mismo y los demás",                                  opuesto: "Furia"        },
    dataLeve:     { similares: "Preocupada, Ansiosa",              sensaciones: "No puedo relajarme",                  mensaje: "Podría haber un problema",                               proposito: "Identificar riesgos potenciales, no ignorar el problema",                     opuesto: "Fastidio"     },
  },
  {
    primaria: "Sorpresa", intensa: "Asombro", leve: "Distracción",
    color: "#48cae4",
    dataPrimaria: { similares: "Impactada, Conmocionada",          sensaciones: "Corazón acelerado",                   mensaje: "Algo nuevo ocurrió",                                     proposito: "Prestar atención a lo que está aquí",                                          opuesto: "Anticipación" },
    dataIntensa:  { similares: "Inspirada, Maravillada",           sensaciones: "Sin aliento",                         mensaje: "Algo completamente inesperado está pasando",             proposito: "Recordar este momento",                                                        opuesto: "Vigilancia"   },
    dataLeve:     { similares: "Dispersa, Incierta",               sensaciones: "Desenfocada",                         mensaje: "No sé qué priorizar",                                    proposito: "Reflexionar sobre qué priorizar",                                              opuesto: "Interés"      },
  },
  {
    primaria: "Tristeza", intensa: "Pena", leve: "Melancolía",
    color: "#4895ef",
    dataPrimaria: { similares: "Caída, Pérdida",                   sensaciones: "Pesada",                              mensaje: "Algo importante se va",                                  proposito: "Enfocarse en lo que nos importa",                                              opuesto: "Alegría"      },
    dataIntensa:  { similares: "Destrozada, Desesperada",          sensaciones: "Difícil levantarse",                  mensaje: "Algo importante se perdió",                              proposito: "Saber qué queremos verdaderamente",                                            opuesto: "Éxtasis"      },
    dataLeve:     { similares: "Melancólica, Triste",              sensaciones: "Lenta y desconectada",                mensaje: "Algo importante está distante",                          proposito: "Recordar personas y cosas que importan",                                       opuesto: "Serenidad"    },
  },
  {
    primaria: "Disgusto", intensa: "Aversión", leve: "Aburrimiento",
    color: "#9b5de5",
    dataPrimaria: { similares: "Desconfianza, Rechazo",            sensaciones: "Amargo e indeseado",                  mensaje: "Algo está mal; las reglas fueron violadas",              proposito: "Notar algo inseguro o incorrecto",                                             opuesto: "Confianza"    },
    dataIntensa:  { similares: "Perturbada, Horrorizada",          sensaciones: "Visceral y vehemente",                mensaje: "Los valores fundamentales están siendo violados",         proposito: "Energizarse para bloquear algo vil",                                           opuesto: "Admiración"   },
    dataLeve:     { similares: "Cansada, Desinteresada",           sensaciones: "Agotada, poca energía",               mensaje: "El potencial de esta situación no se aprovecha",         proposito: "Descansar, aprender algo nuevo, enfocarse en lo que se puede controlar",      opuesto: "Aceptación"   },
  },
  {
    primaria: "Ira", intensa: "Furia", leve: "Fastidio",
    color: "#e63946",
    dataPrimaria: { similares: "Enfadada, Hostil",                  sensaciones: "Fuerte y acalorada",                  mensaje: "Algo está en el camino",                                 proposito: "Energizarse para superar un obstáculo",                                        opuesto: "Miedo"        },
    dataIntensa:  { similares: "Enloquecida, Descontrolada",        sensaciones: "Corazón palpitante, visión nublada",  mensaje: "Algo vital me está bloqueando",                          proposito: "Atacar un obstáculo",                                                          opuesto: "Terror"       },
    dataLeve:     { similares: "Frustrada, Irritable",             sensaciones: "Levemente agitada",                   mensaje: "Algo está sin resolver",                                 proposito: "Notar problemas menores",                                                      opuesto: "Aprensión"    },
  },
  {
    primaria: "Anticipación", intensa: "Vigilancia", leve: "Interés",
    color: "#f4845f",
    dataPrimaria: { similares: "Curiosa, Expectante",              sensaciones: "Alerta y explorando",                 mensaje: "El cambio está sucediendo",                              proposito: "Mirar adelante, ver lo que puede venir",                                       opuesto: "Sorpresa"     },
    dataIntensa:  { similares: "Intensa, Enfocada",                sensaciones: "Muy enfocada",                        mensaje: "Algo importante se acerca",                              proposito: "Prepararse, observar con cuidado, mantenerse alerta",                          opuesto: "Asombro"      },
    dataLeve:     { similares: "Abierta, Observando",              sensaciones: "Leve sensación de curiosidad",        mensaje: "Algo útil podría venir",                                 proposito: "Prestar atención, explorar",                                                   opuesto: "Distracción"  },
  },
];

const diadasP = [
  { nombre: "Amor",           a: "Alegría",       b: "Confianza",    similares: "Aceptada, Adorada, Conectada",      sensaciones: "Pacífica, corazón cálido",               mensaje: "Estoy profundamente conectada con esta persona",                                    proposito: "Seguridad para crecer y desarrollarse; cuidado de las próximas generaciones",   explicacion: "La Alegría indica que las cosas van bien. La Confianza señala seguridad y conexión. Juntas, nos sentimos profundamente conectadas." },
  { nombre: "Sumisión",       a: "Confianza",     b: "Miedo",        similares: "Obediencia, Deferencia, Conformidad", sensaciones: "Ojos entrecerrados, cabeza baja",      mensaje: "Esta persona tiene la fortaleza para mantenernos seguros",                          proposito: "Protección ante una amenaza mayor",                                             explicacion: "La Confianza señala seguridad y conexión. El Miedo indica que algo que nos importa está en riesgo. Juntos, buscamos protección." },
  { nombre: "Alarma",         a: "Miedo",         b: "Sorpresa",     similares: "Horrorizada, Vigilante, Impactada",  sensaciones: "Ojos muy abiertos, corazón palpitante", mensaje: "Algo muy riesgoso apareció de repente",                                             proposito: "Reaccionar rápidamente ante una amenaza",                                       explicacion: "El Miedo señala que algo que nos importa está en riesgo. La Sorpresa indica que algo es inesperado. Juntos, nos impactan y nos llevan a defendernos." },
  { nombre: "Decepción",      a: "Sorpresa",      b: "Tristeza",     similares: "Desilusión, Golpe, Pérdida",            sensaciones: "Sin aliento, músculos contraídos",      mensaje: "Hay una tragedia o pérdida repentina",                                              proposito: "Movilizar rápidamente a un grupo ante una pérdida o problema",                  explicacion: "La Sorpresa indica que algo es inesperado. La Tristeza señala que perdemos algo o alguien importante. Juntas, percibimos que algo externo está mal." },
  { nombre: "Remordimiento",  a: "Tristeza",      b: "Disgusto",     similares: "Culpa, Expiación, Responsabilidad",  sensaciones: "Pesadez, cabeza gacha",                 mensaje: "Soy responsable de algo importante que se dañó o perdió",                          proposito: "Asumir responsabilidad, reparar el daño, crecer",                               explicacion: "La Tristeza señala que perdemos algo importante. El Disgusto indica una violación de normas. Juntos, sentimos la necesidad de reparar o mejorar." },
  { nombre: "Desprecio",      a: "Disgusto",      b: "Ira",          similares: "Indignado, Horrorizado, Despectivo",  sensaciones: "Labio torcido, calor",                  mensaje: "Algo está mal y debería ser castigado",                                             proposito: "Hacer cumplir las normas del grupo",                                            explicacion: "El Disgusto señala una violación de normas. La Ira indica que algo nos bloquea. Juntos, nos impulsan a rebajar o descartar la barrera percibida." },
  { nombre: "Agresividad",    a: "Ira",           b: "Anticipación", similares: "Beligerante, Hostil, Combativa", sensaciones: "Inflamada, tensa, moviéndose hacia la amenaza", mensaje: "Necesito luchar contra una amenaza que se acerca",                          proposito: "Prepararse para el conflicto",                                                  explicacion: "La Ira indica que algo nos bloquea. La Anticipación es atención al futuro. Juntas, nos impulsan a pelear o romper la barrera." },
  { nombre: "Optimismo",      a: "Anticipación",  b: "Alegría",      similares: "Esperanzada, Con ganas",             sensaciones: "Energizada",                            mensaje: "El futuro es mejor que el presente",                                                proposito: "Generar opciones, motivar la acción",                                           explicacion: "La Anticipación es atención al futuro. La Alegría indica que las cosas van bien. Juntas, miramos hacia adelante con ilusión." },
];

// ── Geometría de la rueda de Plutchik ──────────────────────────────────────
// El disco es completo (sin huecos blancos): un centro tipo "pizza" con las
// emociones intensas, hojas curvas que se extienden hacia afuera, y cuñas de
// fondo (díadas) rellenando el espacio entre hoja y hoja.
const WHEEL_CX = 305, WHEEL_CY = 305;
const R_CORE     = 7;    // hueco central mínimo
const R_INTENSE  = 92;   // radio de la "pizza" intensa (banda interna)
const R_PRIMARY  = 182;  // fin de la banda primaria
const R_MILD     = 300;  // punta de la hoja — sobresale fuera del anillo exterior
const R_WEDGE    = 240;  // radio externo de las cuñas de fondo = borde del disco
const MAX_HALF   = 22.5; // medio-ancho del pétalo en el centro (llena los 45°)
const TIP_HALF   = 0.8;  // medio-ancho al llegar a R_MILD → los costados convergen a punta

function ptDeg(r: number, aDeg: number) {
  const a = (aDeg * Math.PI) / 180;
  return { x: WHEEL_CX + r * Math.cos(a), y: WHEEL_CY + r * Math.sin(a) };
}

// Medio-ancho del pétalo según el radio: constante en la pizza central, luego
// se afina de forma convexa hacia la punta → silueta de hoja.
function petalHalfWidth(r: number) {
  if (r <= R_INTENSE) return MAX_HALF;
  const t = Math.min(1, (r - R_INTENSE) / (R_MILD - R_INTENSE));
  return MAX_HALF - (MAX_HALF - TIP_HALF) * Math.pow(t, 1.7);
}

// Banda de una hoja (entre rInner y rOuter). Si es la banda externa (rOuter === R_MILD)
// el borde exterior converge a un punto real; de lo contrario cierra con arco.
function bandPath(mA: number, rInner: number, rOuter: number) {
  const steps = 16;
  const f = (n: number) => n.toFixed(2);
  const isTip = rOuter >= R_MILD;
  // En la punta, ambos costados llegan hasta steps-1 y luego convergen al mismo
  // punto central → simétrico, sin muesca.
  const sideMax = isTip ? steps - 1 : steps;
  let d = "";
  // Costado izquierdo, de dentro hacia afuera
  for (let s = 0; s <= sideMax; s++) {
    const r = rInner + ((rOuter - rInner) * s) / steps;
    const p = ptDeg(r, mA - petalHalfWidth(r));
    d += (s === 0 ? "M" : "L") + ` ${f(p.x)} ${f(p.y)} `;
  }
  if (isTip) {
    // Converge a un punto real en la punta
    const tip = ptDeg(rOuter, mA);
    d += `L ${f(tip.x)} ${f(tip.y)} `;
  } else {
    // Arco del borde externo (izquierda → derecha)
    const or = ptDeg(rOuter, mA + petalHalfWidth(rOuter));
    d += `A ${f(rOuter)} ${f(rOuter)} 0 0 1 ${f(or.x)} ${f(or.y)} `;
  }
  // Costado derecho, de fuera hacia dentro
  for (let s = sideMax; s >= 0; s--) {
    const r = rInner + ((rOuter - rInner) * s) / steps;
    const p = ptDeg(r, mA + petalHalfWidth(r));
    d += `L ${f(p.x)} ${f(p.y)} `;
  }
  // Arco del borde interno (derecha → izquierda)
  const il = ptDeg(rInner, mA - petalHalfWidth(rInner));
  d += `A ${f(rInner)} ${f(rInner)} 0 0 0 ${f(il.x)} ${f(il.y)} `;
  return d + "Z";
}

// Cuña de fondo (sector anular recto) para las díadas entre hojas.
function wedgePath(mA: number, half: number, rIn: number, rOut: number) {
  const p1 = ptDeg(rIn, mA - half), p2 = ptDeg(rOut, mA - half);
  const p3 = ptDeg(rOut, mA + half), p4 = ptDeg(rIn, mA + half);
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rOut} ${rOut} 0 0 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${rIn} ${rIn} 0 0 0 ${p1.x} ${p1.y} Z`;
}

function blendHex(h1: string, h2: string) {
  const a = hexToRgb(h1), b = hexToRgb(h2);
  const r = Math.round((a.r + b.r) / 2), g = Math.round((a.g + b.g) / 2), bl = Math.round((a.b + b.b) / 2);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function labelPos(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function mixColor(hex: string, ratio: number) {
  const { r, g, b } = hexToRgb(hex);
  const nr = Math.round(r + (255 - r) * ratio);
  const ng = Math.round(g + (255 - g) * ratio);
  const nb = Math.round(b + (255 - b) * ratio);
  return `rgb(${nr},${ng},${nb})`;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

function hslToCss(h: number, s: number, l: number) {
  return `hsl(${h.toFixed(1)}, ${(Math.max(0, Math.min(1, s)) * 100).toFixed(1)}%, ${(Math.max(0, Math.min(1, l)) * 100).toFixed(1)}%)`;
}

// Forma intensa: mismo tono, más saturado y algo más oscuro → color vívido, no
// marrón. Reemplaza al viejo darkenColor que embarraba amarillos y naranjas.
function intensifyColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return hslToCss(h, Math.min(1, s + 0.20), Math.max(0, l - 0.17));
}

function RuedaEmociones() {
  const [selIdx, setSelIdx] = useState<number | null>(null);
  const [selNivel, setSelNivel] = useState<"intensa" | "primaria" | "leve" | null>(null);
  const [selDiada, setSelDiada] = useState<number | null>(null);

  const CX = WHEEL_CX, CY = WHEEL_CY;

  const N = emocionesP.length;
  const slice = 360 / N;
  const OFFSET = -112.5;

  function toggle(i: number, nivel: "intensa" | "primaria" | "leve") {
    setSelDiada(null);
    if (selIdx === i && selNivel === nivel) { setSelIdx(null); setSelNivel(null); }
    else { setSelIdx(i); setSelNivel(nivel); }
  }

  function toggleDiada(i: number) {
    setSelIdx(null); setSelNivel(null);
    setSelDiada(selDiada === i ? null : i);
  }

  const emActiva = selIdx !== null ? emocionesP[selIdx] : null;
  const nombreActivo = emActiva
    ? (selNivel === "intensa" ? emActiva.intensa : selNivel === "leve" ? emActiva.leve : emActiva.primaria)
    : null;
  const dataActiva = emActiva
    ? (selNivel === "intensa" ? emActiva.dataIntensa : selNivel === "leve" ? emActiva.dataLeve : emActiva.dataPrimaria)
    : null;

  function rotLabel(a: number) {
    const n = ((a % 360) + 360) % 360;
    return n > 90 && n < 270 ? a + 180 : a;
  }

  return (
    <div>
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">
        Basada en el modelo de Robert Plutchik (1980). El pétalo interior es la forma más intensa, el exterior la más leve. Tocá cualquier pétalo para ver su descripción.
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Rueda de Plutchik"
          texto="Robert Plutchik describió 8 emociones primarias en pares opuestos. Cada una tiene una forma intensa (centro) y una leve (exterior). Las emociones adyacentes combinadas generan emociones complejas llamadas díadas — como el Amor (Alegría + Confianza) o el Optimismo (Anticipación + Alegría)."
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 610 610" className="w-full max-w-2xl">
          <style>{`@keyframes pulse-border { 0% { stroke:#00FFFF; stroke-opacity:1; } 50% { stroke:#FF00FF; stroke-opacity:1; } 100% { stroke:#00FFFF; stroke-opacity:1; } }`}</style>
          {/* Capa de fondo: cuñas de díadas rellenando el espacio entre hojas */}
          {diadasP.map((d, i) => {
            const gapAngle = OFFSET + (i + 1) * slice;         // frontera entre hoja i y i+1
            const idxA = emocionesP.findIndex((e) => e.primaria === d.a);
            const idxB = emocionesP.findIndex((e) => e.primaria === d.b);
            const dim = selIdx !== null || (selDiada !== null && selDiada !== i);
            const col = blendHex(emocionesP[idxA].color, emocionesP[idxB].color);
            const wPath = wedgePath(gapAngle, slice / 2, R_CORE, R_WEDGE);
            return (
              <path
                key={`wedge-${d.nombre}`}
                d={wPath}
                fill={mixColor(col, 0.10)}
                stroke="none"
                opacity={dim ? 0.3 : 0.85}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                onClick={() => toggleDiada(i)}
              />
            );
          })}

          {/* Capa de hojas: cada emoción con sus 3 bandas (intensa/primaria/leve) */}
          {emocionesP.map((emoc, i) => {
            const mA = OFFSET + i * slice + slice / 2;
            const diadaActiva = selDiada !== null ? diadasP[selDiada] : null;
            const enDiada = diadaActiva
              ? diadaActiva.a === emoc.primaria || diadaActiva.b === emoc.primaria
              : false;
            const dimmed = selIdx !== null ? selIdx !== i : selDiada !== null ? !enDiada : false;

            const lp1 = labelPos(CX, CY, R_CORE + (R_INTENSE - R_CORE) * 0.62, mA);
            const lp2 = labelPos(CX, CY, (R_INTENSE + R_PRIMARY) / 2, mA);
            const lp3 = labelPos(CX, CY, R_PRIMARY + (R_MILD - R_PRIMARY) * 0.38, mA);

            const cInner  = intensifyColor(emoc.color);
            const cMiddle = emoc.color;
            const cOuter  = mixColor(emoc.color, 0.50);

            const dInner  = bandPath(mA, R_CORE,    R_INTENSE);
            const dMiddle = bandPath(mA, R_INTENSE, R_PRIMARY);
            const dOuter  = bandPath(mA, R_PRIMARY, R_MILD);

            return (
              <g key={emoc.primaria}>
                <path
                  d={dInner}
                  fill={cInner}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "intensa")}
                />
                <text
                  x={lp1.x} y={lp1.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="400" fill="#1a1a1a"
                  opacity={dimmed ? 0.25 : 1}
                  transform={`rotate(${rotLabel(mA)}, ${lp1.x}, ${lp1.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {emoc.intensa}
                </text>

                <path
                  d={dMiddle}
                  fill={cMiddle}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "primaria")}
                />
                <text
                  x={lp2.x} y={lp2.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="400" fill="#1a1a1a"
                  opacity={dimmed ? 0.25 : 1}
                  transform={`rotate(${rotLabel(mA)}, ${lp2.x}, ${lp2.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {emoc.primaria}
                </text>

                <path
                  d={dOuter}
                  fill={cOuter}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "leve")}
                />
                <text
                  x={lp3.x} y={lp3.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="400" fill="#1a1a1a"
                  opacity={dimmed ? 0.25 : 1}
                  transform={`rotate(${rotLabel(mA)}, ${lp3.x}, ${lp3.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {emoc.leve}
                </text>
              </g>
            );
          })}

          {/* Etiquetas de díadas sobre la cuña de fondo */}
          {diadasP.map((d, i) => {
            const angle = OFFSET + (i + 1) * slice;
            const dp = labelPos(CX, CY, 190, angle);
            return (
              <text
                key={d.nombre}
                x={dp.x} y={dp.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fontWeight="400" fill="#1a1a1a"
                opacity="0.8"
                transform={`rotate(${rotLabel(angle)}, ${dp.x}, ${dp.y})`}
                style={{ userSelect: "none" }}
              >
                {d.nombre}
              </text>
            );
          })}

          {/* Capa de bordes pulsantes — siempre encima de todo */}
          {selDiada !== null && (() => {
            // Solo la "lente" visible entre las dos hojas: lados que siguen los bordes
            // curvos de los pétalos (petalHalfWidth), sin líneas rectas ni arcos al centro.
            const gapAngle = OFFSET + (selDiada + 1) * slice;
            const half = slice / 2;
            const steps = 24;
            const f = (n: number) => n.toFixed(2);
            let d = "";
            // Lado izquierdo = borde derecho de la hoja izquierda, desde el vértice hacia afuera
            for (let s = 0; s <= steps; s++) {
              const r = R_INTENSE + ((R_WEDGE - R_INTENSE) * s) / steps;
              const p = ptDeg(r, gapAngle - half + petalHalfWidth(r));
              d += (s === 0 ? "M" : "L") + ` ${f(p.x)} ${f(p.y)} `;
            }
            // Arco exterior en R_WEDGE hasta el borde de la hoja derecha
            const ro = ptDeg(R_WEDGE, gapAngle + half - petalHalfWidth(R_WEDGE));
            d += `A ${R_WEDGE} ${R_WEDGE} 0 0 1 ${f(ro.x)} ${f(ro.y)} `;
            // Lado derecho = borde izquierdo de la hoja derecha, de vuelta al vértice
            for (let s = steps; s >= 0; s--) {
              const r = R_INTENSE + ((R_WEDGE - R_INTENSE) * s) / steps;
              const p = ptDeg(r, gapAngle + half - petalHalfWidth(r));
              d += `L ${f(p.x)} ${f(p.y)} `;
            }
            d += "Z";
            return <path key={`diada-border-${selDiada}`} d={d} fill="none" stroke="#00FFFF" strokeWidth="2" style={{ pointerEvents: "none", animation: "pulse-border 1.4s ease-in-out infinite" }} />;
          })()}
          {emocionesP.map((emoc, i) => {
            const mA = OFFSET + i * slice + slice / 2;
            const diadaActiva = selDiada !== null ? diadasP[selDiada] : null;
            const enDiada = diadaActiva
              ? diadaActiva.a === emoc.primaria || diadaActiva.b === emoc.primaria
              : false;
            const showInner  = (selIdx === i && selNivel === "intensa") || enDiada;
            const showMiddle = (selIdx === i && selNivel === "primaria") || enDiada;
            const showOuter  = (selIdx === i && selNivel === "leve")    || enDiada;
            if (!showInner && !showMiddle && !showOuter) return null;
            const borderKey = `border-${emoc.primaria}-${selIdx}-${selNivel}-${selDiada}`;
            return (
              <g key={borderKey} style={{ pointerEvents: "none" }}>
                {showInner  && <path d={bandPath(mA, R_CORE,    R_INTENSE)} fill="none" stroke="#00FFFF" strokeWidth="2.5" style={{ animation: "pulse-border 1.4s ease-in-out infinite" }} />}
                {showMiddle && <path d={bandPath(mA, R_INTENSE, R_PRIMARY)} fill="none" stroke="#00FFFF" strokeWidth="2.5" style={{ animation: "pulse-border 1.4s ease-in-out infinite" }} />}
                {showOuter  && <path d={bandPath(mA, R_PRIMARY, R_MILD)}    fill="none" stroke="#00FFFF" strokeWidth="2.5" style={{ animation: "pulse-border 1.4s ease-in-out infinite" }} />}
              </g>
            );
          })}
        </svg>

        {/* Panel detalle */}
        <AnimatePresence mode="wait">
          {emActiva && dataActiva && (
            <motion.div
              key={`${emActiva.primaria}-${selNivel}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="w-full rounded-2xl border p-5"
              style={{ backgroundColor: emActiva.color + "18", borderColor: emActiva.color + "50" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emActiva.color }} />
                <span className="text-sm font-bold" style={{ color: emActiva.color }}>
                  {nombreActivo}
                </span>
                <span className="text-xs text-foreground/40 ml-1">
                  {selNivel === "intensa" ? "· forma intensa" : selNivel === "leve" ? "· forma leve" : "· emoción primaria"}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div>
                  <span className="font-semibold text-foreground/50">Palabras similares</span>
                  <p className="text-foreground/70 mt-0.5">{dataActiva.similares}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground/50">Sensaciones típicas</span>
                  <p className="text-foreground/70 mt-0.5">{dataActiva.sensaciones}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground/50">¿Qué te está diciendo?</span>
                  <p className="text-foreground/70 mt-0.5">{dataActiva.mensaje}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground/50">¿Para qué sirve?</span>
                  <p className="text-foreground/70 mt-0.5">{dataActiva.proposito}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: emActiva.color + "30" }}>
                <span className="text-xs text-foreground/40">Opuesto:</span>
                <span className="text-xs font-semibold" style={{ color: emActiva.color }}>{dataActiva.opuesto}</span>
                <span className="text-xs text-foreground/30 ml-auto flex gap-2">
                  {selNivel !== "intensa" && <span>Intensa: <b>{emActiva.intensa}</b></span>}
                  {selNivel !== "primaria" && <span>Primaria: <b>{emActiva.primaria}</b></span>}
                  {selNivel !== "leve" && <span>Leve: <b>{emActiva.leve}</b></span>}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel díada */}
        <AnimatePresence mode="wait">
          {selDiada !== null && (() => {
            const d = diadasP[selDiada];
            const idxA = emocionesP.findIndex((e) => e.primaria === d.a);
            const idxB = emocionesP.findIndex((e) => e.primaria === d.b);
            const col = blendHex(emocionesP[idxA].color, emocionesP[idxB].color);
            return (
              <motion.div
                key={d.nombre}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="w-full rounded-2xl border p-5"
                style={{ backgroundColor: col + "18", borderColor: col + "50" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col }} />
                  <span className="text-sm font-bold" style={{ color: col }}>{d.nombre}</span>
                  <span className="text-xs text-foreground/40 ml-1">· emoción combinada</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-foreground/50">Palabras similares</span>
                    <p className="text-foreground/70 mt-0.5">{d.similares}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/50">Sensaciones típicas</span>
                    <p className="text-foreground/70 mt-0.5">{d.sensaciones}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/50">¿Qué te está diciendo?</span>
                    <p className="text-foreground/70 mt-0.5">{d.mensaje}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/50">¿Para qué sirve?</span>
                    <p className="text-foreground/70 mt-0.5">{d.proposito}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground/50">Cómo se forma</span>
                    <p className="text-foreground/70 mt-0.5">{d.explicacion}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t flex items-center gap-2 text-xs text-foreground/40" style={{ borderColor: col + "30" }}>
                  <span>Combinación de</span>
                  <span className="font-semibold text-foreground/60">{d.a}</span>
                  <span>+</span>
                  <span className="font-semibold text-foreground/60">{d.b}</span>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {(emActiva || selDiada !== null) && (
          <button
            onClick={() => { setSelIdx(null); setSelNivel(null); setSelDiada(null); }}
            className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            Limpiar selección
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Rueda de Emociones ───────────────────────────────────────────────────────

type EmocionL3 = { nombre: string; desc: string };
type EmocionL2 = { nombre: string; desc: string; hijos: EmocionL3[] };
type EmocionL1 = { nombre: string; desc: string; color: string; hijos: EmocionL2[] };

const emocionData: EmocionL1[] = [
  {
    nombre: "Alegría", color: "#e0a800",
    desc: "Activa el sistema de recompensa cerebral — núcleo accumbens, área tegmental ventral y corteza prefrontal izquierda. Impulsada por dopamina y oxitocina, genera bienestar, motivación y conexión social.",
    hijos: [
      { nombre: "Optimista",    desc: "Tendencia a ver posibilidades positivas y confiar en que las cosas mejorarán.",                   hijos: [{ nombre: "Esperanzado",  desc: "Convicción serena de que algo mejor es posible, a pesar de las circunstancias." }, { nombre: "Confiado",      desc: "Seguridad en uno mismo y en el entorno, sin necesitar control externo." }] },
      { nombre: "Entusiasmado", desc: "Motivación activa y contagiosa hacia algo que genera ilusión.",                                   hijos: [{ nombre: "Energético",   desc: "Sensación de vitalidad y capacidad de actuar con fuerza." },                    { nombre: "Apasionado",    desc: "Entrega intensa y sostenida hacia algo que genera profundo interés." }] },
      { nombre: "Juguetón",     desc: "Ligereza y ganas de divertirse sin tomar todo en serio.",                                         hijos: [{ nombre: "Despreocupado", desc: "Ausencia de tensión o carga, con libertad de moverse sin urgencia." },          { nombre: "Travieso",      desc: "Disfrute de lo inesperado y lo lúdico, con ganas de sorprender." }] },
      { nombre: "Contento",     desc: "Bienestar tranquilo y sostenido, sin la intensidad del entusiasmo pero con satisfacción real.",   hijos: [{ nombre: "Satisfecho",   desc: "Sensación de que algo salió bien o cubrió una necesidad real." },               { nombre: "Plácido",       desc: "Calma alegre, sin tensión ni urgencia." }] },
      { nombre: "Agradecido",   desc: "Reconocer y sentir el valor de lo que se tiene o recibe, con apertura hacia los demás.",          hijos: [{ nombre: "Inspirado",    desc: "Sentir que algo externo eleva el propio ánimo y abre nuevas posibilidades." },   { nombre: "Afortunado",    desc: "Conciencia genuina de que lo que se tiene es valioso y no estaba garantizado." }] },
      { nombre: "Eufórico",     desc: "Alegría desbordante e intensa, con activación máxima del sistema de recompensa.",                 hijos: [{ nombre: "Exaltado",     desc: "Estado de ánimo elevado al máximo, con energía que desborda." },                { nombre: "Arrebatado",    desc: "Alegría tan intensa que supera la propia capacidad de contenerla." }] },
    ],
  },
  {
    nombre: "Ira", color: "#d64545",
    desc: "Procesada principalmente por la amígdala y la corteza orbitofrontal, que evalúan amenazas e injusticias. Libera adrenalina y noradrenalina, activando el cuerpo para superar un obstáculo o defender un límite.",
    hijos: [
      { nombre: "Hostil",    desc: "Disposición activa de oposición y rechazo hacia alguien o algo.",                                    hijos: [{ nombre: "Vengativo",  desc: "Deseo activo de que quien causó daño reciba las consecuencias." },              { nombre: "Colérico",   desc: "Estado emocional de irritación intensa y sostenida, listo para estallar." }] },
      { nombre: "Irritado",  desc: "Molestia sostenida por algo que no cesa o no se resuelve.",                                          hijos: [{ nombre: "Envidioso",  desc: "Malestar ante el bienestar ajeno, con deseo de tener lo que el otro tiene." },   { nombre: "Impaciente", desc: "Intolerancia ante la demora o la falta de control sobre el ritmo." }] },
      { nombre: "Indignado", desc: "Ira moral ante algo que viola el sentido de justicia o la propia dignidad.",                         hijos: [{ nombre: "Ultrajado",  desc: "Sentir que un límite fundamental fue traspasado de forma inaceptable." },         { nombre: "Ofendido",   desc: "Dolor por sentir que la propia dignidad fue ignorada o atacada." }] },
      { nombre: "Furioso",   desc: "Activación intensa de los circuitos de ira, con respuesta física de calor, tensión y urgencia de actuar.", hijos: [{ nombre: "Iracundo",  desc: "Ira aguda que domina el estado emocional completo, difícil de modular." },      { nombre: "Rabioso",    desc: "Ira desbordante que el cuerpo siente como presión incontrolable." }] },
      { nombre: "Crítico",   desc: "Tendencia a evaluar negativamente, exigir más o señalar lo que falla.",                              hijos: [{ nombre: "Desconfiado", desc: "Suspicacia emocional ante las intenciones o acciones de los demás." },          { nombre: "Rencoroso",  desc: "Malestar acumulado hacia alguien que causó daño y no fue perdonado." }] },
      { nombre: "Molesto",   desc: "Incomodidad activa ante algo que perturba el propio equilibrio.",                                    hijos: [{ nombre: "Frustrado",  desc: "Sentirse bloqueado o impedido de alcanzar algo que se desea o necesita." },     { nombre: "Amargado",   desc: "Resentimiento sostenido que tiñe la percepción de las situaciones y las personas." }] },
    ],
  },
  {
    nombre: "Asco", color: "#e8732a",
    desc: "Vinculado a la ínsula y los ganglios basales, que procesan estímulos aversivos — físicos, morales o sociales. Es una respuesta evolutiva de rechazo que protege al organismo de lo que percibe como dañino o contaminante.",
    hijos: [
      { nombre: "Repugnado",    desc: "Rechazo profundo e instintivo ante algo que viola los propios sentidos o valores.",                hijos: [{ nombre: "Asqueado",      desc: "Reacción física y emocional de asco, con necesidad inmediata de alejarse." },         { nombre: "Trastornado",   desc: "Perturbación profunda que sacude el estado interno, más allá del rechazo físico." }] },
      { nombre: "Desaprobado",  desc: "Opinión desfavorable sostenida ante una conducta que viola las propias normas.",                   hijos: [{ nombre: "Escandalizado", desc: "Perturbación moral intensa ante algo que transgrede los propios valores de forma llamativa." }, { nombre: "Agraviado",     desc: "Sentirse perjudicado o dañado por algo que no debería haber ocurrido." }] },
      { nombre: "Despreciativo", desc: "Rechazo activo hacia algo o alguien percibido como inferior o indigno — variante social del asco.", hijos: [{ nombre: "Desdeñoso",   desc: "Actitud de menosprecio sostenido hacia algo o alguien que se considera sin valor." },   { nombre: "Distante",      desc: "Retiro emocional deliberado de algo o alguien que se considera indigno de atención." }] },
      { nombre: "Horrorizado",  desc: "Conmoción profunda ante algo que viola de forma extrema los propios valores o la sensibilidad.",    hijos: [{ nombre: "Nauseado",      desc: "Malestar físico y emocional intenso, como si el cuerpo rechazara lo que la mente percibe." }, { nombre: "Consternado",   desc: "Turbación profunda ante algo que no se puede ni quiere aceptar." }] },
      { nombre: "Hastiado",     desc: "Profundo hartazgo acumulado de algo o alguien, con fatiga emocional que genera rechazo sostenido.", hijos: [{ nombre: "Empachado",     desc: "Asco por sobreexposición — demasiado de algo hasta que se vuelve intolerable." },         { nombre: "Indiferente",   desc: "Retirada emocional total tras el hartazgo — ya no queda ni rechazo activo." }] },
      { nombre: "Mortificado",  desc: "Malestar intenso por la propia conducta o una falla percibida, con deseo de ocultarse.",           hijos: [{ nombre: "Avergonzado",   desc: "Dolor por sentir que uno actuó mal o no estuvo a la altura, con deseo de retirarse." }, { nombre: "Humillado",     desc: "Sentir que la propia dignidad fue rebajada ante los demás." }] },
    ],
  },
  {
    nombre: "Tristeza", color: "#4895ef",
    desc: "Asociada a la corteza prefrontal medial, el hipocampo y la corteza cingulada subgenual. Reduce la dopamina disponible, desacelera el organismo y activa circuitos de evaluación de pérdida, duelo y reflexión interna.",
    hijos: [
      { nombre: "Solitario",   desc: "Sensación de aislamiento y ausencia de conexión significativa.",                                   hijos: [{ nombre: "Aislado",        desc: "Distancia de los demás que genera silencio y vacío interno." },                  { nombre: "Incomprendido",  desc: "Sentir que nadie logra ver o entender lo que uno realmente siente." }] },
      { nombre: "Deprimido",   desc: "Pesadez sostenida que apaga la energía y el interés por la vida.",                                 hijos: [{ nombre: "Miserable",      desc: "Malestar profundo que abarca todo y hace difícil encontrar alivio." },            { nombre: "Desesperanzado", desc: "Convicción de que las cosas no pueden mejorar, con ausencia de futuro." }] },
      { nombre: "Melancólico", desc: "Tristeza difusa y sostenida ligada al recuerdo o a la pérdida de algo que ya no puede volver.",    hijos: [{ nombre: "Nostálgico",     desc: "Añoranza por un tiempo, lugar o persona que ya no está." },                      { nombre: "Dolorido",       desc: "Herida emocional presente y activa, diferente a la distancia nostálgica." }] },
      { nombre: "Abandonado",  desc: "Dolor emocional ante la pérdida o ausencia de un vínculo significativo.",                         hijos: [{ nombre: "Indefenso",      desc: "Sentir que no se tienen recursos para protegerse del daño emocional." },          { nombre: "Desamparado",    desc: "Sentir que no hay nadie ni nada a lo que acudir para sostenerse." }] },
      { nombre: "Arrepentido", desc: "Malestar por algo hecho o dicho que causó daño y no se puede deshacer.",                          hijos: [{ nombre: "Culpable",       desc: "Sensación de haber actuado en contra de los propios valores o causado daño." },   { nombre: "Remordido",      desc: "Pensamiento recurrente sobre un error pasado que no cesa." }] },
      { nombre: "Decaído",     desc: "Pérdida de ánimo y energía, con dificultad para encontrar motivación.",                           hijos: [{ nombre: "Resignado",      desc: "Aceptación pasiva de una situación difícil, con renuncia a cambiarla." },         { nombre: "Apático",        desc: "Ausencia de respuesta emocional — nada genera interés ni movimiento interno." }] },
    ],
  },
  {
    nombre: "Miedo", color: "#9b5de5",
    desc: "Procesado principalmente por la amígdala, que detecta amenazas y dispara la respuesta de lucha o huida. Activa el eje hipotálamo-hipófisis-suprarrenal, elevando cortisol y adrenalina para preparar al cuerpo.",
    hijos: [
      { nombre: "Aterrorizado", desc: "Miedo de máxima intensidad con activación total de la amígdala y respuesta de huida o parálisis.", hijos: [{ nombre: "Despavorido",  desc: "Huida interna o externa ante algo percibido como una amenaza inminente e inevitable." }, { nombre: "En pánico",    desc: "Pérdida del control racional ante un miedo que desborda toda capacidad de respuesta." }] },
      { nombre: "Inseguro",    desc: "Falta de confianza en uno mismo o en la situación, con miedo al fracaso.",                         hijos: [{ nombre: "Inferior",     desc: "Sentirse menos valioso o capaz que quienes están alrededor." },                  { nombre: "Intimidado",    desc: "Sentir que la presencia o poder de algo externo reduce la propia capacidad de actuar." }] },
      { nombre: "Paralizado",  desc: "Respuesta de freeze del sistema nervioso — el cuerpo se detiene ante una amenaza que no puede huir ni enfrentar.", hijos: [{ nombre: "Inmovilizado", desc: "Cuerpo y mente detenidos por la amenaza, sin poder iniciar ninguna acción." },     { nombre: "Bloqueado",     desc: "Incapacidad de actuar o decidir, con la mente y el cuerpo detenidos." }] },
      { nombre: "Amenazado",   desc: "Percibir que algo importante está en riesgo y podría perderse.",                                   hijos: [{ nombre: "Nervioso",     desc: "Activación corporal ante algo incierto, con dificultad para calmarse." },         { nombre: "Acorralado",    desc: "Sensación de no tener salida ante una amenaza que cierra el espacio." }] },
      { nombre: "Ansioso",     desc: "Inquietud ante algo incierto que podría salir mal, con el cuerpo en alerta.",                      hijos: [{ nombre: "Vulnerable",   desc: "Sentirse expuesto al daño sin protección, con los propios límites disueltos." },  { nombre: "Agitado",       desc: "Inquietud interna intensa que no permite serenarse ni detenerse." }] },
      { nombre: "Preocupado",  desc: "Atención sostenida en un problema o riesgo que no se puede controlar del todo.",                   hijos: [{ nombre: "Angustiado",   desc: "Preocupación que alcanza una intensidad física — opresión, ahogo, urgencia." },   { nombre: "Aprensivo",     desc: "Anticipación persistente de algo malo que todavía no ocurrió." }] },
    ],
  },
  {
    nombre: "Sorpresa", color: "#43aa8b",
    desc: "Activa redes de atención y orientación ante estímulos inesperados, con participación de la corteza cingulada anterior y la amígdala. Interrumpe el procesamiento habitual para redirigir los recursos cognitivos hacia lo nuevo.",
    hijos: [
      { nombre: "Impactado",     desc: "Sentir el golpe de algo inesperado que deja una impresión duradera.",                            hijos: [{ nombre: "Impresionado",  desc: "Sentirse fuertemente afectado por algo que superó lo esperado." },              { nombre: "Conmocionado",  desc: "Impacto profundo que sacude la percepción y deja huella." }] },
      { nombre: "Asombrado",     desc: "Conmoción ante algo extraordinario que supera la percepción habitual.",                          hijos: [{ nombre: "Maravillado",   desc: "Mezcla de asombro y admiración ante algo que parece superar lo ordinario." },   { nombre: "Admirado",      desc: "Reconocimiento genuino ante algo o alguien que supera las propias expectativas." }] },
      { nombre: "Desconcertado", desc: "Desorientación ante algo que no encaja con lo que se anticipaba.",                               hijos: [{ nombre: "Atónito",       desc: "Quedarse sin palabras ante algo tan inesperado que la mente tarda en procesar." }, { nombre: "Desorientado",  desc: "Pérdida momentánea del hilo — sin saber cómo interpretar lo que acaba de ocurrir." }] },
      { nombre: "Fascinado",     desc: "Captura total de la atención ante algo inesperado que genera interés y apertura.",               hijos: [{ nombre: "Cautivado",     desc: "Atención completamente tomada por algo que no se puede dejar de observar." },    { nombre: "Hipnotizado",   desc: "Absorción total en algo que suspende el resto del pensamiento." }] },
      { nombre: "Alarmado",      desc: "Activación de alerta ante algo inesperado que podría implicar peligro.",                         hijos: [{ nombre: "Sobresaltado",  desc: "Reacción física brusca ante algo repentino e inesperado." },                    { nombre: "Consternado",   desc: "Alarma con peso — la sorpresa tiene consecuencias que todavía no se procesan del todo." }] },
      { nombre: "Estupefacto",   desc: "Sorpresa extrema que deja la mente en blanco — el procesamiento habitual se detiene por completo.", hijos: [{ nombre: "Pasmado",     desc: "Suspensión total de la reacción ante algo que supera lo imaginable." },          { nombre: "Anonado",       desc: "Sin palabras, sin movimiento — la mente no encuentra categoría para lo que ocurrió." }] },
    ],
  },
];

const EMOCIONES_COLORS: Record<string, { l1: string; l2: string; l3: string }> = {
  "Alegría":   { l1: "#e0a800", l2: "#f0d15a", l3: "#f7e7a0" },
  "Ira":       { l1: "#d64545", l2: "#e88b8b", l3: "#f5c9c9" },
  "Asco":      { l1: "#e8732a", l2: "#f0a878", l3: "#f7d4ba" },
  "Tristeza":  { l1: "#4895ef", l2: "#7db5f5", l3: "#bcd8fa" },
  "Miedo":     { l1: "#9b5de5", l2: "#b58fd1", l3: "#d9c5e8" },
  "Sorpresa":  { l1: "#43aa8b", l2: "#7dcaaf", l3: "#b5e0d3" },
};

// Willcox: pares opuestos usan colores complementarios
// Felicidad(amarillo) ↔ Tristeza(azul) · Enfado(rojo) ↔ Calma(verde) · Miedo(violeta) ↔ Fuerza(naranja)
const WILLCOX_COLORS: Record<string, { l1: string; l2: string; l3: string }> = {
  "Felicidad": { l1: "#e0a800", l2: "#f0d15a", l3: "#f7e7a0" },
  "Fuerza":    { l1: "#e8732a", l2: "#f0a878", l3: "#f7d4ba" },
  "Calma":     { l1: "#43aa8b", l2: "#7dcaaf", l3: "#b5e0d3" },
  "Tristeza":  { l1: "#4895ef", l2: "#7db5f5", l3: "#bcd8fa" },
  "Enfado":    { l1: "#d64545", l2: "#e88b8b", l3: "#f5c9c9" },
  "Miedo":     { l1: "#8f5bb5", l2: "#b58fd1", l3: "#d9c5e8" },
};

const willcoxData: EmocionL1[] = [
  {
    nombre: "Felicidad", color: "#e0a800",
    desc: "Estado de bienestar y satisfacción asociado a experiencias positivas, conexión y energía.",
    hijos: [
      { nombre: "Optimista",     desc: "Tendencia a ver posibilidades positivas y confiar en que las cosas mejorarán.",         hijos: [{ nombre: "Esperanzado",  desc: "Convicción serena de que algo mejor es posible, a pesar de las circunstancias." }] },
      { nombre: "Entusiasmado",  desc: "Motivación activa y contagiosa hacia algo que genera ilusión.",                         hijos: [{ nombre: "Energético",   desc: "Sensación de vitalidad y capacidad de actuar con fuerza." }] },
      { nombre: "Juguetón",      desc: "Ligereza y ganas de divertirse sin tomar todo en serio.",                               hijos: [{ nombre: "Excitado",     desc: "Activación positiva intensa ante algo que despierta entusiasmo." }] },
      { nombre: "Alegre",        desc: "Sensación de ligereza y bienestar que se expresa de forma espontánea.",                 hijos: [{ nombre: "Sorprendido",  desc: "Reacción positiva ante algo inesperado que supera las expectativas." }] },
      { nombre: "Aceptado",      desc: "Sentirse bienvenido e incluido por los demás sin juicio ni rechazo.",                   hijos: [{ nombre: "Valorado",     desc: "Sentir que la propia presencia o contribución importa a los demás." }] },
      { nombre: "Interesado",    desc: "Curiosidad activa hacia algo que capta la atención y despierta el deseo de explorar.", hijos: [{ nombre: "Curioso",      desc: "Impulso de aprender o descubrir, con apertura a lo nuevo." }] },
    ],
  },
  {
    nombre: "Enfado", color: "#d64545",
    desc: "Respuesta ante una injusticia, frustración o límite violado. Moviliza energía para defender lo que nos importa.",
    hijos: [
      { nombre: "Hostil",    desc: "Disposición activa de oposición y rechazo hacia alguien o algo.",                           hijos: [{ nombre: "Egoísta",   desc: "Actuar pensando solo en el propio beneficio, sin considerar a los demás." }] },
      { nombre: "Irritado",  desc: "Molestia sostenida por algo que no cesa o no se resuelve.",                                  hijos: [{ nombre: "Celoso",    desc: "Miedo a perder algo o alguien valioso ante la percepción de una amenaza." }] },
      { nombre: "Herido",    desc: "Dolor emocional porque algo o alguien afectó la propia dignidad o expectativas.",           hijos: [{ nombre: "Furioso",   desc: "Ira intensa que el cuerpo siente como calor y presión, difícil de contener." }] },
      { nombre: "Estresado", desc: "Tensión sostenida por exceso de demandas o presión sin salida clara.",                      hijos: [{ nombre: "Resentido", desc: "Amargura acumulada por una injusticia percibida que no se ha podido procesar." }] },
      { nombre: "Crítico",   desc: "Tendencia a evaluar negativamente, exigir más o señalar lo que falla.",                     hijos: [{ nombre: "Escéptico", desc: "Desconfianza activa hacia las intenciones o motivaciones ajenas." }] },
      { nombre: "Molesto",   desc: "Incomodidad activa ante algo que perturba el propio equilibrio.",                           hijos: [{ nombre: "Frustrado", desc: "Sentirse bloqueado o impedido de alcanzar algo que se desea o necesita." }] },
    ],
  },
  {
    nombre: "Miedo", color: "#b58fd1",
    desc: "Alerta ante una amenaza real o percibida. Prepara al cuerpo para protegerse o evitar el peligro.",
    hijos: [
      { nombre: "Débil",      desc: "Sensación de falta de recursos o fuerza para afrontar lo que se viene.",                   hijos: [{ nombre: "Invisible",  desc: "Sentir que la propia presencia, voz o necesidades pasan desapercibidas." }] },
      { nombre: "Inseguro",   desc: "Falta de confianza en uno mismo o en la situación, con miedo al fracaso.",                 hijos: [{ nombre: "Inferior",   desc: "Sentirse menos valioso o capaz que quienes están alrededor." }] },
      { nombre: "Confundido", desc: "Sentirse desorientado sin saber cómo procesar lo que ocurre.",                             hijos: [{ nombre: "Perplejo",   desc: "Desconcierto ante algo que no encaja con ninguna explicación disponible." }] },
      { nombre: "Amenazado",  desc: "Percibir que algo importante está en riesgo y podría perderse.",                           hijos: [{ nombre: "Nervioso",   desc: "Activación corporal ante algo incierto, con dificultad para calmarse." }] },
      { nombre: "Ansioso",    desc: "Inquietud ante algo incierto que podría salir mal, con el cuerpo en alerta.",              hijos: [{ nombre: "Rechazado",  desc: "Sentirse indeseado o descartado por quienes importan." }] },
      { nombre: "Preocupado", desc: "Atención sostenida en un problema o riesgo que no se puede controlar del todo.",           hijos: [{ nombre: "Excluido",   desc: "Sentirse dejado fuera deliberadamente, con dolor por no ser incluido." }] },
    ],
  },
  {
    nombre: "Tristeza", color: "#4895ef",
    desc: "Respuesta natural a una pérdida, decepción o separación. Invita a la reflexión y al procesamiento interno.",
    hijos: [
      { nombre: "Solitario",    desc: "Sensación de aislamiento y ausencia de conexión significativa.",                         hijos: [{ nombre: "Aislado",      desc: "Distancia de los demás que genera silencio y vacío interno." }] },
      { nombre: "Deprimido",    desc: "Pesadez sostenida que apaga la energía y el interés por la vida.",                       hijos: [{ nombre: "Miserable",    desc: "Malestar profundo que abarca todo y hace difícil encontrar alivio." }] },
      { nombre: "Indiferente",  desc: "Desconexión del entorno por falta de estimulación, sentido o energía.",                  hijos: [{ nombre: "Aburrido",     desc: "Falta de interés o estímulo, con sensación de que nada vale la pena." }] },
      { nombre: "Vulnerable",   desc: "Sentirse expuesto al daño emocional sin protección suficiente.",                         hijos: [{ nombre: "Frágil",       desc: "Estado de sensibilidad extrema donde cualquier cosa puede romper el equilibrio." }] },
      { nombre: "Arrepentido",  desc: "Malestar por algo hecho o dicho que causó daño y no se puede deshacer.",                 hijos: [{ nombre: "Culpable",     desc: "Sensación de haber actuado en contra de los propios valores o causado daño." }] },
      { nombre: "Decaído",      desc: "Pérdida de ánimo y energía, con dificultad para encontrar motivación.",                  hijos: [{ nombre: "Avergonzado",  desc: "Dolor por sentir que uno no es suficiente o que falló frente a otros." }] },
    ],
  },
  {
    nombre: "Calma", color: "#43aa8b",
    desc: "Estado de paz y armonía interior. Bienestar tranquilo sin tensión, abierto a la conexión.",
    hijos: [
      { nombre: "Conectado",   desc: "Sentir un lazo real con alguien o algo, con presencia y reciprocidad.",                   hijos: [{ nombre: "Arropado",    desc: "Sensación de estar protegido y contenido por quienes nos rodean." }] },
      { nombre: "Confiado",    desc: "Fe en uno mismo y en la situación, sin necesitar control externo.",                       hijos: [{ nombre: "Sensible",    desc: "Apertura emocional que permite sentir lo propio y lo ajeno con claridad." }] },
      { nombre: "Agradecido",  desc: "Reconocer y sentir el valor de lo que se tiene o recibe.",                                hijos: [{ nombre: "Cariñoso",    desc: "Expresión suave y cálida del afecto hacia quienes importan." }] },
      { nombre: "Tranquilo",   desc: "Estado de quietud interior sin tensión ni urgencia.",                                     hijos: [{ nombre: "Sereno",      desc: "Paz profunda que no se altera ante lo que cambia afuera." }] },
      { nombre: "Considerado", desc: "Atención activa al bienestar ajeno, con cuidado y respeto.",                              hijos: [{ nombre: "Relajado",    desc: "Ausencia de tensión física y mental, con soltura en el cuerpo." }] },
      { nombre: "Aliviado",    desc: "Sensación de que una presión o amenaza pasó y se puede respirar de nuevo.",               hijos: [{ nombre: "Recogido",    desc: "Estado de quietud interior donde uno se siente centrado y presente." }] },
    ],
  },
  {
    nombre: "Fuerza", color: "#e8732a",
    desc: "Sentir la propia capacidad, valor y agencia. Estado de fortaleza interior que permite avanzar y conectar.",
    hijos: [
      { nombre: "Empoderado",  desc: "Sentir que se tiene la capacidad real de actuar y hacer cambios.",                        hijos: [{ nombre: "Enfocado",    desc: "Claridad de propósito y atención dirigida hacia lo que importa." }] },
      { nombre: "Reconocido",  desc: "Sentir que el propio esfuerzo o valor es visto por quienes importan.",                   hijos: [{ nombre: "Leal",        desc: "Compromiso sostenido con las personas o valores que importan." }] },
      { nombre: "Valiente",    desc: "Fortaleza de actuar a pesar del miedo, eligiendo avanzar cuando sería más fácil retroceder.", hijos: [{ nombre: "Respetado",  desc: "Sentir que los demás reconocen y valoran la propia dignidad." }] },
      { nombre: "Fuerte",      desc: "Capacidad de sostener la presión sin derrumbarse ni perder el rumbo.",                    hijos: [{ nombre: "Creativo",    desc: "Impulso de generar algo nuevo, de explorar e imaginar." }] },
      { nombre: "Orgulloso",   desc: "Satisfacción genuina por algo propio logrado o bien hecho.",                              hijos: [{ nombre: "Exitoso",     desc: "Sentir que se alcanzó algo que tenía valor y que costó esfuerzo." }] },
      { nombre: "Seguro",      desc: "Estabilidad interior que no depende de la aprobación o circunstancias externas.",         hijos: [{ nombre: "Sano",        desc: "Sensación de integridad y equilibrio físico y emocional." }] },
    ],
  },
];

const ROB_CX = 300, ROB_CY = 300;
const ROB_R1 = 82;
const ROB_R2 = 178;
const ROB_R3 = 290;

function robSector(r1: number, r2: number, startDeg: number, endDeg: number): string {
  const f = (n: number) => n.toFixed(2);
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a1 = toRad(startDeg), a2 = toRad(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const x1o = ROB_CX + r2 * Math.cos(a1), y1o = ROB_CY + r2 * Math.sin(a1);
  const x2o = ROB_CX + r2 * Math.cos(a2), y2o = ROB_CY + r2 * Math.sin(a2);
  if (r1 === 0) {
    return `M ${f(ROB_CX)} ${f(ROB_CY)} L ${f(x1o)} ${f(y1o)} A ${f(r2)} ${f(r2)} 0 ${large} 1 ${f(x2o)} ${f(y2o)} Z`;
  }
  const x1i = ROB_CX + r1 * Math.cos(a1), y1i = ROB_CY + r1 * Math.sin(a1);
  const x2i = ROB_CX + r1 * Math.cos(a2), y2i = ROB_CY + r1 * Math.sin(a2);
  return `M ${f(x1i)} ${f(y1i)} A ${f(r1)} ${f(r1)} 0 ${large} 1 ${f(x2i)} ${f(y2i)} L ${f(x2o)} ${f(y2o)} A ${f(r2)} ${f(r2)} 0 ${large} 0 ${f(x1o)} ${f(y1o)} Z`;
}

function RuedaEmocionWheel({ data = emocionData, infoTexto, colorMap = EMOCIONES_COLORS, descripcion }: { data?: EmocionL1[]; infoTexto?: string; colorMap?: Record<string, { l1: string; l2: string; l3: string }>; descripcion?: string }) {
  const [selKey, setSelKey] = useState<string | null>(null);
  const OFFSET = -90;
  const coreSlice = 360 / data.length;

  function toggleSel(key: string) {
    setSelKey((prev) => (prev === key ? null : key));
  }

  function isDimmed(key: string): boolean {
    if (!selKey) return false;
    if (key === selKey) return false;
    if (selKey.startsWith(key + "-")) return false;
    if (key.startsWith(selKey + "-")) return false;
    return true;
  }

  function rotLabel(a: number): number {
    const n = ((a % 360) + 360) % 360;
    return n > 90 && n < 270 ? a + 180 : a;
  }

  let selNombre: string | null = null;
  let selDesc: string | null = null;
  let selNivel = 0;
  let selPadre: string | null = null;
  let selAbuelo: string | null = null;
  let selColor = "#888";
  let selHijos: string[] = [];

  if (selKey) {
    const parts = selKey.split("-").map(Number);
    const core = data[parts[0]];
    selColor = colorMap[core.nombre]?.l1 ?? core.color;
    if (parts.length === 1) {
      selNombre = core.nombre;
      selDesc = core.desc;
      selNivel = 1;
      selHijos = core.hijos.map((h) => h.nombre);
    } else if (parts.length === 2) {
      const l2 = core.hijos[parts[1]];
      selNombre = l2.nombre;
      selDesc = l2.desc;
      selNivel = 2;
      selPadre = core.nombre;
      selHijos = l2.hijos.map((h) => h.nombre);
    } else {
      const l2 = core.hijos[parts[1]];
      const l3 = l2.hijos[parts[2]];
      selNombre = l3.nombre;
      selDesc = l3.desc;
      selNivel = 3;
      selPadre = l2.nombre;
      selAbuelo = core.nombre;
    }
  }

  return (
    <div>
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">
        {descripcion ?? "Las 6 emociones con sustrato neurológico documentado. Cada sector muestra qué pasa en el cerebro cuando las sentís — y cómo se ramifican en variantes más específicas."}
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Rueda Neurológica de Emociones"
          texto={infoTexto ?? "Esta rueda parte de la neurociencia: cada emoción del centro tiene una base cerebral documentada — estructuras específicas, neurotransmisores y una función adaptativa concreta. Tocá el centro para ver qué pasa en el cerebro cuando la sentís. Los anillos siguientes muestran cómo esa emoción se ramifica en variantes y matices más precisos. A diferencia de la Rueda de Willcox — que se enfoca en ampliar el vocabulario emocional — esta rueda te ayuda a entender por qué sentís lo que sentís."}
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 600 600" className="w-full max-w-2xl">
          <style>{`@keyframes pulse-border { 0% { stroke:#00FFFF; stroke-opacity:1; } 50% { stroke:#FF00FF; stroke-opacity:1; } 100% { stroke:#00FFFF; stroke-opacity:1; } }`}</style>
          {data.map((core, ci) => {
            const cStart  = OFFSET + ci * coreSlice;
            const cEnd    = cStart + coreSlice;
            const cMid    = cStart + coreSlice / 2;
            const l2Count = core.hijos.length;
            const l2Slice = coreSlice / l2Count;
            const ciKey   = `${ci}`;
            const lp1 = {
              x: ROB_CX + ROB_R1 * 0.54 * Math.cos((cMid * Math.PI) / 180),
              y: ROB_CY + ROB_R1 * 0.54 * Math.sin((cMid * Math.PI) / 180),
            };

            return (
              <g key={ciKey}>
                <path
                  d={robSector(0, ROB_R1, cStart, cEnd)}
                  fill={colorMap[core.nombre]?.l1 ?? core.color}
                  stroke="white" strokeWidth="1.5"
                  opacity={isDimmed(ciKey) ? 0.18 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggleSel(ciKey)}
                />
                <text
                  x={lp1.x} y={lp1.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="13" fontWeight="600" fill="#1a1a1a"
                  opacity={isDimmed(ciKey) ? 0.18 : 1}
                  transform={`rotate(${rotLabel(cMid)}, ${lp1.x}, ${lp1.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {core.nombre}
                </text>

                {core.hijos.map((l2, l2i) => {
                  const l2Start = cStart + l2i * l2Slice;
                  const l2End   = l2Start + l2Slice;
                  const l2Mid   = l2Start + l2Slice / 2;
                  const l2Key   = `${ci}-${l2i}`;
                  const robCol  = colorMap[core.nombre];
                  const l2Color = robCol ? robCol.l2 : mixColor(core.color, 0.30);
                  const l3Color = robCol ? robCol.l3 : mixColor(core.color, 0.55);
                  const lp2 = {
                    x: ROB_CX + ((ROB_R1 + ROB_R2) / 2) * Math.cos((l2Mid * Math.PI) / 180),
                    y: ROB_CY + ((ROB_R1 + ROB_R2) / 2) * Math.sin((l2Mid * Math.PI) / 180),
                  };

                  return (
                    <g key={l2Key}>
                      <path
                        d={robSector(ROB_R1, ROB_R2, l2Start, l2End)}
                        fill={l2Color}
                        stroke="white" strokeWidth="0.8"
                        opacity={isDimmed(l2Key) ? 0.15 : 1}
                        style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                        onClick={() => toggleSel(l2Key)}
                      />
                      {l2Slice > 7 && (
                        <text
                          x={lp2.x} y={lp2.y}
                          textAnchor="middle" dominantBaseline="middle"
                          fontSize="12" fill="#1a1a1a"
                          opacity={isDimmed(l2Key) ? 0.15 : 0.85}
                          transform={`rotate(${rotLabel(l2Mid)}, ${lp2.x}, ${lp2.y})`}
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          {l2.nombre}
                        </text>
                      )}

                      {l2.hijos.length === 0 ? (
                        <path
                          d={robSector(ROB_R2, ROB_R3, l2Start, l2End)}
                          fill={l3Color}
                          stroke="white" strokeWidth="0.5"
                          opacity={isDimmed(l2Key) ? 0.15 : 1}
                          style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                          onClick={() => toggleSel(l2Key)}
                        />
                      ) : (
                        l2.hijos.map((l3, l3i) => {
                          const l3Count = l2.hijos.length;
                          const l3Slice = l2Slice / l3Count;
                          const l3Start = l2Start + l3i * l3Slice;
                          const l3End   = l3Start + l3Slice;
                          const l3Mid   = l3Start + l3Slice / 2;
                          const l3Key   = `${ci}-${l2i}-${l3i}`;
                          const lp3 = {
                            x: ROB_CX + ((ROB_R2 + ROB_R3) / 2) * Math.cos((l3Mid * Math.PI) / 180),
                            y: ROB_CY + ((ROB_R2 + ROB_R3) / 2) * Math.sin((l3Mid * Math.PI) / 180),
                          };

                          return (
                            <g key={l3Key}>
                              <path
                                d={robSector(ROB_R2, ROB_R3, l3Start, l3End)}
                                fill={l3Color}
                                stroke="white" strokeWidth="0.5"
                                opacity={isDimmed(l3Key) ? 0.15 : 1}
                                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                                onClick={() => toggleSel(l3Key)}
                              />
                              {l3Slice >= 5 && (
                                <text
                                  x={lp3.x} y={lp3.y}
                                  textAnchor="middle" dominantBaseline="middle"
                                  fontSize="10" fill="#1a1a1a"
                                  opacity={isDimmed(l3Key) ? 0.15 : 0.8}
                                  transform={`rotate(${rotLabel(l3Mid)}, ${lp3.x}, ${lp3.y})`}
                                  style={{ pointerEvents: "none", userSelect: "none" }}
                                >
                                  {l3.nombre}
                                </text>
                              )}
                            </g>
                          );
                        })
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Capa de bordes pulsantes — siempre encima de todo */}
          {selKey && (() => {
            const parts = selKey.split("-").map(Number);
            const ci = parts[0];
            const core = data[ci];
            const cStart = OFFSET + ci * coreSlice;
            const cEnd   = cStart + coreSlice;
            if (parts.length === 1) {
              return <path key="border-l1" d={robSector(0, ROB_R1, cStart, cEnd)} fill="none" stroke="#00FFFF" strokeWidth="2.5" style={{ pointerEvents: "none", animation: "pulse-border 1.4s ease-in-out infinite" }} />;
            }
            const l2i    = parts[1];
            const l2Count = core.hijos.length;
            const l2Slice = coreSlice / l2Count;
            const l2Start = cStart + l2i * l2Slice;
            const l2End   = l2Start + l2Slice;
            if (parts.length === 2) {
              const l2 = core.hijos[l2i];
              return (
                <g key="border-l2" style={{ pointerEvents: "none" }}>
                  <path d={robSector(ROB_R1, ROB_R2, l2Start, l2End)} fill="none" stroke="#00FFFF" strokeWidth="2" style={{ animation: "pulse-border 1.4s ease-in-out infinite" }} />
                  {l2.hijos.length === 0 && <path d={robSector(ROB_R2, ROB_R3, l2Start, l2End)} fill="none" stroke="#00FFFF" strokeWidth="2" style={{ animation: "pulse-border 1.4s ease-in-out infinite" }} />}
                </g>
              );
            }
            const l3i    = parts[2];
            const l3Count = core.hijos[l2i].hijos.length;
            const l3Slice = l2Slice / l3Count;
            const l3Start = l2Start + l3i * l3Slice;
            const l3End   = l3Start + l3Slice;
            return <path key="border-l3" d={robSector(ROB_R2, ROB_R3, l3Start, l3End)} fill="none" stroke="#00FFFF" strokeWidth="2" style={{ pointerEvents: "none", animation: "pulse-border 1.4s ease-in-out infinite" }} />;
          })()}
        </svg>

        <AnimatePresence mode="wait">
          {selKey && selNombre && (
            <motion.div
              key={selKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="w-full rounded-2xl border p-5"
              style={{ backgroundColor: selColor + "18", borderColor: selColor + "50" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selColor }} />
                <span className="text-sm font-bold" style={{ color: selColor }}>{selNombre}</span>
                {selAbuelo && (
                  <span className="text-xs text-foreground/40 ml-1">{selAbuelo} → {selPadre}</span>
                )}
                {!selAbuelo && selPadre && (
                  <span className="text-xs text-foreground/40 ml-1">dentro de {selPadre}</span>
                )}
              </div>
              {selDesc && (
                <p className="text-sm text-foreground/60 leading-relaxed mb-4">{selDesc}</p>
              )}
              {selHijos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground/50 mb-2">
                    {selNivel === 1 ? "Emociones relacionadas" : "Formas más específicas"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selHijos.map((h) => (
                      <span
                        key={h}
                        className="text-xs px-2.5 py-1 rounded-full border"
                        style={{ borderColor: selColor + "60", color: selColor }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {selKey && (
          <button
            onClick={() => setSelKey(null)}
            className="text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            Limpiar selección
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

type CatId = "respiracion" | "emociones" | "anclaje";
type HerramientaId = "478" | "box" | "plutchik" | "emociones-wheel" | "willcox" | "grounding" | "escaner";

const categorias: { id: CatId; label: string; herramientas: { id: HerramientaId; label: string }[] }[] = [
  {
    id: "respiracion",
    label: "Respiración",
    herramientas: [
      { id: "478",  label: "Técnica 4-7-8" },
      { id: "box",  label: "Respiración cuadrada" },
    ],
  },
  {
    id: "emociones",
    label: "Emociones",
    herramientas: [
      { id: "emociones-wheel",  label: "Rueda Neurológica" },
      { id: "plutchik", label: "Rueda de Plutchik" },
      { id: "willcox",  label: "Rueda de Gloria Willcox" },
    ],
  },
  {
    id: "anclaje",
    label: "Anclaje",
    herramientas: [
      { id: "grounding", label: "Grounding 5-4-3-2-1" },
      { id: "escaner",   label: "Escáner corporal" },
    ],
  },
];

export default function HerramientasPage() {
  const [catActiva, setCatActiva] = useState<CatId>("respiracion");
  const [herActiva, setHerActiva] = useState<HerramientaId>("478");

  function seleccionarCategoria(cat: CatId) {
    setCatActiva(cat);
    const primera = categorias.find((c) => c.id === cat)!.herramientas[0].id;
    setHerActiva(primera);
  }

  const herramientasCat = categorias.find((c) => c.id === catActiva)!.herramientas;

  return (
    <main className="min-h-screen bg-[#f7f4f2] pt-24 pb-20 overflow-x-hidden">
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

        {/* Categorías */}
        <div className="flex items-start gap-2 mb-1">
          <span className="text-[10px] font-semibold tracking-widest text-foreground/30 uppercase w-16 shrink-0 pt-2">Área</span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => seleccionarCategoria(cat.id)}
                className={`relative px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 shrink-0 ${
                  catActiva === cat.id
                    ? "text-white"
                    : "text-foreground/50 border border-foreground/15 hover:text-foreground/80 hover:border-foreground/30"
                }`}
              >
                {catActiva === cat.id && (
                  <motion.span
                    layoutId="chip-bg-categoria"
                    className="absolute inset-0 rounded-full bg-primary-dark"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-herramientas */}
        <div className="flex items-start gap-2 mb-10 border-b border-foreground/8 pb-6">
          <span className="text-[10px] font-semibold tracking-widest text-foreground/30 uppercase w-16 shrink-0 pt-2">Modelo</span>
          <div className="flex flex-wrap gap-2">
          {herramientasCat.map((h) => (
            <button
              key={h.id}
              onClick={() => setHerActiva(h.id)}
              className={`relative px-4 py-1.5 rounded-full text-xs tracking-[0.12em] uppercase font-medium transition-colors duration-200 shrink-0 ${
                herActiva === h.id
                  ? "text-primary-dark border border-primary-dark/40 bg-primary-dark/8"
                  : "text-foreground/40 border border-foreground/12 hover:text-foreground/60 hover:border-foreground/25"
              }`}
            >
              {h.label}
            </button>
          ))}
          </div>
        </div>

        {herActiva === "478"      && <Respiracion tecnicaInicial="478" />}
        {herActiva === "box"      && <Respiracion tecnicaInicial="box" />}
        {herActiva === "emociones-wheel"  && <RuedaEmocionWheel />}
        {herActiva === "willcox" && (
          <RuedaEmocionWheel
            data={willcoxData}
            colorMap={WILLCOX_COLORS}
            descripcion="Herramienta clínica de Gloria Willcox (1982) para ampliar el vocabulario emocional. Empezá por el centro, identificá la emoción más cercana y avanzá hacia afuera hasta encontrar el matiz exacto."
            infoTexto="Gloria Willcox publicó esta rueda con una idea central: cuanto más preciso es el nombre que le damos a lo que sentimos, más fácil es comunicarlo, procesarlo y regularlo. Es una herramienta de vocabulario emocional — no explica qué pasa en el cerebro, sino que te da palabras para nombrar con precisión lo que ya estás sintiendo. La lógica es de adentro hacia afuera: el centro tiene las 6 emociones más amplias y cada anillo agrega especificidad. Si te interesa entender la base neurológica de cada emoción, la Rueda Neurológica es el punto de partida."
          />
        )}
        {herActiva === "plutchik" && <RuedaEmociones />}
        {herActiva === "grounding" && <Grounding />}
        {herActiva === "escaner"   && <EscanerCorporal />}

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
