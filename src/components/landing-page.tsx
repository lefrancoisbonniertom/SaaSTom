import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Bot,
  CalendarClock,
  Check,
  FileText,
  Mail,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OrfeoScene } from "@/components/three/orfeo-scene";
import { Reveal, SpotlightCard, Tilt } from "@/components/fx/motion";
import { CursorGlow, HeroFade, Meteors, ScrollTilt, TextReveal, TypewriterDemo } from "@/components/fx/landing-fx";
import { BeamFlow, OrbitingTools } from "@/components/fx/orbit-beam";
import { ProductMockup } from "@/components/product-mockup";
import { OrfeoLogo } from "@/components/orfeo-logo";
import { GUIDES } from "@/content/guides";
import { CATEGORY_LABELS, computeDeadlines, daysUntil, vatStatus, type CopilotProfile } from "@/lib/copilot";

const navLinks = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#copilote", label: "Copilote" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "/guides", label: "Guides" },
];

const legalLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

const trades = ["Freelances", "Artisans", "Consultants", "Graphistes", "Développeurs", "Coachs", "Photographes", "Formateurs", "Rédacteurs", "Architectes d'intérieur"];

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    description: "Pour tester l'outil et suivre quelques clients.",
    features: ["10 générations IA", "3 clients", "Historique de documents", "Copilote des échéances"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "EUR / mois",
    description: "Le cockpit complet pour vendre plus vite.",
    features: ["Générations IA illimitées", "Clients illimités", "Documents et relances IA", "Pipeline commercial"],
    highlighted: true,
  },
  {
    name: "Business",
    price: "49",
    period: "EUR / mois",
    description: "Pour automatiser les relances et industrialiser.",
    features: ["Tout le plan Pro", "Espaces équipe", "Automatisations avancées", "Support prioritaire"],
    highlighted: false,
  },
];

const faqs: Array<[string, string]> = [
  ["Orfeo est-il vraiment gratuit ?", "Oui, l'offre Gratuit n'a pas de limite de durée : 10 générations IA et 3 clients pour découvrir l'outil. Tu passes au Pro seulement si tu en as besoin."],
  ["Puis-je arrêter mon abonnement quand je veux ?", "Oui. L'abonnement est mensuel et se résilie à tout moment depuis tes réglages. Ton compte repasse alors en offre Gratuit à la fin du mois en cours."],
  ["Le copilote remplace-t-il un expert-comptable ?", "Non. Il te rappelle les échéances courantes d'un micro-entrepreneur (Urssaf, CFE, TVA) et t'explique quoi faire, avec des sources officielles. Pour une situation particulière, un expert-comptable reste le bon interlocuteur."],
  ["Où sont stockées mes données ?", "Chez des prestataires reconnus (Vercel pour l'application, Neon pour la base de données, Stripe pour le paiement). Tes données ne sont ni vendues ni utilisées à des fins publicitaires."],
];

const DEMO_PROFILE: CopilotProfile = { activity: "liberal", periodicity: "trimestrielle", startDate: "2025-03-01", revenueThisYear: 29_400 };

