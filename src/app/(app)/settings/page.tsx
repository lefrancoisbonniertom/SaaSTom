import { PageHeader } from "@/components/page-header";
import { SettingsActions } from "@/components/settings-actions";
import { KeyRound, Plug, ShieldCheck, UserRound } from "lucide-react";

const settings = [
  {
    title: "Profil",
    description: "Nom, entreprise et preferences de ton espace SaaSTom.",
    icon: UserRound,
  },
  {
    title: "Securite",
    description: "Connexion, sessions actives et future authentification.",
    icon: ShieldCheck,
  },
  {
    title: "Cle IA",
    description: "Preparation du futur branchement avec l'API OpenAI.",
    icon: KeyRound,
  },
  {
    title: "Integrations",
    description: "Stripe, email et exports PDF arriveront apres le MVP.",
    icon: Plug,
  },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        description="Cette page prepare les zones qui deviendront connectees quand le backend sera ajoute."
        eyebrow="Reglages"
        title="Configure ton futur espace SaaS."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <section
            className="rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]"
            key={item.title}
          >
            <div className="grid size-10 place-items-center rounded-md bg-[#f3f7ec] text-[#4f6f57]">
              <item.icon className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#66705f]">
              {item.description}
            </p>
          </section>
        ))}
      </div>
      <SettingsActions />
    </>
  );
}
