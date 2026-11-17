import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

const footerLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_-10%,rgba(201,164,94,0.16),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="flex items-center justify-between gap-4 py-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid size-10 place-items-center rounded-lg bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Orfeo</p>
              <p className="hidden font-display text-xl font-semibold text-ink sm:block">BusinessPilot IA</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="hidden px-3 font-medium text-ink-muted hover:text-gold sm:block" href="/guides">
              Guides
            </Link>
            <Link
              className="hidden h-10 items-center rounded-md border border-border bg-canvas-soft px-4 font-semibold text-ink transition hover:border-gold/40 hover:text-gold sm:flex"
              href="/login"
            >
              Se connecter
            </Link>
            <Link
              className="flex h-10 items-center rounded-md bg-gold px-4 font-semibold text-canvas transition hover:bg-gold-soft"
              href="/register"
            >
              Essayer<span className="hidden sm:inline">&nbsp;gratuitement</span>
            </Link>
          </nav>
        </header>

        {children}

        <footer className="mt-20 flex flex-col items-center gap-3 border-t border-border py-8 text-sm text-ink-muted">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <Link className="hover:text-gold hover:underline" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Orfeo — Tom Lefrancois Bonnier</p>
        </footer>
      </div>
    </div>
  );
}
