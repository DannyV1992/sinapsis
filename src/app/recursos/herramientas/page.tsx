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
    dataPrimaria: { similares: "Impactada, Inesperado",            sensaciones: "Corazón acelerado",                   mensaje: "Algo nuevo ocurrió",                                     proposito: "Prestar atención a lo que está aquí",                                          opuesto: "Anticipación" },
    dataIntensa:  { similares: "Inspirada, Asombrada",             sensaciones: "Sin aliento",                         mensaje: "Algo completamente inesperado está pasando",             proposito: "Recordar este momento",                                                        opuesto: "Vigilancia"   },
    dataLeve:     { similares: "Dispersa, Incierta",               sensaciones: "Desenfocada",                         mensaje: "No sé qué priorizar",                                    proposito: "Reflexionar sobre qué priorizar",                                              opuesto: "Interés"      },
  },
  {
    primaria: "Tristeza", intensa: "Pena", leve: "Melancolía",
    color: "#4895ef",
    dataPrimaria: { similares: "Caída, Pérdida",                   sensaciones: "Pesada",                              mensaje: "El amor se va",                                          proposito: "Enfocarse en lo que nos importa",                                              opuesto: "Alegría"      },
    dataIntensa:  { similares: "Destrozada, Desesperada",          sensaciones: "Difícil levantarse",                  mensaje: "El amor se perdió",                                      proposito: "Saber qué queremos verdaderamente",                                            opuesto: "Éxtasis"      },
    dataLeve:     { similares: "Melancólica, Triste",              sensaciones: "Lenta y desconectada",                mensaje: "El amor está distante",                                  proposito: "Recordar personas y cosas que importan",                                       opuesto: "Serenidad"    },
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
    dataPrimaria: { similares: "Furiosa, Intensa",                 sensaciones: "Fuerte y acalorada",                  mensaje: "Algo está en el camino",                                 proposito: "Energizarse para superar un obstáculo",                                        opuesto: "Miedo"        },
    dataIntensa:  { similares: "Abrumada, Furiosa",                sensaciones: "Corazón palpitante, visión nublada",  mensaje: "Algo vital me está bloqueando",                          proposito: "Atacar un obstáculo",                                                          opuesto: "Terror"       },
    dataLeve:     { similares: "Frustrada, Irritable",             sensaciones: "Levemente agitada",                   mensaje: "Algo está sin resolver",                                 proposito: "Notar problemas menores",                                                      opuesto: "Aprensión"    },
  },
  {
    primaria: "Anticipación", intensa: "Vigilancia", leve: "Interés",
    color: "#f4845f",
    dataPrimaria: { similares: "Curiosa, Considerando",            sensaciones: "Alerta y explorando",                 mensaje: "El cambio está sucediendo",                              proposito: "Mirar adelante, ver lo que puede venir",                                       opuesto: "Sorpresa"     },
    dataIntensa:  { similares: "Intensa, Enfocada",                sensaciones: "Muy enfocada",                        mensaje: "Algo importante se acerca",                              proposito: "Prepararse, observar con cuidado, mantenerse alerta",                          opuesto: "Asombro"      },
    dataLeve:     { similares: "Abierta, Observando",              sensaciones: "Leve sensación de curiosidad",        mensaje: "Algo útil podría venir",                                 proposito: "Prestar atención, explorar",                                                   opuesto: "Distracción"  },
  },
];

