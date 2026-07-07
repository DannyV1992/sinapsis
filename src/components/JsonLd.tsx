import { config } from "@/lib/config";

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Sinapsis — Psicología Clínica",
    description:
      "Consulta psicológica profesional con enfoque cognitivo-conductual. Terapia individual, de pareja y familiar.",
    url: "https://sinapsiscr.com",
    telephone: config.phoneDisplay,
    email: config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "San José",
      addressCountry: "CR",
    },
    priceRange: "₡30,000 - ₡45,000",
    openingHours: "Mo-Fr 08:00-17:00",
    medicalSpecialty: "ClinicalPsychology",
    availableService: [
      {
        "@type": "MedicalTherapy",
        name: "Terapia individual",
        description: "Sesión de psicoterapia individual de 1 hora",
      },
      {
        "@type": "MedicalTherapy",
        name: "Terapia de pareja",
        description: "Sesión de psicoterapia de pareja de 1.5 horas",
      },
      {
        "@type": "MedicalTherapy",
        name: "Terapia familiar",
        description: "Sesión de psicoterapia familiar de 1.5 horas",
      },
    ],
    founder: {
      "@type": "Person",
      name: config.professional.fullTitle,
      jobTitle: config.professional.role,
      description: `Psicóloga clínica con enfoque ${config.professional.approach}. Código CPPCR: 14176.`,
    },
    sameAs: [config.instagram],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sinapsis",
    url: "https://sinapsiscr.com",
    description:
      "Psicología clínica en Costa Rica. Agenda tu cita en línea.",
    inLanguage: "es",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://sinapsiscr.com/quiz?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
