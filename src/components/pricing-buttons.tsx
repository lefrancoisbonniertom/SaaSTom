"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function PricingButton({
  plan,
  highlighted,
  currentPlan,
}: {
  plan: "free" | "pro" | "business";
  highlighted: boolean;
  currentPlan: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isCurrentPlan = plan === currentPlan;

  async function handleClick() {
    if (plan === "free" || isCurrentPlan) {
      router.push("/dashboard");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; message?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:opacity-60 ${
        highlighted
          ? "bg-gold text-canvas hover:bg-gold-soft"
          : "border border-border bg-canvas-soft text-ink hover:border-gold/40 hover:text-gold"
      }`}
      disabled={loading || isCurrentPlan}
      onClick={() => void handleClick()}
      type="button"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : null}
      {isCurrentPlan ? "Plan actuel" : `Choisir ${plan === "pro" ? "Pro" : plan === "business" ? "Business" : "Gratuit"}`}
      {!isCurrentPlan && !loading && highlighted ? (
        <ArrowRight className="size-4" />
      ) : null}
    </button>
  );
}
