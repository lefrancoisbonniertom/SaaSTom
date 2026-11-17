import type { MetadataRoute } from "next";

const SITE_URL = "https://orfeo.digitaleweb.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Espace connecté : rien à indexer
      disallow: ["/api/", "/dashboard", "/echeances", "/assistant", "/clients", "/documents", "/settings", "/admin", "/pricing"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
