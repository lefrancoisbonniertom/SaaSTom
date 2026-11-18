"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BellRing, Check } from "lucide-react";
import { CopilotDashboard, ProfileForm } from "@/components/copilot-workspace";
import { Reveal } from "@/components/fx/motion";
import type { CopilotProfile } from "@/lib/copilot";

// Situation saisie avant l'inscription : reprise automatiquement dans le compte
// (voir lib/copilot-store.ts).
export const PENDING_COPILOT_KEY = "orfeo-copilot:pending";

function keepForSignup(profile: CopilotProfile) {
  try {
    window.localStorage.setItem(PENDING_COPILOT_KEY, JSON.stringify(profile));
  } catch {
    // stockage indisponible : l'utilisateur ressaisira après l'inscription
  }
}

/** Le copilote en mode découverte : sans compte, rien n'est envoyé au serveur. */
export function CopilotSimulator() {
  const [profile, setProfile] = useState<CopilotProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  if (!profile || editing) {
    return (
      <ProfileForm
        initial={profile}
        note="Calcul fait dans ton navigateur : rien n'est envoyé ni enregistré."
        onCancel={profile ? () => setEditing(false) : undefined}
        onSave={(p) => {
          setProfile(p);
          setEditing(false);
          keepForSignup(p);
          window.setTimeout(() => document.getElementById("resultat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        }}
      />
    );
  }

  return (
    <div className="scroll-mt-28 space-y-6" id="resultat">
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-mint/25 bg-mint/[0.07] px-4 py-3 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          <BellRing className="size-4 shrink-0 text-mint" /> Reçois un e-mail 7 jours avant chacune de ces échéances.
        </p>
        <Link className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-mint hover:text-ink" href="/register">
          Créer mon compte gratuit <ArrowRight className="size-4" />
        </Link>
      </div>
      <CopilotDashboard
        done={done}
        onEdit={() => setEditing(true)}
        onToggle={(id) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))}
        profile={profile}
        setProfile={(p) => {
          setProfile(p);
          keepForSignup(p);
        }}
      />

      <Reveal>
        <section className="glass beam relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-mint">
                <BellRing className="size-4" /> Rappels automatiques
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Ne pense plus jamais à ces dates.</h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {[
                  "Un e-mail 7 jours avant chaque échéance",
                  "Ton calendrier retrouvé sur tous tes appareils",
                  "Gratuit, sans carte bancaire",
                ].map((t) => (
                  <li className="flex items-center gap-2" key={t}>
                    <Check className="size-4 text-mint" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Link className="btn-gold inline-flex h-12 items-center gap-2 rounded-2xl px-6 font-semibold" href="/register">
                Recevoir mes rappels <ArrowRight className="size-4" />
              </Link>
              <p className="text-xs text-ink-muted">Ta situation sera reprise dans ton compte.</p>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
