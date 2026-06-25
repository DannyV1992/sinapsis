import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conócete | Sinapsis",
  description:
    "Herramientas de autoevaluación para conocer tu estado emocional. Cuestionarios de ansiedad, depresión, estrés y más.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
