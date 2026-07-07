import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tests de Salud Mental Gratuitos | Sinapsis",
  description:
    "Tests y cuestionarios gratuitos de ansiedad, depresión, estrés, autoestima y bienestar. Resultados inmediatos y orientación profesional.",
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
