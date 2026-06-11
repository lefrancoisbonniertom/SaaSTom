import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default async function LegalLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const backHref = session?.user ? "/dashboard" : "/login";
  const backLabel = session?.user ? "Retour au tableau de bord" : "Retour à la connexion";

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,164,94,0.16),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/dashboard">
            <div className="grid size-10 place-items-center rounded-lg bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                SaaSTom
              </p>
              <p className="font-display text-xl font-semibold text-ink">BusinessPilot IA</p>
            </div>
          </Link>
          <Link
            className="flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-gold hover:underline"
            href={backHref}
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-surface/80 p-8 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
          {children}
        </div>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-muted">
          {legalLinks.map((link) => (
            <Link className="hover:text-gold hover:underline" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