export function LandingPage() {
  const upcoming = computeDeadlines(DEMO_PROFILE).slice(0, 4);
  const vat = vatStatus(DEMO_PROFILE);

  return (
    <main className="relative overflow-x-clip bg-canvas text-ink">
      <CursorGlow />
      {/* ───── Navigation ───── */}
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl px-3 pl-4">
          <Link className="flex items-center gap-2.5" href="/">
            <OrfeoLogo />
            <span className="font-display text-lg font-semibold tracking-tight">Orfeo</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm text-ink-muted md:flex">
            {navLinks.map((l) => (
              <a className="rounded-lg px-3 py-1.5 transition hover:bg-white/5 hover:text-ink" href={l.href} key={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link className="hidden rounded-xl px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink sm:block" href="/login">
              Se connecter
            </Link>
            <Link className="btn-gold flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold" href="/register">
              Commencer <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Hero 3D ───── */}
      <section className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-20 pb-16 md:flex-row md:items-center md:pt-28">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_70%_40%,rgba(214,178,110,0.14),transparent_60%),radial-gradient(60%_50%_at_10%_90%,rgba(95,227,176,0.08),transparent_60%)]" />
        <div className="bg-grid absolute inset-0 -z-20 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
        <OrfeoScene className="relative -z-10 h-[42svh] w-full shrink-0 md:absolute md:inset-0 md:h-auto" />
        <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[60%] bg-linear-to-r from-canvas from-30% via-canvas/85 to-transparent md:block" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38%] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_35%)] [perspective:420px]">
          <div className="absolute inset-0 [transform:rotateX(62deg)] [transform-origin:50%_0%]">
            <div
              className="absolute -inset-x-1/2 h-[300%] [animation:orfeo-grid-flow_14s_linear_infinite]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(214,178,110,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(214,178,110,0.28) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/30 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-canvas" />

        <HeroFade className="mx-auto w-full max-w-6xl px-5">
          <div className="max-w-2xl">
            <a
              className="glass animate-rise inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs text-ink-soft transition hover:text-ink"
              href="#copilote"
            >
              <span className="rounded-full bg-mint/15 px-2 py-0.5 font-semibold text-mint">Nouveau</span>
              Le copilote de tes échéances Urssaf, CFE et TVA
              <ArrowRight className="size-3.5" />
            </a>
            <h1 className="animate-rise mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight [animation-delay:80ms] sm:text-7xl">
              Vends plus.
              <br />
              <span className="text-shine">Oublie l&apos;administratif.</span>
            </h1>
            <p className="animate-rise mt-6 max-w-xl text-lg leading-8 text-ink-soft [animation-delay:160ms]">
              Orfeo réunit tes clients, rédige tes devis et relances avec l&apos;IA, et te prévient avant chaque
              échéance de ta micro-entreprise. Un seul cockpit pour ton activité.
            </p>
            <div className="animate-rise mt-9 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Link className="btn-gold flex h-12 items-center justify-center gap-2 rounded-2xl px-6 font-semibold" href="/register">
                Commencer gratuitement <ArrowRight className="size-4" />
              </Link>
              <a className="btn-ghost flex h-12 items-center justify-center gap-2 rounded-2xl px-6 font-semibold" href="#fonctionnalites">
                Voir comment ça marche
              </a>
            </div>
            <p className="animate-rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted [animation-delay:320ms]">
              {["Gratuit pour commencer", "Sans carte bancaire", "Conçu en France"].map((t) => (
                <span className="flex items-center gap-1.5" key={t}>
                  <Check className="size-4 text-mint" /> {t}
                </span>
              ))}
            </p>
          </div>
        </HeroFade>
      </section>

      {/* ───── Métiers ───── */}
      <section aria-label="Pour qui" className="border-y border-white/5 py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-ink-muted/70">
            {[...trades, ...trades].map((t, i) => (
              <span className="flex items-center gap-12" key={i}>
                {t} <span className="text-gold/60">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Aperçu du produit ───── */}
      <section className="relative mx-auto max-w-6xl px-5 pt-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Ton cockpit</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Toute ton activité, <span className="text-shine">en un coup d&apos;œil.</span>
          </h2>
        </Reveal>
        <div className="relative mt-14">
          <div aria-hidden className="absolute inset-x-[10%] top-[20%] -z-10 h-2/3 rounded-full bg-gold/20 blur-[120px]" />
          <ScrollTilt>
            <ProductMockup />
          </ScrollTilt>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-canvas" />
        </div>
      </section>

      {/* ───── Fonctionnalités (bento) ───── */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-5 py-28" id="fonctionnalites">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Fonctionnalités</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Tout ton business, <span className="text-shine">au même endroit.</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-ink-soft">
            Fini les fichiers éparpillés, les relances oubliées et les dates limites qui tombent par surprise.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <SpotlightCard className="glass beam h-full rounded-3xl p-7">
              <FeatureTitle icon={Bot} kicker="Assistant IA" title="Décris ton besoin, Orfeo rédige." />
              <p className="mt-3 max-w-md text-ink-soft">
                Devis, propositions commerciales, relances de facture : l&apos;assistant transforme tes notes en
                document prêt à envoyer, que tu peux modifier, exporter en PDF et envoyer.
              </p>
              <TypewriterDemo />
            </SpotlightCard>
          </Reveal>

          <Reveal className="md:col-span-2" delay={80}>
            <SpotlightCard className="glass h-full rounded-3xl p-7">
              <FeatureTitle icon={Users} kicker="Clients" title="Un pipeline clair." />
              <div className="mt-6 space-y-2.5">
                {[
                  ["Studio Lumen", "Prospect", "bg-white/10 text-ink-soft"],
                  ["Atelier Martin", "À relancer", "bg-coral/15 text-coral"],
                  ["Café Rivière", "En cours", "bg-sky/15 text-sky"],
                  ["Maison Laurent", "Signé", "bg-mint/15 text-mint"],
                ].map(([n, s, c], i) => (
                  <div
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm"
                    key={n}
                    style={{ animation: `orfeo-float ${6 + i}s ease-in-out ${i * 0.4}s infinite` }}
                  >
                    <span>{n}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c}`}>{s}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="md:col-span-2" delay={60}>
            <SpotlightCard className="glass h-full rounded-3xl p-7">
              <FeatureTitle icon={FileText} kicker="Documents" title="PDF propres, envoyés en un clic." />
              <div className="relative mt-6 h-36">
                {[0, 1, 2].map((i) => (
                  <div
                    className="absolute left-1/2 top-0 h-32 w-28 rounded-xl border border-white/10 bg-linear-to-b from-surface-raised to-surface p-3 shadow-2xl"
                    key={i}
                    style={{ transform: `translateX(-50%) rotate(${(i - 1) * 9}deg) translateY(${Math.abs(i - 1) * 8}px)` }}
                  >
                    <div className="h-2 w-12 rounded bg-gold/60" />
                    <div className="mt-3 space-y-1.5">
                      <div className="h-1.5 rounded bg-white/15" />
                      <div className="h-1.5 w-4/5 rounded bg-white/10" />
                      <div className="h-1.5 w-3/5 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="md:col-span-2" delay={120}>
            <SpotlightCard className="glass h-full rounded-3xl p-7">
              <FeatureTitle icon={Mail} kicker="Chaque matin" title="Ton récap par e-mail." />
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Les clients à relancer et tes tâches du jour arrivent dans ta boîte mail. Tu commences la journée en
                sachant quoi faire.
              </p>
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm">
                <span className="relative grid size-9 place-items-center rounded-lg bg-gold/15 text-gold">
                  <BellRing className="size-4" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-lg border border-gold/50" />
                </span>
                <span>
                  <strong className="block font-semibold">3 relances aujourd&apos;hui</strong>
                  <span className="text-ink-muted">et 2 tâches en attente</span>
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="md:col-span-2" delay={180}>
            <SpotlightCard className="glass h-full rounded-3xl p-7">
              <FeatureTitle icon={Zap} kicker="Connecté" title="Branché à tes outils." />
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Exporte tes clients et documents en CSV, et envoie tes événements vers tes outils d&apos;automatisation (Zapier, Make, n8n…)
                grâce aux webhooks.
              </p>
              <div className="mt-2">
                <OrbitingTools />
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* ───── Manifeste (texte qui s'allume au défilement) ───── */}
      <TextReveal text="Tu as lancé ton activité pour faire ton métier. Pas pour courir après les devis, les relances et les déclarations Urssaf. *Orfeo *s'occupe *du *reste." />

      {/* ───── Copilote ───── */}
      <section className="relative scroll-mt-24 overflow-hidden py-28" id="copilote">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(95,227,176,0.10),transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">Copilote administratif</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Plus jamais une échéance <span className="text-shine">oubliée.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-ink-soft">
              Indique ton activité et ta date de création : Orfeo calcule tes déclarations Urssaf, ta CFE, ta
              déclaration de revenus et surveille ton seuil de TVA. Ajoute tout à ton agenda en un clic, avec un
              rappel trois jours avant.
            </p>
            <ul className="mt-7 space-y-3 text-ink-soft">
              {[
                "Calendrier calculé pour ta situation, mensuelle ou trimestrielle",
                "Jauge de franchise de TVA, avec les seuils 2026",
                "Chaque échéance expliquée, sources officielles à l'appui",
              ].map((t) => (
                <li className="flex items-start gap-3" key={t}>
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
                    <Check className="size-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link className="btn-gold mt-9 inline-flex h-12 items-center gap-2 rounded-2xl px-6 font-semibold" href="/register">
              Activer mon copilote <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <Tilt>
              <div className="glass beam rounded-3xl p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 font-semibold">
                    <CalendarClock className="size-5 text-mint" /> Mes prochaines échéances
                  </p>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-ink-muted">Exemple</span>
                </div>
                <ol className="relative mt-6 space-y-4 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-linear-to-b before:from-mint/60 before:to-transparent">
                  {upcoming.map((d, i) => {
                    const days = daysUntil(d.date);
                    return (
                      <li className="relative flex gap-4" key={d.id}>
                        <span
                          className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-xl border text-xs font-bold ${
                            i === 0 ? "border-mint/50 bg-mint/15 text-mint" : "border-white/10 bg-canvas text-ink-muted"
                          }`}
                        >
                          {d.date.getDate()}
                        </span>
                        <div className="min-w-0 flex-1 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate font-medium">{d.title}</p>
                            <span className="shrink-0 text-xs text-ink-muted">
                              {days <= 0 ? "aujourd'hui" : `J-${days}`}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-ink-muted">
                            {CATEGORY_LABELS[d.category]} · {d.approx ? "vers le " : ""}
                            {d.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Franchise de TVA</span>
                    <span className="text-ink-muted">
                      {DEMO_PROFILE.revenueThisYear.toLocaleString("fr-FR")} € / {vat.base.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-mint via-gold to-coral"
                      style={{ width: `${Math.min(vat.ratio * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* ───── Comment ça marche ───── */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-5 py-24">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Comment ça marche</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Tu donnes l&apos;essentiel, <span className="text-shine">Orfeo fait le reste.</span>
          </h2>
        </Reveal>
        <Reveal className="mt-14" delay={100}>
          <BeamFlow />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["01", "Crée ton compte", "Un e-mail suffit. Pas de carte bancaire, pas d'installation."],
            ["02", "Ajoute tes clients", "Ton pipeline prend forme : prospects, devis en cours, contrats signés."],
            ["03", "Laisse Orfeo t'aider", "L'IA rédige, le copilote te prévient, le récap du matin te guide."],
          ].map(([n, t, d], i) => (
            <Reveal delay={i * 100} key={n}>
              <div className="flex gap-4 border-t border-white/8 pt-5">
                <span className="font-display text-3xl font-semibold text-gold/40">{n}</span>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Tarifs ───── */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24" id="tarifs">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Tarifs</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Simple et sans surprise.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">Commence gratuitement. Passe au Pro quand Orfeo te fait gagner du temps.</p>
        </Reveal>
        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal delay={i * 90} key={plan.name}>
              <SpotlightCard
                className={`glass flex h-full flex-col rounded-3xl p-7 ${plan.highlighted ? "beam lg:-translate-y-3" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className={`font-semibold ${plan.highlighted ? "text-gold" : "text-ink-soft"}`}>{plan.name}</p>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">Recommandé</span>
                  ) : null}
                </div>
                <p className="mt-5 flex items-end gap-2">
                  <span className="font-display text-5xl font-semibold">{plan.price}</span>
                  <span className="pb-1.5 text-sm text-ink-muted">{plan.price === "0" ? "EUR, " : ""}{plan.period}</span>
                </p>
                <p className="mt-3 text-sm text-ink-muted">{plan.description}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li className="flex items-center gap-2.5" key={f}>
                      <Check className={`size-4 ${plan.highlighted ? "text-gold" : "text-mint"}`} /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  className={`mt-8 flex h-11 items-center justify-center rounded-2xl text-sm font-semibold ${plan.highlighted ? "btn-gold" : "btn-ghost"}`}
                  href="/register"
                >
                  Commencer
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Guides ───── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Guides gratuits</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">L&apos;administratif, expliqué simplement.</h2>
          </div>
          <Link className="flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-soft" href="/guides">
            Tous les guides <ArrowRight className="size-4" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g, i) => (
            <Reveal delay={i * 90} key={g.slug}>
              <Link className="group block h-full" href={`/guides/${g.slug}`}>
                <SpotlightCard className="glass h-full rounded-3xl p-6 transition group-hover:-translate-y-1">
                  <Sparkles className="size-5 text-gold" />
                  <h3 className="mt-4 font-semibold leading-snug group-hover:text-gold-soft">{g.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{g.description}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="mx-auto max-w-3xl px-5 py-24">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Questions fréquentes</h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a], i) => (
            <Reveal delay={i * 60} key={q}>
              <details className="glass group rounded-2xl p-5 open:ring-1 open:ring-gold/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/5 text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── Appel final ───── */}
      <section className="px-5 pb-24">
        <Reveal>
          <div className="noise ring-gradient relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/5 bg-surface px-6 py-20 text-center">
            <OrfeoScene className="absolute inset-0 opacity-60" variant="compact" />
            <Meteors />
            <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(6,10,8,0.2),rgba(6,10,8,0.85))]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Ton prochain client mérite toute ton attention.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-ink-soft">Laisse Orfeo s&apos;occuper du reste. C&apos;est gratuit pour commencer.</p>
              <Link className="btn-gold mt-9 inline-flex h-12 items-center gap-2 rounded-2xl px-7 font-semibold" href="/register">
                Créer mon compte <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/5 px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-ink-muted sm:flex-row">
          <div className="flex items-center gap-2.5">
            <OrfeoLogo />
            <span>© {new Date().getFullYear()} Orfeo — Tom Lefrancois Bonnier</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link className="hover:text-gold" href={l.href} key={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

function FeatureTitle({ icon: Icon, kicker, title }: { icon: LucideIcon; kicker: string; title: string }) {
  return (
    <>
      <p className="flex items-center gap-2 text-sm font-semibold text-gold">
        <Icon className="size-4" /> {kicker}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
    </>
  );
}
