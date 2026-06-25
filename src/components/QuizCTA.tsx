"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimateOnScroll from "./AnimateOnScroll";

export default function QuizCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light/20 to-primary/5" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimateOnScroll>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6"
            >
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              Tomate un momento para ti
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto mb-8 leading-relaxed">
              Explora cómo estás a través de herramientas de reflexión breves.
              Ansiedad, ánimo, estrés, autoestima, relaciones — elige lo que te resuene.
            </p>
            <Link
              href="/quiz"
              className="inline-block px-8 py-4 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20"
            >
              Explorar los tests
            </Link>
            <p className="mt-4 text-xs text-foreground/40">
              Herramientas validadas — confidencial, sin registro
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
