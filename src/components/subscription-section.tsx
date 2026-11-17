"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  pro: "Pro — 19 EUR/mois",
  business: "Business — 49 EUR/mois",
};

export function SubscriptionSection({ plan }: { plan: string }) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass mt-4 rounded-3xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">Abonnement</h3>
          <p className="mt-1 text-sm font-medium text-ink">
            Plan actuel :{" "}
            <span className="text-gold">
              {PLAN_LABELS[plan] ?? "Gratuit"}
            </span>
          </p>
          {plan === "free" ? (
            <p className="mt-1 text-sm text-ink-muted">
              Passe au plan Pro pour des générations illimitées.
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-muted">
              Gère ta facturation, modifie ou annule depuis le portail Stripe.
            </p>
          )}
        </div>
        {plan === "free" ? (
          <a
            className="btn-gold flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold sm:whitespace-nowrap"
            href="/pricing"
          >
            Passer au Pro
          </a>
        ) : (
          <button
            className="btn-ghost flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-ink-soft hover:border-gold/40 hover:text-gold disabled:opacity-60 sm:whitespace-nowrap"
            disabled={loading}
            onClick={() => void openPortal()}
            type="button"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ExternalLink className="size-4" />
            )}
            Gérer l&apos;abonnement
          </button>
        )}
      </div>
    </section>
  );
}
