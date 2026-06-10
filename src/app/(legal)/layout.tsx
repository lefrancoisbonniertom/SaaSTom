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
    <main className="min-h-screen bg-[linear-gradient(135deg,#f5f8f2_0%,#eef8f8_48%,#fff3ec_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/dashboard">
            <div className="grid size-10 place-items-center rounded-lg bg-[#e65f3c] text-white shadow-[0_12px_30px_rgba(230,95,60,0.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66705f]">
                SaaSTom
              </p>
              <p className="text-xl font-semibold text-[#17201b]">BusinessPilot IA</p>
            </div>
          </Link>
          <Link
            className="flex items-center gap-2 text-sm font-medium text-[#526052] hover:text-[#17201b] hover:underline"
            href={backHref}
          >
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </div>

        <div className="rounded-xl border border-white/75 bg-white/80 p-8 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur">
          {children}
        </div>

        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#62736b]">
          {legalLinks.map((link) => (
            <Link className="hover:text-[#17201b] hover:underline" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
