import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materiales Descargables | Sinapsis",
  description: "Plantillas y guías de TCC para complementar tu proceso terapéutico. Gratuitas y listas para imprimir.",
};

export default function DescargasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