const diadasP = [
  { nombre: "Amor",           a: "Alegría",       b: "Confianza",    similares: "Aceptada, Adorada, Conectada",      sensaciones: "Pacífica, corazón cálido",               mensaje: "Estoy profundamente conectada con esta persona",                                    proposito: "Seguridad para crecer y desarrollarse; cuidado de las próximas generaciones",   explicacion: "La Alegría indica que las cosas van bien. La Confianza señala seguridad y conexión. Juntas, nos sentimos profundamente conectadas." },
  { nombre: "Sumisión",       a: "Confianza",     b: "Miedo",        similares: "Obediencia, Seguimiento, Tribalismo", sensaciones: "Ojos entrecerrados, cabeza baja",      mensaje: "Esta persona tiene la fortaleza para mantenernos seguros",                          proposito: "Protección ante una amenaza mayor",                                             explicacion: "La Confianza señala seguridad y conexión. El Miedo indica que algo que nos importa está en riesgo. Juntos, buscamos protección." },
  { nombre: "Alarma",         a: "Miedo",         b: "Sorpresa",     similares: "Horrorizada, Vigilante, Impactada",  sensaciones: "Ojos muy abiertos, corazón palpitante", mensaje: "Algo muy riesgoso apareció de repente",                                             proposito: "Reaccionar rápidamente ante una amenaza",                                       explicacion: "El Miedo señala que algo que nos importa está en riesgo. La Sorpresa indica que algo es inesperado. Juntos, nos impactan y nos llevan a defendernos." },
  { nombre: "Decepción",      a: "Sorpresa",      b: "Tristeza",     similares: "Error, Impacto, Pérdida",            sensaciones: "Sin aliento, músculos contraídos",      mensaje: "Hay una tragedia o pérdida repentina",                                              proposito: "Movilizar rápidamente a un grupo ante una pérdida o problema",                  explicacion: "La Sorpresa indica que algo es inesperado. La Tristeza señala que perdemos algo o alguien importante. Juntas, percibimos que algo externo está mal." },
  { nombre: "Remordimiento",  a: "Tristeza",      b: "Disgusto",     similares: "Culpa, Expiación, Responsabilidad",  sensaciones: "Pesadez, cabeza gacha",                 mensaje: "Soy responsable de algo importante que se dañó o perdió",                          proposito: "Asumir responsabilidad, reparar el daño, crecer",                               explicacion: "La Tristeza señala que perdemos algo importante. El Disgusto indica una violación de normas. Juntos, sentimos la necesidad de reparar o mejorar." },
  { nombre: "Desprecio",      a: "Disgusto",      b: "Ira",          similares: "Rectitud, Horror, Vergüenza ajena",  sensaciones: "Labio torcido, calor",                  mensaje: "Algo está mal y debería ser castigado",                                             proposito: "Hacer cumplir las normas del grupo",                                            explicacion: "El Disgusto señala una violación de normas. La Ira indica que algo nos bloquea. Juntos, nos impulsan a rebajar o descartar la barrera percibida." },
  { nombre: "Agresividad",    a: "Ira",           b: "Anticipación", similares: "Beligerante, Hostil, Argumentativa", sensaciones: "Inflamada, tensa, moviéndose hacia la amenaza", mensaje: "Necesito luchar contra una amenaza que se acerca",                          proposito: "Prepararse para el conflicto",                                                  explicacion: "La Ira indica que algo nos bloquea. La Anticipación es atención al futuro. Juntas, nos impulsan a pelear o romper la barrera." },
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
        Basada en el modelo de Robert Plutchik. El pétalo interior es la forma más intensa, el exterior la más leve. Tocá cualquier pétalo para ver su descripción.
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Rueda de Plutchik"
          texto="Robert Plutchik describió 8 emociones primarias en pares opuestos. Cada una tiene una forma intensa (centro) y una leve (exterior). Las emociones adyacentes combinadas generan emociones complejas llamadas díadas — como el Amor (Alegría + Confianza) o el Optimismo (Anticipación + Alegría)."
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 610 610" className="w-full max-w-2xl">
          {/* Capa de fondo: cuñas de díadas rellenando el espacio entre hojas */}
          {diadasP.map((d, i) => {
            const gapAngle = OFFSET + (i + 1) * slice;         // frontera entre hoja i y i+1
            const idxA = emocionesP.findIndex((e) => e.primaria === d.a);
            const idxB = emocionesP.findIndex((e) => e.primaria === d.b);
            const dim = selIdx !== null && selIdx !== idxA && selIdx !== idxB;
            const col = blendHex(emocionesP[idxA].color, emocionesP[idxB].color);
            const isActiveDiada = selDiada === i;
            return (
              <path
                key={`wedge-${d.nombre}`}
                d={wedgePath(gapAngle, slice / 2, R_CORE, R_WEDGE)}
                fill={mixColor(col, 0.10)}
                stroke={isActiveDiada ? "white" : "none"}
                strokeWidth={isActiveDiada ? "2" : "0"}
                opacity={dim ? 0.3 : 0.85}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                onClick={() => toggleDiada(i)}
              />
            );
          })}

          {/* Capa de hojas: cada emoción con sus 3 bandas (intensa/primaria/leve) */}
          {emocionesP.map((emoc, i) => {
            const mA = OFFSET + i * slice + slice / 2;
            const dimmed = selIdx !== null && selIdx !== i;
            const isActive = selIdx === i;

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
                {/* Banda interna: intensa */}
                <path
                  d={dInner}
                  fill={cInner}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "intensa")}
                />
                {isActive && selNivel === "intensa" && (
                  <path d={dInner} fill="none" stroke="white" strokeWidth="2.5" style={{ pointerEvents: "none" }} />
                )}
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

                {/* Banda media: primaria */}
                <path
                  d={dMiddle}
                  fill={cMiddle}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "primaria")}
                />
                {isActive && selNivel === "primaria" && (
                  <path d={dMiddle} fill="none" stroke="white" strokeWidth="2.5" style={{ pointerEvents: "none" }} />
                )}
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

                {/* Banda externa: leve */}
                <path
                  d={dOuter}
                  fill={cOuter}
                  stroke="white" strokeWidth="1.2"
                  opacity={dimmed ? 0.2 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onClick={() => toggle(i, "leve")}
                />
                {isActive && selNivel === "leve" && (
                  <path d={dOuter} fill="none" stroke="white" strokeWidth="2.5" style={{ pointerEvents: "none" }} />
                )}
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

// ─── Rueda de Emociones (Ekman) ──────────────────────────────────────────────

const emocionesEkman = [
  {
    nombre: "Alegría",
    color: "#f9c74f",
    desc: "Estado de bienestar y satisfacción. El cuerpo se siente liviano, con energía y apertura hacia los demás.",
    senales: "Sonrisa, postura abierta, sensación de ligereza, mayor energía.",
  },
  {
    nombre: "Tristeza",
    color: "#4895ef",
    desc: "Respuesta natural a una pérdida, decepción o separación. Invita a la reflexión y al procesamiento interno.",
    senales: "Llanto, pesadez corporal, menor energía, deseo de aislamiento.",
  },
  {
    nombre: "Miedo",
    color: "#43aa8b",
    desc: "Alerta ante una amenaza real o percibida. Prepara al cuerpo para protegerse: huir, paralizarse o enfrentar.",
    senales: "Tensión muscular, aceleración cardíaca, sudoración, atención focalizada.",
  },
  {
    nombre: "Asco",
    color: "#9b5de5",
    desc: "Rechazo ante algo que viola los sentidos o los valores. Protege de lo que percibimos como dañino o repugnante.",
    senales: "Náuseas, fruncir el ceño, distanciamiento físico, expresión de repulsión.",
  },
  {
    nombre: "Ira",
    color: "#e63946",
    desc: "Respuesta ante una injusticia, amenaza o frustración. Moviliza energía para defender límites o cambiar situaciones.",
    senales: "Tensión en mandíbula y puños, calor corporal, respiración acelerada, voz elevada.",
  },
  {
    nombre: "Sorpresa",
    color: "#48cae4",
    desc: "Interrupción momentánea ante algo inesperado. La mente se detiene para procesar lo nuevo antes de reaccionar.",
    senales: "Ojos y boca abiertos, cejas elevadas, pausa en el movimiento.",
  },
];

const EKM_CX = 290, EKM_CY = 290;
const EKM_R_OUTER = 248;

function sectorPath(startDeg: number, endDeg: number) {
  const f = (n: number) => n.toFixed(2);
  const a1 = (startDeg * Math.PI) / 180;
  const a2 = (endDeg * Math.PI) / 180;
  const x1 = EKM_CX + EKM_R_OUTER * Math.cos(a1);
  const y1 = EKM_CY + EKM_R_OUTER * Math.sin(a1);
  const x2 = EKM_CX + EKM_R_OUTER * Math.cos(a2);
  const y2 = EKM_CY + EKM_R_OUTER * Math.sin(a2);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${f(EKM_CX)} ${f(EKM_CY)} L ${f(x1)} ${f(y1)} A ${f(EKM_R_OUTER)} ${f(EKM_R_OUTER)} 0 ${large} 1 ${f(x2)} ${f(y2)} Z`;
}

function RuedaEkman() {
  const [selIdx, setSelIdx] = useState<number | null>(null);
  const N = emocionesEkman.length;
  const slice = 360 / N;
  const OFFSET = -90;

  function rotLabel(a: number) {
    const n = ((a % 360) + 360) % 360;
    return n > 90 && n < 270 ? a + 180 : a;
  }

  const emActiva = selIdx !== null ? emocionesEkman[selIdx] : null;

  return (
    <div>
      <p className="text-sm text-foreground/50 mb-3 leading-relaxed max-w-md">
        Las 6 emociones básicas universales según Paul Ekman. Presentes en todas las culturas, son respuestas innatas con funciones de supervivencia y comunicación.
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Modelo de Ekman"
          texto="Paul Ekman identificó 6 emociones básicas universales mediante investigación transcultural en los años 70, incluyendo estudios con la tribu Fore en Papúa Nueva Guinea. Demostró que sus expresiones faciales son reconocidas en todas las culturas, independientemente del contexto social. No es una rueda visual sino una teoría científica: cada emoción es innata, evolutiva y tiene una función adaptativa específica."
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 580 580" className="w-full max-w-2xl">
          {emocionesEkman.map((em, i) => {
            const startDeg = OFFSET + i * slice;
            const endDeg = startDeg + slice;
            const mA = startDeg + slice / 2;
            const dimmed = selIdx !== null && selIdx !== i;
            const labelR = EKM_R_OUTER * 0.58;
            const lp = {
              x: EKM_CX + labelR * Math.cos((mA * Math.PI) / 180),
              y: EKM_CY + labelR * Math.sin((mA * Math.PI) / 180),
            };
            return (
              <g key={em.nombre} onClick={() => setSelIdx(selIdx === i ? null : i)} style={{ cursor: "pointer" }}>
                <path
                  d={sectorPath(startDeg, endDeg)}
                  fill={em.color}
                  stroke="white"
                  strokeWidth="2"
                  opacity={dimmed ? 0.25 : 1}
                  style={{ transition: "opacity 0.2s" }}
                />
                {selIdx === i && (
                  <path d={sectorPath(startDeg, endDeg)} fill="none" stroke="white" strokeWidth="3" style={{ pointerEvents: "none" }} />
                )}
                <text
                  x={lp.x} y={lp.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="13" fontWeight="500" fill="#1a1a1a"
                  opacity={dimmed ? 0.3 : 1}
                  transform={`rotate(${rotLabel(mA)}, ${lp.x}, ${lp.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {em.nombre}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence mode="wait">
          {emActiva && (
            <motion.div
              key={emActiva.nombre}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              className="w-full rounded-2xl border p-5"
              style={{ backgroundColor: emActiva.color + "18", borderColor: emActiva.color + "50" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emActiva.color }} />
                <span className="text-sm font-bold" style={{ color: emActiva.color }}>{emActiva.nombre}</span>
              </div>
              <p className="text-sm text-foreground/60 leading-relaxed mb-3">{emActiva.desc}</p>
              <p className="text-xs text-foreground/40"><span className="font-semibold">Señales físicas: </span>{emActiva.senales}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {emActiva && (
          <button
            onClick={() => setSelIdx(null)}
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

type EmocioneL3 = { nombre: string; desc: string };
type EmocioneL2 = { nombre: string; desc: string; hijos: EmocioneL3[] };
type EmocioneL1 = { nombre: string; desc: string; color: string; hijos: EmocioneL2[] };

const emocioneData: EmocioneL1[] = [
  {
    nombre: "Ira", color: "#d64545",
    desc: "Fuerte sentimiento de disgusto u hostilidad en respuesta a una injusticia, frustración o amenaza percibida. Puede variar desde una irritación leve hasta una rabia intensa.",
    hijos: [
      { nombre: "Amenazado", desc: "Sentirse en peligro o en riesgo ante un daño o pérdida percibida o real, desencadenando una respuesta defensiva.", hijos: [
        { nombre: "Inseguro", desc: "Sentimiento de incertidumbre y falta de confianza en uno mismo, a menudo por percibir incompetencia o miedo al fracaso y al rechazo." },
        { nombre: "Celoso", desc: "Sentirse envidioso y protector, a menudo por miedo a perder la atención o el afecto de alguien, generando inseguridad y resentimiento." },
      ]},
      { nombre: "Odioso", desc: "Sentir una intensa aversión u hostilidad hacia algo o alguien percibido como profundamente ofensivo o dañino.", hijos: [
        { nombre: "Resentido", desc: "Sentir amargura persistente por un agravio o injusticia percibida, aferrándose a sentimientos negativos hacia quien nos perjudicó." },
        { nombre: "Violado", desc: "Sentir que los propios límites, derechos o confianza han sido invadidos o vulnerados de forma grave, generando indignación y dolor." },
      ]},
      { nombre: "Desquiciado", desc: "Sentirse fuera de sí por una ira tan intensa que resulta difícil de contener, con fuertes impulsos de arremeter.", hijos: [
        { nombre: "Enfurecido", desc: "Sentirse extremadamente enojado y furioso, con un intenso deseo de arremeter o expresar la propia ira." },
        { nombre: "Rabioso", desc: "Sentirse enojado o furioso en respuesta a una provocación o frustración específica, con una reacción intensa y visible." },
      ]},
      { nombre: "Agresivo", desc: "Sentirse listo para confrontar o atacar, con una fuerte sensación de hostilidad e intención de dominar o defender.", hijos: [
        { nombre: "Provocado", desc: "Sentir ira como resultado de las acciones o palabras de otra persona que intenta, a propósito, incitar una reacción negativa." },
        { nombre: "Hostil", desc: "Sentir intensa aversión u oposición hacia alguien o algo, con un fuerte deseo de confrontar." },
      ]},
      { nombre: "Frustrado", desc: "Sentirse molesto o desanimado por la incapacidad de lograr algo o por obstáculos que impiden el progreso.", hijos: [
        { nombre: "Enfadado", desc: "Sentirse molesto o irritado ante una situación o persona, con una reacción de disgusto de intensidad moderada." },
        { nombre: "Irritado", desc: "Sentirse ligeramente molesto por alguien o algo, por problemas menores o pequeñas contrariedades." },
      ]},
      { nombre: "Distante", desc: "Sentirse emocionalmente alejado o indiferente de los demás, por deseo de evitar la intimidad o por sentirse herido.", hijos: [
        { nombre: "Retraído", desc: "Sentir un fuerte deseo de aislarse de las interacciones sociales, como respuesta a sentirse abrumado, ansioso o rechazado." },
        { nombre: "Sospechoso", desc: "Sentir desconfianza hacia las intenciones o la sinceridad de los demás, manteniéndose en guardia ante un posible engaño." },
      ]},
    ],
  },
  {
    nombre: "Disgusto", color: "#d67d2e",
    desc: "Sentir una fuerte aversión o repulsión hacia algo o alguien, por sentirse ofendido o indignado moralmente. Puede desencadenarse por estímulos físicos, morales o sociales.",
    hijos: [
      { nombre: "Crítico", desc: "Sentirse inclinado a juzgar con dureza, señalando defectos o errores, con una actitud negativa y evaluativa.", hijos: [
        { nombre: "Sarcástico", desc: "Expresar disgusto o desprecio mediante ironía mordaz, con comentarios hirientes disfrazados de humor." },
        { nombre: "Escéptico", desc: "Sentirse dubitativo y cuestionador, por falta de confianza en la credibilidad de algo, con una actitud cautelosa." },
      ]},
      { nombre: "Desaprobado", desc: "Sentir o mostrar una opinión desfavorable hacia algo o alguien, con rechazo del comportamiento ajeno.", hijos: [
        { nombre: "Sentencioso", desc: "Adoptar una actitud moralizante y de superioridad, emitiendo juicios severos sobre la conducta de los demás." },
        { nombre: "Aborrecido", desc: "Sentir un rechazo profundo y sostenido hacia algo o alguien percibido como intolerable." },
      ]},
      { nombre: "Decepcionado", desc: "Sentirse desanimado porque algo o alguien no cumplió con las expectativas o esperanzas.", hijos: [
        { nombre: "Repugnante", desc: "Percibir algo como profundamente desagradable u ofensivo, con una fuerte reacción de asco y rechazo." },
        { nombre: "Rebelado", desc: "Sentir un fuerte impulso de oponerse o resistirse a algo percibido como injusto o impuesto." },
      ]},
      { nombre: "Terrible", desc: "Sentirse extremadamente mal o angustiado, abarcando tristeza, asco e incomodidad ante una experiencia muy desagradable.", hijos: [
        { nombre: "Repulsivo", desc: "Percibir algo como tan desagradable que provoca un fuerte rechazo y el deseo de alejarse." },
        { nombre: "Detestable", desc: "Sentir aversión intensa hacia algo o alguien considerado despreciable u odioso." },
      ]},
      { nombre: "Evasivo", desc: "Sentir el impulso de evitar o esquivar algo percibido como desagradable, incómodo o amenazante.", hijos: [
        { nombre: "Aversivo", desc: "Experimentar un rechazo instintivo que lleva a apartarse de algo percibido como nocivo o desagradable." },
        { nombre: "Indeciso", desc: "Sentirse inseguro o reacio a actuar, con demora o vacilación por duda o incertidumbre." },
      ]},
      { nombre: "Culpable", desc: "Sentirse responsable de una mala acción u ofensa, con remordimiento y autorreproche.", hijos: [
        { nombre: "Atormentado", desc: "Sentirse abrumado por el malestar interior o la culpa, con angustia persistente y difícil de calmar." },
        { nombre: "Avergonzado", desc: "Sentirse cohibido o incómodo por una situación embarazosa o por la propia conducta, con deseo de ocultarse." },
      ]},
    ],
  },
  {
    nombre: "Tristeza", color: "#6ba33a",
    desc: "Sentirse afligido, infeliz o decaído, generalmente por una pérdida, decepción u otra experiencia negativa. Implica melancolía y puede acompañarse de llanto o retraimiento.",
    hijos: [
      { nombre: "Ansioso", desc: "Experimentar inquietud o preocupación ante algo incierto y potencialmente negativo, con tensión constante.", hijos: [
        { nombre: "Anhelante", desc: "Sentir un fuerte deseo o añoranza de algo o alguien ausente, con una sensación de vacío o espera." },
        { nombre: "Abrumado", desc: "Sentirse incapaz de afrontar las exigencias impuestas, con sobrecarga ante demasiadas tareas o presiones." },
      ]},
      { nombre: "Abandonado", desc: "Sentirse desatendido o dejado de lado por alguien cercano, generando soledad y tristeza.", hijos: [
        { nombre: "Ignorado", desc: "Sentirse pasado por alto o invisible para los demás, como si la propia presencia no importara." },
        { nombre: "Discriminado", desc: "Sentirse tratado de forma injusta o excluido por características personales, generando dolor e indignación." },
      ]},
      { nombre: "Desesperado", desc: "Sentir absoluta desesperanza y falta de fe en la posibilidad de mejorar, con profunda resignación.", hijos: [
        { nombre: "Impotente", desc: "Sensación de falta de control o capacidad para cambiar una situación, de no poder influir en el resultado." },
        { nombre: "Vulnerable", desc: "Sentirse expuesto al riesgo de daño emocional o físico por falta de protección, con susceptibilidad y fragilidad." },
      ]},
      { nombre: "Deprimido", desc: "Sentirse constantemente triste, desesperanzado y desmotivado, con pérdida de interés en actividades antes disfrutadas.", hijos: [
        { nombre: "Inferior", desc: "Sentirse menos valioso o capaz que los demás, con baja autoestima y una sensación de incompetencia." },
        { nombre: "Vacío", desc: "Sentimiento de profundo vacío interior, con falta de plenitud emocional, como si algo esencial faltara." },
      ]},
      { nombre: "Solitario", desc: "Sentir una profunda sensación de aislamiento o soledad, con anhelo de compañía y conexiones significativas.", hijos: [
        { nombre: "Abandonado", desc: "Sentirse dejado de lado por quien fue cercano o brindó apoyo, generando soledad y tristeza." },
        { nombre: "Apartado", desc: "Sentirse separado del entorno o del grupo, al margen de lo que ocurre, con distancia y desconexión." },
      ]},
      { nombre: "Aburrido", desc: "Sentirse desinteresado o desenganchado del entorno o las actividades, con monotonía y falta de estimulación.", hijos: [
        { nombre: "Apático", desc: "Sentirse indiferente o sin interés ni entusiasmo hacia algo o alguien, sin motivación para actuar." },
        { nombre: "Indiferente", desc: "Sentirse neutral ante algo, con falta de emociones u opiniones fuertes y una sensación de desapego." },
      ]},
    ],
  },
  {
    nombre: "Felicidad", color: "#e8b81e",
    desc: "Sentirse alegre, contento o pleno, a menudo por experiencias, relaciones o circunstancias positivas. Envuelve una sensación de bienestar y satisfacción.",
    hijos: [
      { nombre: "Optimista", desc: "Sentir esperanza y confianza en el futuro a pesar de los desafíos, con la convicción de que las cosas mejorarán.", hijos: [
        { nombre: "Inspirado", desc: "Sentirse motivado y entusiasmado por algo que despierta la creatividad, la pasión o la admiración." },
        { nombre: "Receptivo", desc: "Sentirse abierto y dispuesto a recibir nuevas ideas, experiencias o afecto, sin resistencia ni prejuicio." },
      ]},
      { nombre: "Íntimo", desc: "Sentir una cercanía emocional profunda con otra persona, con confianza, apertura y conexión mutua.", hijos: [
        { nombre: "Juguetón", desc: "Sentirse alegre y travieso, con ganas de participar en actividades divertidas, con espontaneidad y disfrute." },
        { nombre: "Sensible", desc: "Sentirse fácilmente afectado por las emociones o el entorno, con mayor conciencia y empatía." },
      ]},
      { nombre: "Pacífico", desc: "Sentirse tranquilo y libre de conflicto, con una sensación de armonía interior y serenidad.", hijos: [
        { nombre: "Esperanzado", desc: "Sentirse seguro de que algo deseado o positivo sucederá, con anticipación y fe en buenos resultados." },
        { nombre: "Amoroso", desc: "Sentir afecto, cariño y un profundo apego a alguien o algo, con calidez y deseo de su bienestar." },
      ]},
      { nombre: "Poderoso", desc: "Sentirse fuerte, capaz e influyente en las propias acciones, con confianza y sensación de control.", hijos: [
        { nombre: "Provocativo", desc: "Sentirse audaz y estimulante, con disposición a desafiar o despertar reacciones de forma segura y desenfadada." },
        { nombre: "Valiente", desc: "Sentirse dispuesto a afrontar el miedo, el peligro o la incertidumbre, tomando decisiones audaces pese a los riesgos." },
      ]},
      { nombre: "Aceptado", desc: "Sentirse bienvenido e incluido por los demás sin juicio ni rechazo, con un sentido de pertenencia.", hijos: [
        { nombre: "Respetado", desc: "Sentirse admirado y tratado con consideración y estima, con reconocimiento de la propia dignidad y opiniones." },
        { nombre: "Realizado", desc: "Sentirse pleno al alcanzar metas o desarrollar el propio potencial, con satisfacción por el esfuerzo invertido." },
      ]},
      { nombre: "Orgulloso", desc: "Sentimiento de satisfacción y logro por las propias acciones o cualidades, con autoevaluación positiva.", hijos: [
        { nombre: "Importante", desc: "Sentir que uno tiene valor y que su presencia o contribución cuentan para los demás." },
        { nombre: "Confiado", desc: "Tener fe en uno mismo o en algo, con seguridad en las propias capacidades y decisiones." },
      ]},
    ],
  },
  {
    nombre: "Sorpresa", color: "#3d84cc",
    desc: "Sentir incredulidad o asombro ante algo imprevisto o novedoso. Implica un cambio repentino en la atención y la percepción ante un acontecimiento o revelación inesperada.",
    hijos: [
      { nombre: "Interesado", desc: "Sentir curiosidad e interés hacia algo o alguien, con el deseo de aprender, explorar o comprender mejor.", hijos: [
        { nombre: "Entretenido", desc: "Sentirse gratamente ocupado y distraído por algo que capta la atención de forma agradable." },
        { nombre: "Curioso", desc: "Sentirse deseoso de aprender o descubrir, con impulso por investigar y explorar nuevas ideas y experiencias." },
      ]},
      { nombre: "Sorprendido", desc: "Sentir asombro ante algo inesperado, con un cambio repentino en la atención y la percepción.", hijos: [
        { nombre: "Impresionado", desc: "Sentirse fuertemente afectado o admirado por algo que supera lo esperado." },
        { nombre: "Consternado", desc: "Sentirse perturbado o abatido ante una noticia o situación inquietante e inesperada." },
      ]},
      { nombre: "Confundido", desc: "Sentirse desconcertado ante algo, por falta de comprensión o información contradictoria, con incertidumbre.", hijos: [
        { nombre: "Desilusionado", desc: "Sentirse decepcionado al darse cuenta de que algo no es tan bueno como se creía, con pérdida de fe." },
        { nombre: "Perplejo", desc: "Sentirse desconcertado ante una situación difícil de comprender, con dificultad para hallar una explicación clara." },
      ]},
      { nombre: "Asombrado", desc: "Sentirse muy sorprendido o conmocionado por algo inesperado o extraordinario, con un profundo cambio en la percepción.", hijos: [
        { nombre: "Atónito", desc: "Quedarse paralizado por el asombro ante algo tan inesperado que cuesta reaccionar." },
        { nombre: "Pasmado", desc: "Sentirse tan sorprendido que se queda sin palabras ni capacidad inmediata de respuesta." },
      ]},
      { nombre: "Efusivo", desc: "Sentir y expresar emociones de forma intensa y desbordante, con entusiasmo difícil de contener.", hijos: [
        { nombre: "Inquieto", desc: "Sentirse agitado o incapaz de permanecer en calma, con una energía interior que busca salida." },
        { nombre: "Enérgico", desc: "Sentirse vivaz, vigoroso y lleno de energía, con vitalidad y disposición para la acción." },
      ]},
      { nombre: "Jubiloso", desc: "Sentir una alegría intensa y desbordante, con ganas de celebrar y expresar entusiasmo.", hijos: [
        { nombre: "Liberado", desc: "Sentirse libre de una carga o restricción, con alivio y apertura a la experiencia." },
        { nombre: "Eufórico", desc: "Sentir una felicidad extrema y expansiva, con una intensa sensación de bienestar y exaltación." },
      ]},
    ],
  },
  {
    nombre: "Miedo", color: "#8f5bb5",
    desc: "Sentir temor o preocupación ante algo percibido como peligroso o amenazante. Implica un estado de alerta elevado y el deseo de evitar o escapar de la fuente del miedo.",
    hijos: [
      { nombre: "Herido", desc: "Sentir dolor o angustia emocional por haber sido maltratado, traicionado o rechazado por otros.", hijos: [
        { nombre: "Devastado", desc: "Sentirse profundamente afectado y desbordado por una pérdida o golpe emocional muy fuerte." },
        { nombre: "Apenado", desc: "Sentir tristeza o pesar, generalmente por algo lamentable propio o ajeno." },
      ]},
      { nombre: "Humillado", desc: "Sentirse profundamente avergonzado o mortificado, a menudo por ser ridiculizado públicamente, con pérdida de dignidad.", hijos: [
        { nombre: "Ridiculizado", desc: "Sentirse objeto de burla de forma hiriente, menospreciado ante los demás, generando vergüenza." },
        { nombre: "Irrespetado", desc: "Sentirse infravalorado o tratado con falta de respeto, con el propio valor u opiniones ignorados." },
      ]},
      { nombre: "Rechazado", desc: "Sentirse indeseado, excluido o descartado por los demás, con dolor por no ser valorado ni aceptado.", hijos: [
        { nombre: "Perturbado", desc: "Sentirse intranquilo o alterado emocionalmente, con la calma interior quebrada por algo inquietante." },
        { nombre: "Inadecuado", desc: "Sentir que uno no está a la altura o no encaja, con la sensación de no ser suficiente." },
      ]},
      { nombre: "Sumiso", desc: "Sentirse inclinado a ceder o someterse ante los demás, sin defender las propias necesidades o límites.", hijos: [
        { nombre: "Insignificante", desc: "Sentirse trivial o indigno de atención, como si las propias acciones o presencia no importaran." },
        { nombre: "Indignado", desc: "Sentir un fuerte desagrado ante algo percibido como injusto u ofensivo, con una sensación de ira justificada." },
      ]},
      { nombre: "Inseguro", desc: "Sentimiento de incertidumbre y falta de confianza en uno mismo, por percibir incompetencia o miedo al fracaso.", hijos: [
        { nombre: "Inferior", desc: "Sentirse menos valioso o capaz que los demás, con baja autoestima y sensación de incompetencia." },
        { nombre: "Pobre", desc: "Sentirse carente o en desventaja, con la percepción de no tener lo necesario o de valer poco." },
      ]},
      { nombre: "Asustado", desc: "Experimentar miedo intenso ante una amenaza inmediata y específica, con estado de alerta y deseo de huir o protegerse.", hijos: [
        { nombre: "Espantado", desc: "Una sensación repentina e intensa de miedo ante una amenaza o peligro inmediato e identificable." },
        { nombre: "Aterrado", desc: "Sentir un miedo extremo y paralizante ante algo percibido como profundamente amenazante." },
      ]},
    ],
  },
];

const ROB_COLORS: Record<string, { l1: string; l2: string; l3: string }> = {
  "Ira":       { l1: "#d64545", l2: "#e88b8b", l3: "#f5c9c9" },
  "Disgusto":  { l1: "#d67d2e", l2: "#e8a866", l3: "#f5d3ab" },
  "Tristeza":  { l1: "#6ba33a", l2: "#9cc76a", l3: "#cfe6a8" },
  "Felicidad": { l1: "#e8b81e", l2: "#f0d15a", l3: "#f7e7a0" },
  "Sorpresa":  { l1: "#3d84cc", l2: "#7db0e0", l3: "#bcd8f2" },
  "Miedo":     { l1: "#8f5bb5", l2: "#b58fd1", l3: "#d9c5e8" },
};

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

function RuedaEmocioneWheel() {
  const [selKey, setSelKey] = useState<string | null>(null);
  const OFFSET = -90;
  const coreSlice = 360 / emocioneData.length;

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
    const core = emocioneData[parts[0]];
    selColor = ROB_COLORS[core.nombre]?.l1 ?? core.color;
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
        Rueda de emociones con 3 niveles de adentro hacia afuera: del sentimiento general al matiz más específico. Tocá cualquier sección para explorarla.
      </p>
      <div className="mb-8">
        <InfoPopover
          label="Rueda de emociones"
          texto="La lógica es de adentro hacia afuera: el centro tiene las emociones más generales, el anillo del medio las subdivide, y el exterior llega al matiz más específico. Empezá por reconocer la emoción general y avanzá hacia afuera para nombrar con mayor precisión lo que sentís."
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 600 600" className="w-full max-w-2xl">
          {emocioneData.map((core, ci) => {
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
                  fill={ROB_COLORS[core.nombre]?.l1 ?? core.color}
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
                  const robCol  = ROB_COLORS[core.nombre];
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
                          const l3Name = l3.nombre;
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
                                  {l3Name}
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
type HerramientaId = "478" | "box" | "plutchik" | "ekman" | "emociones-wheel" | "grounding" | "escaner";

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
      { id: "emociones-wheel",  label: "Rueda de Emociones" },
      { id: "plutchik", label: "Rueda de Plutchik" },
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

        {/* Categorías */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold tracking-widest text-foreground/30 uppercase w-16 shrink-0">Área</span>
          <div className="flex gap-2">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => seleccionarCategoria(cat.id)}
                className={`relative px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
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
        <div className="flex items-center gap-2 mb-10 border-b border-foreground/8 pb-6">
          <span className="text-[10px] font-semibold tracking-widest text-foreground/30 uppercase w-16 shrink-0">Modelo</span>
          <div className="flex gap-2">
          {herramientasCat.map((h) => (
            <button
              key={h.id}
              onClick={() => setHerActiva(h.id)}
              className={`relative px-4 py-1.5 rounded-full text-xs tracking-[0.12em] uppercase font-medium transition-colors duration-200 ${
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
        {herActiva === "ekman"    && <RuedaEkman />}
        {herActiva === "emociones-wheel"  && <RuedaEmocioneWheel />}
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
