import type { Metadata } from "next";
import { quizzes } from "@/lib/quiz-data";

const quizMeta: Record<string, { title: string; description: string }> = {
  ansiedad: {
    title: "Test de ansiedad (GAD-7)",
    description:
      "Evalúa tu nivel de ansiedad con el cuestionario GAD-7. Test gratuito y confidencial.",
  },
  depresion: {
    title: "Test de depresión (PHQ-9)",
    description:
      "Evalúa tu estado de ánimo con el cuestionario PHQ-9. Test gratuito y confidencial.",
  },
  estres: {
    title: "Test de estrés (PSS-10)",
    description:
      "Mide tu nivel de estrés percibido con la escala PSS-10. Test gratuito y confidencial.",
  },
  autoestima: {
    title: "Test de autoestima (Rosenberg)",
    description:
      "Evalúa tu autoestima con la escala de Rosenberg. Test gratuito y confidencial.",
  },
  apego: {
    title: "Test de apego (ECR-R)",
    description:
      "Conoce tu estilo de apego con el cuestionario ECR-R. Test gratuito y confidencial.",
  },
  bienestar: {
    title: "Test de bienestar (WHO-5)",
    description:
      "Evalúa tu bienestar general con el índice WHO-5. Test gratuito y confidencial.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const meta = quizMeta[id];

  if (!meta) {
    return { title: "Test no encontrado" };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://sinapsiscr.com/quiz/${id}`,
    },
    openGraph: {
      title: `${meta.title} | Sinapsis`,
      description: meta.description,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(quizzes).map((id) => ({ id }));
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
