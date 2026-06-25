import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sinapsis.vercel.app";

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agendar`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/quiz`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/quiz/ansiedad`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/depresion`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/estres`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/autoestima`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/apego`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/quiz/bienestar`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
