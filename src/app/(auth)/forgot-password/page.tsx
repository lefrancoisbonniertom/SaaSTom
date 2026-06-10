"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
      <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
        <h1 className="text-2xl font-semibold text-[#17201b]">Vérifie ta boîte mail</h1>
        <p className="mt-3 text-sm leading-6 text-[#62736b]">
          Si un compte existe pour <strong>{email}</strong>, tu vas recevoir un email avec un lien pour réinitialiser ton mot de passe. Pense à vérifier tes spams.
        </p>
        <Link className="mt-6 inline-block text-sm font-medium text-[#e65f3c] hover:underline" href="/login">
          Retour à la connexion
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
      <h1 className="text-2xl font-semibold text-[#17201b]">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-[#62736b]">
        Indique ton email, on t&apos;envoie un lien pour le réinitialiser.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#17201b]" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="h-10 w-full rounded-md border border-[#dfe4d8] bg-white px-3 text-sm outline-none transition focus:border-[#4f6f57] focus:ring-2 focus:ring-[#4f6f57]/20"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
            type="email"
            value={email}
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
          Envoyer le lien
        </button>

        <Link className="block text-center text-sm font-medium text-[#526052] hover:underline" href="/login">
          Retour à la connexion
        </Link>
      </form>
    </section>
  );
}
