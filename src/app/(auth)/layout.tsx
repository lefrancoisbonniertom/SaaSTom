import Link from "next/link";
import type { ReactNode } from "react";
import { OrfeoLogo } from "@/components/orfeo-logo";
import { OrfeoScene } from "@/components/three/orfeo-scene";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/confidentialite", label: "Confidentialité" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="noise relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-4 py-10">
      <OrfeoScene className="absolute inset-0 -z-10 opacity-50" variant="compact" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(6,10,8,0.92),rgba(6,10,8,0.55)_70%,rgba(6,10,8,0.2))]" />
      <div className="animate-rise relative w-full max-w-md">
        <Link className="mb-8 flex flex-col items-center gap-3" href="/">
          <OrfeoLogo size="lg" />
          <span className="font-display text-2xl font-semibold">Orfeo</span>
        </Link>
        {children}
      </div>

      <nav className="relative mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink-muted">
        {legalLinks.map((link) => (
          <Link className="hover:text-gold hover:underline" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
