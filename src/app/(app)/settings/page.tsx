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
        <section className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)]">
          <div className="grid size-10 place-items-center rounded-md bg-gold/10 text-gold">
            <UserRound className="size-5" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Profil</h3>
          <p className="mt-1 text-sm font-medium text-ink">
            {session?.user?.name ?? "—"}
          </p>
          <p className="text-sm text-ink-muted">{session?.user?.email ?? "—"}</p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)]">
          <div className="grid size-10 place-items-center rounded-md bg-gold/10 text-gold">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Sécurité</h3>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Sessions actives et gestion du mot de passe.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)]">
          <div className="grid size-10 place-items-center rounded-md bg-gold/10 text-gold">
            <KeyRound className="size-5" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Clé IA</h3>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Moteur IA actif : Groq — Llama 3.3 70B. Rapide et gratuit.
          </p>
        </section>

        <IntegrationsSection webhookUrl={user?.webhookUrl ?? null} />
      </div>
      <SubscriptionSection plan={plan} />
      <SettingsActions />

      <nav className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
        <Link className="hover:text-gold hover:underline" href="/mentions-legales">
          Mentions légales
        </Link>
        <Link className="hover:text-gold hover:underline" href="/cgv">
          CGV
        </Link>
        <Link className="hover:text-gold hover:underline" href="/confidentialite">
          Confidentialité
        </Link>
      </nav>
    </>
  );
}
