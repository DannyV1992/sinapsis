import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar cita | Sinapsis",
  description:
    "Reserva tu cita de consulta psicológica en línea. Escoge el horario que mejor se adapte a ti.",
};

export default function AgendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
