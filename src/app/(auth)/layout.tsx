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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#f5f8f2_0%,#eef8f8_48%,#fff3ec_100%)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-[#e65f3c] text-white shadow-[0_12px_30px_rgba(230,95,60,0.28)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66705f]">
              SaaSTom
            </p>
            <p className="text-xl font-semibold text-[#17201b]">BusinessPilot IA</p>
          </div>
        </div>
        {children}
      </div>

      <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#90a39a]">
        {legalLinks.map((link) => (
          <Link className="hover:text-[#17201b] hover:underline" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
