"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const fieldClass =
  "h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
        <h1 className="font-display text-2xl font-semibold text-ink">Lien invalide</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Ce lien de réinitialisation est invalide ou incomplet.
        </p>
        <Link className="mt-6 inline-block text-sm font-medium text-gold hover:underline" href="/forgot-password">
          Demander un nouveau lien
        </Link>
      </section>
    );
  }

  if (success) {
    return (
      <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
        <h1 className="font-display text-2xl font-semibold text-ink">Mot de passe mis à jour</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Ton mot de passe a bien été modifié. Redirection vers la connexion...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
      <h1 className="font-display text-2xl font-semibold text-ink">Nouveau mot de passe</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Choisis un nouveau mot de passe pour ton compte.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="password">
            Nouveau mot de passe
          </label>
          <input
            autoComplete="new-password"
            className={fieldClass}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            type="password"
            value={password}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>
          <input
            autoComplete="new-password"
            className={fieldClass}
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            type="password"
            value={confirmPassword}
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
          Réinitialiser le mot de passe
        </button>
      </form>
    </section>
  );
}
