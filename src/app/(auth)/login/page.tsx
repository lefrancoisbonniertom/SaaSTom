"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { markSessionActive } from "@/lib/session-marker";

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
    <section className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
      <h1 className="text-2xl font-semibold text-[#17201b]">Connexion</h1>
      <p className="mt-1 text-sm text-[#62736b]">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-[#e65f3c] hover:underline" href="/register">
          Créer un compte
        </Link>
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#17201b]" htmlFor="password">
            Mot de passe
          </label>
          <input
            autoComplete="current-password"
            className="h-10 w-full rounded-md border border-[#dfe4d8] bg-white px-3 text-sm outline-none transition focus:border-[#4f6f57] focus:ring-2 focus:ring-[#4f6f57]/20"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
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
          Se connecter
        </button>
      </form>
    </section>
  );
}
