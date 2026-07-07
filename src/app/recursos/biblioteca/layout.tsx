import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca Recomendada | Sinapsis",
  description: "Libros, podcasts, charlas TED y documentales curados sobre salud mental, psicología y bienestar emocional.",
};

export default function BibliotecaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
