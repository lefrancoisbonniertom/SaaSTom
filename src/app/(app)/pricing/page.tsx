import { PageHeader } from "@/components/page-header";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0 EUR",
    description: "Tester l'assistant et valider le besoin.",
    features: ["10 generations IA/mois", "3 clients", "Historique limite"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "19 EUR/mois",
    description: "Pour freelances et petites activites.",
    features: [
      "Generations IA et documents",
      "CRM clients illimite",
      "Devis et relances",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "49 EUR/mois",
    description: "Pour equipes et automatisations avancees.",
    features: [
      "Plusieurs utilisateurs",
      "Automatisations",
      "Exports et integrations",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        description="La page pricing sert a clarifier le modele economique avant Stripe."
        eyebrow="Tarifs"
        title="Un modele simple : gratuit pour tester, Pro pour vendre."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            className={`rounded-lg border p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)] ${
              plan.highlighted
                ? "border-[#17201b] bg-[#17201b] text-white"
                : "border-[#dfe4d8] bg-white text-[#17201b]"
            }`}
            key={plan.name}
          >
            <p
              className={`text-sm font-semibold ${
                plan.highlighted ? "text-[#cfe0c6]" : "text-[#66705f]"
              }`}
            >
              {plan.name}
            </p>
            <h3 className="mt-3 text-3xl font-semibold">{plan.price}</h3>
            <p
              className={`mt-3 text-sm leading-6 ${
                plan.highlighted ? "text-[#e6edde]" : "text-[#66705f]"
              }`}
            >
              {plan.description}
            </p>
            <div className="mt-5 space-y-3">
              {plan.features.map((feature) => (
                <div className="flex items-start gap-2" key={feature}>
                  <CheckCircle2
                    className={`mt-0.5 size-4 shrink-0 ${
                      plan.highlighted ? "text-[#a8d59b]" : "text-emerald-700"
                    }`}
                  />
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
            <button
              className={`mt-6 h-10 w-full rounded-md px-4 text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-[#e65f3c] text-white hover:bg-[#c94f32]"
                  : "bg-[#f3f7ec] text-[#17201b] hover:bg-[#e7eedf]"
              }`}
              type="button"
            >
              Choisir {plan.name}
            </button>
          </section>
        ))}
      </div>
    </>
  );
}
