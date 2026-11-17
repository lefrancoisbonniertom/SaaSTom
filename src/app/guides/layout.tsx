import Link from "next/link";
import type { ReactNode } from "react";
import { OrfeoLogo } from "@/components/orfeo-logo";

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
        <header className="glass mt-4 flex h-14 items-center justify-between gap-4 rounded-2xl px-3 pl-4">
          <Link className="flex items-center gap-2.5" href="/">
            <OrfeoLogo />
            <span className="font-display text-lg font-semibold">Orfeo</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="hidden px-3 font-medium text-ink-muted hover:text-gold sm:block" href="/guides">
              Guides
            </Link>
            <Link
              className="btn-ghost hidden h-10 items-center rounded-xl px-4 font-semibold sm:flex"
              href="/login"
            >
              Se connecter
            </Link>
            <Link
              className="btn-gold flex h-10 items-center rounded-xl px-4 font-semibold"
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
