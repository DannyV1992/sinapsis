"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QuizConfig } from "@/lib/quiz-data";

export default function QuizRunner({ config }: { config: QuizConfig }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < config.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const result = config.getResult(totalScore);
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / config.questions.length) * 100;

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
            {config.title}
          </h1>
          <p className="mt-3 text-foreground/60">{config.subtitle}</p>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs text-foreground/40 mt-2 text-right">
            {showResult ? "Completado" : `${currentQuestion + 1} de ${config.questions.length}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <p className="text-lg font-medium text-foreground mb-6">
                {config.questions[currentQuestion]}
              </p>
              <div className="space-y-3">
                {config.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left px-5 py-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <span className="text-foreground/70 group-hover:text-primary transition-colors">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className={`p-6 sm:p-8 rounded-2xl ${result.bg} border ${result.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-3xl font-bold ${result.color} font-[family-name:var(--font-playfair)]`}>
                    {totalScore}/{config.maxScore}
                  </div>
                  <div>
                    <p className={`font-semibold ${result.color}`}>
                      Nivel: {result.level}
                    </p>
                  </div>
                </div>
                <p className="text-foreground/70 leading-relaxed mb-4">
                  {result.message}
                </p>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  <strong>Recomendación:</strong> {result.recommendation}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-foreground/70 mb-4">
                  ¿Te gustaría hablar con una profesional sobre tus resultados?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/agendar"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                  >
                    Agendar una sesión
                  </Link>
                  <button
                    onClick={restart}
                    className="px-6 py-3 border-2 border-gray-200 text-foreground/60 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Repetir
                  </button>
                  <Link
                    href="/quiz"
                    className="px-6 py-3 border-2 border-gray-200 text-foreground/60 rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Otros tests
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-section-alt rounded-xl">
                <p className="text-xs text-foreground/50 leading-relaxed">
                  <strong>Aviso:</strong> Este cuestionario es una herramienta de
                  reflexión, no un diagnóstico clínico. Solo un profesional puede
                  realizar una evaluación completa.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
