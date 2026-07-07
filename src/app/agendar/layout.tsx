import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar cita con psicóloga en Costa Rica | Sinapsis",
  description:
    "Agenda tu cita de psicología en línea. Terapia individual, de pareja y familiar en Costa Rica. Modalidad presencial y virtual.",
};

export default function AgendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
