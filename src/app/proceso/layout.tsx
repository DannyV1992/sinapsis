import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cómo funciona la terapia? | Sinapsis — Licda. Cinthya Chávez",
  description:
    "Conoce el proceso terapéutico completo: desde la primera consulta hasta el cierre del proceso. Psicología cognitivo-conductual en San José, Costa Rica.",
};

export default function ProcesoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
