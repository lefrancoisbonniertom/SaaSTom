"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { markSessionActive } from "@/lib/session-marker";

const fieldClass =
  "h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        markSessionActive();
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Connexion
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-gold hover:underline" href="/register">
          Créer un compte
        </Link>
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-ink" htmlFor="password">
              Mot de passe
            </label>
            <Link className="text-sm font-medium text-gold hover:underline" href="/forgot-password">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            autoComplete="current-password"
            className={fieldClass}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
          Se connecter
        </button>
      </form>
    </section>
  );
}
