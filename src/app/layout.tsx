import type { Metadata } from "next";
import { Geist, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sinapsis.vercel.app"),
  title: "Sinapsis — Psicología y bienestar",
  description:
    "Consulta psicológica profesional. Agenda tu cita y comienza tu camino hacia el bienestar emocional.",
  openGraph: {
    title: "Sinapsis — Psicología y bienestar",
    description:
      "Consulta psicológica profesional. Agenda tu cita y comienza tu camino hacia el bienestar emocional.",
    type: "website",
    locale: "es_CR",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${playfair.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
