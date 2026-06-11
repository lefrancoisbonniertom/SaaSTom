import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(201,164,94,0.16),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              Orfeo
            </p>
            <p className="font-display text-xl font-semibold text-ink">
              BusinessPilot IA
            </p>
          </div>
        </div>
        {children}
      </div>

      <nav className="relative mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-muted">
        {legalLinks.map((link) => (
          <Link
            className="hover:text-gold hover:underline"
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
