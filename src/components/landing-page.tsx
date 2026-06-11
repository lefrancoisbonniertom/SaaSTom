import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Sparkles,
  Users,
} from "lucide-react";

const navLinks = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#tarifs", label: "Tarifs" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

const features = [
  {
    icon: Bot,
    title: "Assistant IA",
    description:
      "Décris ton besoin en quelques mots : Orfeo rédige un email de relance, une proposition commerciale ou un devis prêt à envoyer.",
  },
  {
    icon: Users,
    title: "Clients centralisés",
    description:
      "Garde une vue claire sur chaque client : statut, montant, prochaine action et étiquettes, dans un pipeline visuel.",
  },
  {
    icon: FileText,
    title: "Documents & relances",
    description:
      "Génère, modifie, exporte en PDF et envoie tes documents directement au client, sans changer d'outil.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & suivi",
    description:
      "Suis ton activité, ton chiffre d'affaires signé et tes priorités du jour en un coup d'œil.",
  },
];

const plans = [
  {
    name: "Gratuit",
    price: "0 EUR",
    description: "Pour tester l'outil et suivre quelques clients.",
    features: ["10 générations IA", "3 clients", "Historique de documents"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19 EUR/mois",
    description: "Le cockpit complet pour vendre plus vite.",
    features: [
      "Générations IA illimitées",
      "Clients illimités",
      "Documents et relances IA",
      "Pipeline commercial",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "49 EUR/mois",
    description: "Pour automatiser les relances et industrialiser.",
    features: [
      "Tout le plan Pro",
      "Espaces équipe",
      "Automatisations avancées",
      "Support prioritaire",
    ],
    highlighted: false,
  },
];

export function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,164,94,0.16),transparent_55%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6">
        <header className="flex items-center justify-between gap-4 py-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid size-10 place-items-center rounded-lg bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                Orfeo
              </p>
              <p className="font-display text-xl font-semibold text-ink">
                BusinessPilot IA
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted sm:flex">
            {navLinks.map((link) => (
              <a className="hover:text-gold" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              className="flex h-10 items-center rounded-md border border-border bg-canvas-soft px-4 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold"
              href="/login"
            >
              Se connecter
            </Link>
            <Link
              className="flex h-10 items-center rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
              href="/register"
            >
              Essayer gratuitement
            </Link>
          </div>
        </header>

        <section className="flex flex-col items-start gap-6 py-16 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold/10 px-3 py-2 text-sm font-semibold text-ink-soft">
            <Sparkles className="size-4 text-gold" />
            Copilote IA pour indépendants
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Pilote ton activité de freelance avec un copilote IA.
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-ink-soft">
            Orfeo centralise tes clients, transforme tes briefs en documents
            professionnels et relance au bon moment — pour que tu passes
            moins de temps sur l&apos;administratif et plus sur ton métier.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
              href="/register"
            >
              Essayer gratuitement
              <ArrowRight className="size-4" />
            </Link>
            <a
              className="flex h-11 items-center rounded-md border border-border bg-canvas-soft px-6 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold"
              href="#tarifs"
            >
              Voir les tarifs
            </a>
          </div>
        </section>

        <section className="py-12 sm:py-16" id="fonctionnalites">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Fonctionnalités
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
            Tout ce qu&apos;il faut pour gérer ton activité au quotidien.
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                className="rounded-lg border border-border bg-surface/70 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur"
                key={feature.title}
              >
                <div className="grid size-10 place-items-center rounded-md bg-gold/10 text-gold">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16" id="tarifs">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Tarifs
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
            Un prix simple pour un copilote qui fait avancer le business.
          </h2>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                className={`flex flex-col rounded-lg border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)] ${
                  plan.highlighted
                    ? "border-gold/40 bg-surface text-ink"
                    : "border-border bg-surface/70 text-ink backdrop-blur"
                }`}
                key={plan.name}
              >
                <p
                  className={`text-sm font-semibold uppercase tracking-[0.14em] ${
                    plan.highlighted ? "text-gold" : "text-ink-muted"
                  }`}
                >
                  {plan.name}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-ink">
                  {plan.price}
                </h3>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    plan.highlighted ? "text-ink-soft" : "text-ink-muted"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div className="flex items-start gap-2" key={feature}>
                      <CheckCircle2
                        className={`mt-0.5 size-4 shrink-0 ${
                          plan.highlighted ? "text-gold" : "text-emerald-400"
                        }`}
                      />
                      <p className="text-sm">{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  className={`mt-6 flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-gold text-canvas hover:bg-gold-soft"
                      : "border border-border bg-canvas-soft text-ink hover:border-gold/40 hover:text-gold"
                  }`}
                  href="/register"
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="my-8 rounded-lg border border-gold/20 bg-gold/10 p-8 text-center sm:p-12">
          <h2 className="font-display text-3xl font-semibold text-ink">
            Prêt à gagner du temps sur ton administratif ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-soft">
            Crée ton compte gratuitement et génère ton premier document avec
            Orfeo en moins de deux minutes.
          </p>
          <Link
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-gold px-6 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
            href="/register"
          >
            Créer mon compte
            <ArrowRight className="size-4" />
          </Link>
        </section>

        <footer className="flex flex-col items-center gap-3 border-t border-border py-8 text-sm text-ink-muted">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                className="hover:text-gold hover:underline"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Orfeo — Tom Lefrancois Bonnier</p>
        </footer>
      </div>
    </main>
  );
}
