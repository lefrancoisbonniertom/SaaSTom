"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, Sparkles } from "lucide-react";
import { markSessionActive } from "@/lib/session-marker";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

const inputClass =
  "w-full rounded-full border border-border/80 bg-surface/40 px-5 py-3 text-center text-sm text-ink backdrop-blur-sm outline-none transition placeholder:text-ink-muted/50 focus:border-gold/60 focus:bg-surface/60";

type Mode = "password" | "otp-email" | "otp-code";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function resetFeedback() {
    setError("");
    setInfo("");
  }

  function goToDashboard() {
    markSessionActive();
    router.push("/dashboard");
    router.refresh();
  }

  // ── Connexion par mot de passe ───────────────────────────────
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetFeedback();
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
        goToDashboard();
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  // ── Google ───────────────────────────────────────────────────
  async function handleGoogle() {
    resetFeedback();
    // Le marqueur doit être posé avant la redirection OAuth.
    markSessionActive();
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("La connexion Google n'est pas disponible pour le moment.");
    }
  }

  // ── Envoi du code OTP ────────────────────────────────────────
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Impossible d'envoyer le code.");
        return;
      }
      setCode(["", "", "", "", "", ""]);
      setMode("otp-code");
      setInfo(`Code envoyé à ${email}.`);
      setTimeout(() => codeInputRefs.current[0]?.focus(), 350);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  // ── Vérification du code OTP ──────────────────────────────────
  async function submitCode(fullCode: string) {
    resetFeedback();
    setLoading(true);
    try {
      const result = await signIn("otp", {
        email,
        code: fullCode,
        redirect: false,
      });
      if (result?.error) {
        setError("Code incorrect ou expiré.");
        setCode(["", "", "", "", "", ""]);
        codeInputRefs.current[0]?.focus();
      } else {
        goToDashboard();
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
    if (index === 5 && value && next.every((d) => d.length === 1)) {
      void submitCode(next.join(""));
    }
  }

  function handleCodeKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  }

  function handleCodePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("");
    while (next.length < 6) next.push("");
    setCode(next);
    if (pasted.length === 6) {
      void submitCode(pasted);
    } else {
      codeInputRefs.current[pasted.length]?.focus();
    }
  }

  function backToPassword() {
    resetFeedback();
    setMode("password");
    setCode(["", "", "", "", "", ""]);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-canvas">
      {/* Fond animé : grille de points dorés */}
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-canvas"
          colors={[
            [201, 164, 94],
            [227, 201, 138],
          ]}
          dotSize={6}
          reverse={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,24,18,0.92)_0%,_rgba(14,24,18,0.4)_60%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-canvas to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="animate-orfeo-rise w-full max-w-sm">
          {/* Marque Orfeo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Orfeo
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
                {mode === "otp-code" ? "Entre ton code" : "Bon retour"}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">
                {mode === "otp-code"
                  ? "Saisis le code reçu par email"
                  : "Connecte-toi à ton espace BusinessPilot IA"}
              </p>
            </div>
          </div>

          {/* Feedback */}
          {error ? (
            <p className="mb-4 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
              {error}
            </p>
          ) : null}
          {info && !error ? (
            <p className="mb-4 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-center text-sm text-gold-soft">
              {info}
            </p>
          ) : null}

          {/* ── Mode mot de passe ── */}
          {mode === "password" ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogle}
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-surface/40 py-3 text-sm font-medium text-ink backdrop-blur-sm transition hover:bg-surface/70"
              >
                <GoogleIcon />
                Continuer avec Google
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-ink-muted">ou</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <input
                  autoComplete="email"
                  className={inputClass}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  required
                  type="email"
                  value={email}
                />
                <div>
                  <input
                    autoComplete="current-password"
                    className={inputClass}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    type="password"
                    value={password}
                  />
                  <div className="mt-2 text-center">
                    <Link
                      className="text-xs font-medium text-ink-muted transition-colors hover:text-gold"
                      href="/forgot-password"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Se connecter
                </button>
              </form>

              <button
                onClick={() => {
                  resetFeedback();
                  setMode("otp-email");
                }}
                type="button"
                className="flex w-full items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-gold"
              >
                <Mail className="size-4" />
                Recevoir un code par email
              </button>
            </div>
          ) : null}

          {/* ── Mode envoi du code ── */}
          {mode === "otp-email" ? (
            <form className="space-y-4" onSubmit={handleSendCode}>
              <input
                autoComplete="email"
                className={inputClass}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                required
                type="email"
                value={email}
              />
              <button
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Recevoir un code
              </button>
              <button
                onClick={backToPassword}
                type="button"
                className="flex w-full items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-gold"
              >
                <ArrowLeft className="size-4" />
                Connexion par mot de passe
              </button>
            </form>
          ) : null}

          {/* ── Mode saisie du code ── */}
          {mode === "otp-code" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeInputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    onPaste={handleCodePaste}
                    disabled={loading}
                    className="size-12 rounded-xl border border-border/80 bg-surface/40 text-center text-xl font-semibold text-ink backdrop-blur-sm outline-none transition focus:border-gold/60 focus:bg-surface/60 disabled:opacity-60"
                  />
                ))}
              </div>

              {loading ? (
                <p className="flex items-center justify-center gap-2 text-sm text-ink-muted">
                  <Loader2 className="size-4 animate-spin" /> Vérification…
                </p>
              ) : null}

              <button
                onClick={() => void handleSendCode({ preventDefault() {} } as React.FormEvent)}
                type="button"
                disabled={loading}
                className="block w-full text-center text-sm font-medium text-ink-muted transition-colors hover:text-gold disabled:opacity-60"
              >
                Renvoyer le code
              </button>

              <button
                onClick={backToPassword}
                type="button"
                className="flex w-full items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-gold"
              >
                <ArrowLeft className="size-4" />
                Retour
              </button>
            </div>
          ) : null}

          {mode !== "otp-code" ? (
            <p className="mt-6 text-center text-sm text-ink-muted">
              Pas encore de compte ?{" "}
              <Link
                className="font-medium text-gold hover:underline"
                href="/register"
              >
                Créer un compte
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      {/* Liens légaux */}
      <nav className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-8 text-xs text-ink-muted">
        {legalLinks.map((link) => (
          <Link
            className="transition-colors hover:text-gold hover:underline"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
