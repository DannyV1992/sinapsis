import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import Chatbot from "@/components/Chatbot";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { PostHogProvider } from "./posthog-provider";

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
  metadataBase: new URL("https://sinapsiscr.com"),
  title: {
    default: "Sinapsis — Psicología Clínica en Costa Rica",
    template: "%s | Sinapsis",
  },
  description:
    "Psicóloga clínica en Costa Rica. Terapia cognitivo-conductual individual, de pareja y familiar. Agenda tu cita en línea.",
  keywords: [
    "psicóloga Costa Rica",
    "terapia cognitivo-conductual",
    "psicología clínica",
    "terapia online Costa Rica",
    "psicóloga San José",
    "terapia de pareja",
    "ansiedad",
    "depresión",
    "salud mental Costa Rica",
    "agendar cita psicóloga",
  ],
  authors: [{ name: "Licda. Cinthya Chavez" }],
  openGraph: {
    title: "Sinapsis — Psicología Clínica en Costa Rica",
    description:
      "Psicóloga clínica en Costa Rica. Terapia cognitivo-conductual individual, de pareja y familiar. Agenda tu cita en línea.",
    type: "website",
    locale: "es_CR",
    siteName: "Sinapsis",
    url: "https://sinapsiscr.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinapsis — Psicología Clínica en Costa Rica",
    description:
      "Psicóloga clínica en Costa Rica. Terapia cognitivo-conductual individual, de pareja y familiar.",
  },
  alternates: {
    canonical: "https://sinapsiscr.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GE5XQ9THJS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GE5XQ9THJS');
          `}
        </Script>
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* <Chatbot /> */}
          <WhatsAppButton />
        </PostHogProvider>
      </body>
    </html>
  );
}
