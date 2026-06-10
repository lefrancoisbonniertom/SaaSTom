"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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
      <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-[#17201b]">Lien invalide</h1>
        <p className="mt-3 text-sm leading-6 text-[#62736b]">
          Ce lien de réinitialisation est invalide ou incomplet.
        </p>
        <Link className="mt-6 inline-block text-sm font-medium text-[#e65f3c] hover:underline" href="/forgot-password">
          Demander un nouveau lien
        </Link>
      </section>
    );
  }

  if (success) {
    return (
      <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-[#17201b]">Mot de passe mis à jour</h1>
        <p className="mt-3 text-sm leading-6 text-[#62736b]">
          Ton mot de passe a bien été modifié. Redirection vers la connexion...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
      <h1 className="text-2xl font-semibold text-[#17201b]">Nouveau mot de passe</h1>
      <p className="mt-1 text-sm text-[#62736b]">
        Choisis un nouveau mot de passe pour ton compte.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#17201b]" htmlFor="password">
            Nouveau mot de passe
          </label>
          <input
            autoComplete="new-password"
            className="h-10 w-full rounded-md border border-[#dfe4d8] bg-white px-3 text-sm outline-none transition focus:border-[#4f6f57] focus:ring-2 focus:ring-[#4f6f57]/20"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            type="password"
            value={password}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#17201b]" htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>
          <input
            autoComplete="new-password"
            className="h-10 w-full rounded-md border border-[#dfe4d8] bg-white px-3 text-sm outline-none transition focus:border-[#4f6f57] focus:ring-2 focus:ring-[#4f6f57]/20"
            id="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            type="password"
            value={confirmPassword}
          />
        </div>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        ) : null}

        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#e65f3c] text-sm font-semibold text-white transition hover:bg-[#f0714f] disabled:opacity-60"
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
