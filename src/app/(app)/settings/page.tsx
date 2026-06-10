import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { PageHeader } from "@/components/page-header";
import { IntegrationsSection } from "@/components/integrations-section";
import { SettingsActions } from "@/components/settings-actions";
import { SubscriptionSection } from "@/components/subscription-section";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true, webhookUrl: true },
      })
    : null;
  const plan = user?.plan ?? "free";

  return (
    <>
      <PageHeader
        description="Gère ton compte, ta sécurité et les préférences de ton espace SaaSTom."
        eyebrow="Réglages"
        title="Configure ton espace SaaS."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
          <div className="grid size-10 place-items-center rounded-md bg-[#f3f7ec] text-[#4f6f57]">
            <UserRound className="size-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Profil</h3>
          <p className="mt-1 text-sm font-medium text-[#17201b]">
            {session?.user?.name ?? "—"}
          </p>
          <p className="text-sm text-[#66705f]">{session?.user?.email ?? "—"}</p>
        </section>

        <section className="rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
          <div className="grid size-10 place-items-center rounded-md bg-[#f3f7ec] text-[#4f6f57]">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Sécurité</h3>
          <p className="mt-2 text-sm leading-6 text-[#66705f]">
            Sessions actives et gestion du mot de passe.
          </p>
        </section>

        <section className="rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
          <div className="grid size-10 place-items-center rounded-md bg-[#f3f7ec] text-[#4f6f57]">
            <KeyRound className="size-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Clé IA</h3>
          <p className="mt-2 text-sm leading-6 text-[#66705f]">
            Moteur IA actif : Groq — Llama 3.3 70B. Rapide et gratuit.
          </p>
        </section>

        <IntegrationsSection webhookUrl={user?.webhookUrl ?? null} />
      </div>
      <SubscriptionSection plan={plan} />
      <SettingsActions />

      <nav className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#90a39a]">
        <Link className="hover:text-[#17201b] hover:underline" href="/mentions-legales">
          Mentions légales
        </Link>
        <Link className="hover:text-[#17201b] hover:underline" href="/cgv">
          CGV
        </Link>
        <Link className="hover:text-[#17201b] hover:underline" href="/confidentialite">
          Confidentialité
        </Link>
      </nav>
    </>
  );
}
