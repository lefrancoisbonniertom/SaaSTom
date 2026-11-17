import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { GUIDES, SITE_URL, formatDate, getGuide } from "@/content/guides";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: `${guide.title} | Orfeo`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    authors: [{ name: "Tom Lefrancois Bonnier" }],
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: "Orfeo",
      locale: "fr_FR",
      type: "article",
      modifiedTime: guide.updatedAt,
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const others = GUIDES.filter((g) => g.slug !== guide.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.title,
        description: guide.description,
        url,
        mainEntityOfPage: url,
        inLanguage: "fr-FR",
        dateModified: guide.updatedAt,
        author: { "@type": "Person", name: "Tom Lefrancois Bonnier" },
        publisher: { "@type": "Organization", name: "Orfeo", url: SITE_URL },
        citation: guide.sources.map(([name, href]) => ({ "@type": "CreativeWork", name, url: href })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Orfeo", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
          { "@type": "ListItem", position: 3, name: guide.shortTitle, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  const { Content } = guide;

  return (
    <main className="pt-6">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-ink-muted">
        <Link className="hover:text-gold" href="/guides">
          Guides
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink-soft">{guide.shortTitle}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0">
          <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-gold" /> Vérifié le {formatDate(guide.updatedAt)} sur les sites
              officiels
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> {guide.readingMinutes} min de lecture
            </span>
          </p>

          <div className="mt-8 space-y-5">
            <Content />
          </div>

          <section aria-labelledby="faq" className="mt-12 space-y-3">
            <h2 className="font-display text-2xl font-semibold text-ink" id="faq">
              Questions fréquentes
            </h2>
            {guide.faq.map(([q, a]) => (
              <details className="group rounded-lg border border-border bg-surface/60 p-4" key={q}>
                <summary className="cursor-pointer list-none font-medium text-ink marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {q}
                    <span className="text-gold transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{a}</p>
              </details>
            ))}
          </section>

          <section className="mt-12 rounded-lg border border-border bg-surface/60 p-5">
            <h2 className="font-semibold text-ink">Sources officielles</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {guide.sources.map(([label, href]) => (
                <li key={href}>
                  <a
                    className="inline-flex items-start gap-1.5 text-ink-soft underline decoration-border underline-offset-2 hover:text-gold"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {label}
                    <ExternalLink className="mt-1 size-3 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-ink-muted">
              Ce guide donne une information générale, vérifiée à la date indiquée. Les règles évoluent : pour une
              situation particulière, rapprochez-vous de l&apos;administration concernée ou d&apos;un expert-comptable.
            </p>
          </section>

          <section className="mt-12 rounded-lg border border-gold/25 bg-linear-to-br from-gold/[0.12] to-transparent p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Orfeo</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
              Moins d&apos;administratif, plus de temps pour vos clients
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-ink-soft">
              Orfeo réunit vos clients, vos devis, vos propositions et vos relances au même endroit, avec un assistant
              IA qui rédige à votre place. Gratuit pour commencer, sans carte bancaire.
            </p>
            <Link
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
              href="/register"
            >
              Essayer Orfeo gratuitement <ArrowRight className="size-4" />
            </Link>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-8">
            <nav aria-label="Sommaire">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Sommaire</p>
              <ol className="mt-3 space-y-2 border-l border-border text-sm">
                {guide.toc.map(([id, label]) => (
                  <li key={id}>
                    <a className="-ml-px block border-l border-transparent pl-4 text-ink-soft hover:border-gold hover:text-gold" href={`#${id}`}>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">À lire aussi</p>
              <ul className="mt-3 space-y-3 text-sm">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link className="text-ink-soft hover:text-gold" href={`/guides/${g.slug}`}>
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-12 lg:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">À lire aussi</p>
        <ul className="mt-3 space-y-3 text-sm">
          {others.map((g) => (
            <li key={g.slug}>
              <Link className="text-ink-soft hover:text-gold" href={`/guides/${g.slug}`}>
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="mt-6 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold" href="/guides">
          <ArrowLeft className="size-4" /> Tous les guides
        </Link>
      </div>
    </main>
  );
}
