import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sinapsiscr.com";

  return [
    // Páginas principales
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/agendar`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/terapia`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/sobre-mi`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/empresas`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    // Tests de bienestar
    { url: `${baseUrl}/quiz`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/quiz/ansiedad`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/depresion`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/estres`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/autoestima`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/apego`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/bienestar`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    // Recursos
    { url: `${baseUrl}/recursos/herramientas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/recursos/biblioteca`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/recursos/descargas`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/recursos/apoyo`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    // Legales
    { url: `${baseUrl}/politicas`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/consentimiento`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
