"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function ScrollRevealText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "start 0.1"],
  });

  const words = "A veces la mente necesita un espacio donde no tenga que sostener todo sola. Ese espacio existe.".split(" ");

  return (
    <section
      ref={containerRef}
      className="py-32 bg-primary-dark relative overflow-hidden"
    >
      {/* Ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />

      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl leading-relaxed font-[family-name:var(--font-playfair)]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Link
            href="/agendar"
            className="inline-block px-8 py-4 bg-accent text-primary-dark rounded-full text-lg font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-accent/20"
          >
            Dar el primer paso
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [5, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.3em] text-white"
    >
      {children}
    </motion.span>
  );
}
