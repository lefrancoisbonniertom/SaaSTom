import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { CopilotSimulator } from "@/components/copilot-simulator";
import { OrfeoLogo } from "@/components/orfeo-logo";

const title = "Calculateur d'échéances du micro-entrepreneur (Urssaf, CFE, TVA)";
const description =
  "Gratuit et sans inscription : calcule en 30 secondes toutes tes échéances de micro-entrepreneur pour les 12 prochains mois — déclarations Urssaf, CFE, impôts — et vérifie ton seuil de TVA.";

export const metadata: Metadata = {
  title: `${title} | Orfeo`,
  description,
  alternates: { canonical: "/calculateur-echeances" },
  openGraph: {
    title,
    description,
    url: "https://orfeo.digitaleweb.fr/calculateur-echeances",
    siteName: "Orfeo",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Orfeo" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculateur d'échéances du micro-entrepreneur",
  url: "https://orfeo.digitaleweb.fr/calculateur-echeances",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "fr-FR",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: "Orfeo", url: "https://orfeo.digitaleweb.fr" },
};

export default function CalculateurPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(95,227,176,0.12),transparent_70%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="glass mt-4 flex h-14 items-center justify-between gap-4 rounded-2xl px-3 pl-4">
          <Link className="flex items-center gap-2.5" href="/">
            <OrfeoLogo />
            <span className="font-display text-lg font-semibold">Orfeo</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="hidden px-3 font-medium text-ink-muted hover:text-gold sm:block" href="/guides">
              Guides
            </Link>
            <Link className="btn-gold flex h-10 items-center rounded-xl px-4 font-semibold" href="/register">
              Créer mon compte
            </Link>
          </nav>
        </header>

        <main className="pb-20 pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-mint/12 px-3 py-1 text-xs font-semibold text-mint">
              <CalendarClock className="size-3.5" /> Gratuit · sans inscription
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Toutes tes échéances de micro-entrepreneur, <span className="text-shine">en 30 secondes.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
              Déclarations Urssaf, CFE, déclaration de revenus, seuil de TVA : réponds à 4 questions et obtiens ton
              calendrier des 12 prochains mois, à ajouter à ton agenda.
            </p>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-muted">
              <ShieldCheck className="size-4 text-mint" /> Règles vérifiées sur Service-Public et impots.gouv.fr
            </p>
          </div>

          <div className="mt-12">
            <CopilotSimulator />
          </div>
        </main>

        <footer className="flex flex-col items-center gap-3 border-t border-border py-8 text-sm text-ink-muted">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {[
              ["/guides", "Guides"],
              ["/mentions-legales", "Mentions légales"],
              ["/cgv", "CGV"],
              ["/confidentialite", "Confidentialité"],
            ].map(([href, label]) => (
              <Link className="hover:text-gold hover:underline" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Orfeo — Tom Lefrancois Bonnier</p>
        </footer>
      </div>
    </div>
  );
}
