import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Herramientas de Bienestar | Sinapsis",
  description: "Técnicas interactivas de respiración y grounding para momentos de ansiedad o estrés.",
};

export default function HerramientasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
