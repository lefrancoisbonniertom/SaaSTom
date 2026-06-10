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
    <section className="mt-4 rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Abonnement</h3>
          <p className="mt-1 text-sm font-medium text-[#17201b]">
            Plan actuel :{" "}
            <span className="text-[#4f6f57]">
              {PLAN_LABELS[plan] ?? "Gratuit"}
            </span>
          </p>
          {plan === "free" ? (
            <p className="mt-1 text-sm text-[#66705f]">
              Passe au plan Pro pour des générations illimitées.
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#66705f]">
              Gère ta facturation, modifie ou annule depuis le portail Stripe.
            </p>
          )}
        </div>
        {plan === "free" ? (
          <a
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-4 text-sm font-semibold text-white transition hover:bg-[#f0714f] sm:whitespace-nowrap"
            href="/pricing"
          >
            Passer au Pro
          </a>
        ) : (
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-4 text-sm font-semibold text-[#384438] transition hover:border-[#b9c4ad] hover:bg-white disabled:opacity-60 sm:whitespace-nowrap"
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
