import type { MetadataRoute } from "next";
import { GUIDES, SITE_URL } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = GUIDES.map((g) => g.updatedAt).sort().at(-1);
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/guides`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/register`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
