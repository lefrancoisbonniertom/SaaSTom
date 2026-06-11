"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { markSessionActive } from "@/lib/session-marker";

const fieldClass =
  "h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    markSessionActive();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Créer un compte
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Déjà un compte ?{" "}
        <Link className="font-medium text-gold hover:underline" href="/login">
          Se connecter
        </Link>
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="name">
            Prénom ou nom
          </label>
          <input
            autoComplete="name"
            className={fieldClass}
            id="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Marie Dupont"
            type="text"
            value={name}
          />
        </div>

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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="password">
            Mot de passe
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

        {error ? (
          <p className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gold text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Créer mon compte
        </button>
      </form>
    </section>
  );
}
