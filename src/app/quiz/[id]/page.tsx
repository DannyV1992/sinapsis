"use client";

import { useParams } from "next/navigation";
import QuizRunner from "@/components/QuizRunner";
import { quizzes } from "@/lib/quiz-data";
import Link from "next/link";

export default function QuizPage() {
  const params = useParams();
  const id = params.id as string;
  const config = quizzes[id];

  if (!config) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Test no encontrado
          </h1>
          <Link
            href="/quiz"
            className="text-primary hover:underline"
          >
            Ver todos los tests
          </Link>
        </div>
      </div>
    );
  }

  return <QuizRunner config={config} />;
}
