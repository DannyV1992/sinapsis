import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Playfair_Display, Quicksand, Cormorant_Garamond, Lora, Caveat } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
// import Chatbot from "@/components/Chatbot";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { PostHogProvider } from "./posthog-provider";
import ScrollToTop from "@/components/ScrollToTop";

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

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sinapsiscr.com"),
  title: {
    default: "Sinapsis — Psicología Clínica en Costa Rica",
    template: "%s | Sinapsis",
  },
  description:
    "Psicóloga clínica en Costa Rica. Terapia individual, de pareja y familiar con enfoque cognitivo-conductual. Espacio afirmativo para comunidad LGBTQ+, diversidad relacional y procesos de identidad. Agenda tu cita en línea.",
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
    "psicóloga LGBTQ Costa Rica",
    "terapia afirmativa Costa Rica",
    "diversidad relacional",
    "terapia identidad de género",
    "psicóloga comunidad LGBTQ+",
  ],
  authors: [{ name: "Licda. Cinthya Chávez" }],
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
      className={`${geistSans.variable} ${playfair.variable} ${quicksand.variable} ${cormorant.variable} ${lora.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          id="google-analytics-loader"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-1F00E5F123"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            var host = window.location.hostname;
            var isExcluded = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app') || window.location.pathname.startsWith('/admin');
            if (!isExcluded) {
              window.dataLayer = window.dataLayer || [];
              window.gtag = function gtag(){ window.dataLayer.push(arguments); };
              window.gtag('js', new Date());
              window.gtag('config', 'G-1F00E5F123');
              window.gtag('config', 'AW-18306929852');
            }
          `}
        </Script>
        <PostHogProvider>
          <ScrollToTop />
          <SiteShell>
            {children}
          </SiteShell>
          {/* <Chatbot /> */}
        </PostHogProvider>
      </body>
    </html>
  );
}
