"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const fieldClass =
  "h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
        <h1 className="font-display text-2xl font-semibold text-ink">Vérifie ta boîte mail</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Si un compte existe pour <strong className="text-ink">{email}</strong>, tu vas recevoir un email avec un lien pour réinitialiser ton mot de passe. Pense à vérifier tes spams.
        </p>
        <Link className="mt-6 inline-block text-sm font-medium text-gold hover:underline" href="/login">
          Retour à la connexion
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
      <h1 className="font-display text-2xl font-semibold text-ink">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Indique ton email, on t&apos;envoie un lien pour le réinitialiser.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className={fieldClass}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
            type="email"
            value={email}
          />
        </div>

        {error ? (
          <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        ) : null}

        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gold text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Envoyer le lien
        </button>

        <Link className="block text-center text-sm font-medium text-ink-muted hover:text-gold hover:underline" href="/login">
          Retour à la connexion
        </Link>
      </form>
    </section>
  );
}
