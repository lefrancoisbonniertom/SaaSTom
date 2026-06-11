import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { PageHeader } from "@/components/page-header";
import { PricingButton } from "@/components/pricing-buttons";
import { CheckCircle2, Sparkles } from "lucide-react";

const plans = [
  {
    key: "free" as const,
    name: "Gratuit",
    price: "0 EUR",
    description: "Valider le besoin, tester les premiers documents et suivre quelques clients.",
    features: ["10 générations IA", "3 clients", "Historique de documents"],
    highlighted: false,
  },
  {
    key: "pro" as const,
    name: "Pro",
    price: "19 EUR/mois",
    description: "Le cockpit complet pour indépendants qui veulent vendre plus vite.",
    features: [
      "Générations IA illimitées",
      "Clients illimités",
      "Documents et relances IA",
      "Pipeline commercial",
    ],
    highlighted: true,
  },
  {
    key: "business" as const,
    name: "Business",
    price: "49 EUR/mois",
    description: "Pour équipes qui veulent automatiser les relances et industrialiser la production.",
    features: [
      "Tout le plan Pro",
      "Espaces équipe",
      "Automatisations avancées",
      "Support prioritaire",
    ],
    highlighted: false,
  },
];

export default async function PricingPage() {
  const session = await auth();
  let currentPlan = "free";

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    currentPlan = user?.plan ?? "free";
  }

  return (
    <>
      <PageHeader
        description="Une offre lisible pour transformer SaaSTom en produit vendable : gratuit pour essayer, Pro pour gagner du temps chaque semaine."
        eyebrow="Tarifs"
        title="Un prix simple pour un SaaS qui fait avancer le business."
      />

      <section className="mb-4 rounded-lg border border-border bg-canvas p-5 text-ink shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold/10 px-3 py-2 text-sm font-semibold text-ink-soft">
              <Sparkles className="size-4 text-gold" />
              Positionnement MVP
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
              SaaSTom vend du temps gagné, pas seulement des générations IA.
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft">
              Centralise les clients, transforme les briefs en documents, relance
              au bon moment.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface/60 p-4">
            <p className="text-sm font-medium text-ink-muted">Plan recommandé</p>
            <p className="mt-1 font-display text-3xl font-semibold text-gold">Pro 19 EUR</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            className={`rounded-lg border p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)] ${
              plan.highlighted
                ? "border-gold/40 bg-surface text-ink"
                : "border-border bg-surface/70 text-ink backdrop-blur"
            }`}
            key={plan.key}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-[0.14em] ${
                plan.highlighted ? "text-gold" : "text-ink-muted"
              }`}
            >
              {plan.name}
              {currentPlan === plan.key ? (
                <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  Actuel
                </span>
              ) : null}
            </p>
            <h3 className="mt-3 font-display text-3xl font-semibold text-ink">{plan.price}</h3>
            <p
              className={`mt-3 min-h-16 text-sm leading-6 ${
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
            <PricingButton
              currentPlan={currentPlan}
              highlighted={plan.highlighted}
              plan={plan.key}
            />
          </section>
        ))}
      </div>
    </>
  );
}
