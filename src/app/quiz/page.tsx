"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tests = [
  {
    id: "ansiedad",
    title: "¿Cómo está mi ansiedad?",
    description: "Evalúa tu nivel de ansiedad en las últimas 2 semanas.",
    scale: "GAD-7",
    duration: "2 min",
    questions: 7,
    color: "from-purple-500/20 to-indigo-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    id: "depresion",
    title: "¿Cómo está mi ánimo?",
    description: "Explora cómo te has sentido emocionalmente estas semanas.",
    scale: "PHQ-9",
    duration: "3 min",
    questions: 9,
    color: "from-blue-500/20 to-cyan-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    ),
  },
  {
    id: "estres",
    title: "¿Cuánto estrés cargo?",
    description: "Descubre tu nivel de estrés percibido en el último mes.",
    scale: "PSS-10",
    duration: "3 min",
    questions: 10,
    color: "from-orange-500/20 to-amber-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    ),
  },
  {
    id: "autoestima",
    title: "¿Cómo me veo a mí mismo/a?",
    description: "Reflexiona sobre la relación que tienes contigo.",
    scale: "Rosenberg",
    duration: "2 min",
    questions: 10,
    color: "from-emerald-500/20 to-teal-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
  },
  {
    id: "apego",
    title: "¿Cómo me vinculo con otros?",
    description: "Explora tu estilo de apego en las relaciones.",
    scale: "ECR-R",
    duration: "3 min",
    questions: 12,
    color: "from-pink-500/20 to-rose-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
  },
  {
    id: "bienestar",
    title: "¿Cómo está mi bienestar?",
    description: "Un chequeo rápido de cómo te sientes en general.",
    scale: "WHO-5",
    duration: "1 min",
    questions: 5,
    color: "from-violet-500/20 to-purple-500/20",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
];

export default function QuizHub() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            ¿Cómo estás?
          </h1>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto">
            Elige el tema que más te resuene. No hay respuestas correctas ni
            incorrectas — es un espacio para escucharte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/quiz/${test.id}`}
                className="group block h-full"
              >
                <div className={`relative h-full p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {test.icon}
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-sm text-foreground/50 mb-4 leading-relaxed">
                      {test.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-foreground/40">
                      <span>{test.questions} preguntas</span>
                      <span>·</span>
                      <span>{test.duration}</span>
                      <span>·</span>
                      <span className="italic">Test: {test.scale}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-section-alt rounded-xl text-center">
          <p className="text-xs text-foreground/50">
            Estos cuestionarios son herramientas de reflexión validadas
            científicamente. No constituyen un diagnóstico clínico.
          </p>
        </div>
      </div>
    </div>
  );
}
