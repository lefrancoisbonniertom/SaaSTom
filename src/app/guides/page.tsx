import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDES, SITE_URL, formatDate } from "@/content/guides";

const title = "Guides pratiques du micro-entrepreneur";
const description =
  "Échéances Urssaf, CFE, seuils de TVA… Des guides clairs et vérifiés sur les sites officiels pour gérer l'administratif de votre micro-entreprise sans stress.";

export const metadata: Metadata = {
  title: `${title} | Orfeo`,
  description,
  alternates: { canonical: "/guides" },
  openGraph: { title, description, url: `${SITE_URL}/guides`, siteName: "Orfeo", locale: "fr_FR", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function GuidesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/guides`,
    inLanguage: "fr-FR",
    hasPart: GUIDES.map((g) => ({ "@type": "Article", headline: g.title, url: `${SITE_URL}/guides/${g.slug}` })),
  };

  return (
    <main className="pt-10">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Guides</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        L&apos;administratif du micro-entrepreneur, expliqué simplement
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
        Des réponses claires aux questions que tout indépendant se pose, vérifiées sur les sites officiels et datées.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {GUIDES.map((g) => (
          <Link
            className="group flex flex-col rounded-lg border border-border bg-surface/70 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:border-gold/40"
            href={`/guides/${g.slug}`}
            key={g.slug}
          >
            <h2 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-gold-soft">
              {g.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{g.description}</p>
            <div className="mt-6 flex items-center justify-between text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" /> {g.readingMinutes} min · vérifié le {formatDate(g.updatedAt)}
              </span>
              <ArrowRight className="size-4 text-gold transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
