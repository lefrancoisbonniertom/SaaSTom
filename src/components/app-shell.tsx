"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const navigation: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "Assistant IA", icon: Bot },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Reglages", icon: Settings },
  { href: "/pricing", label: "Tarifs", icon: WalletCards },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/dashboard">
      <div className="grid size-10 place-items-center rounded-lg bg-[#17201b] text-white">
        <Sparkles className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66705f]">
          SaaSTom
        </p>
        <h1 className="text-xl font-semibold">BusinessPilot IA</h1>
      </div>
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-[#17201b] text-white"
          : "text-[#526052] hover:bg-[#eef2ea] hover:text-[#17201b]"
      }`}
      href={href}
    >
      <Icon className="size-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f7f3] text-[#17201b]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] overflow-x-hidden lg:overflow-visible">
        <aside className="hidden w-72 shrink-0 border-r border-[#dfe4d8] bg-[#fcfdf9] px-5 py-5 lg:flex lg:flex-col">
          <Brand />

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <NavLink
                active={isActiveRoute(pathname, item.href)}
                href={item.href}
                icon={item.icon}
                key={item.href}
                label={item.label}
              />
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-[#dfe4d8] bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CircleDollarSign className="size-4 text-emerald-700" />
              Offre Pro
            </div>
            <p className="mt-2 text-sm leading-6 text-[#66705f]">
              Objectif MVP : 10 generations IA gratuites, puis abonnement a 19
              EUR/mois.
            </p>
            <Link
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-3 text-sm font-semibold text-white transition hover:bg-[#c94f32]"
              href="/pricing"
            >
              Voir le plan
            </Link>
          </div>
        </aside>

        <section className="w-full max-w-[100vw] min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-5 border-b border-[#dfe4d8] pb-4 lg:hidden">
            <Brand />
            <nav className="mt-4 flex flex-wrap gap-2 pb-1">
              {navigation.map((item) => (
                <Link
                  className={`flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium ${
                    isActiveRoute(pathname, item.href)
                      ? "border-[#17201b] bg-[#17201b] text-white"
                      : "border-[#dfe4d8] bg-white text-[#526052]"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <div className="hidden items-center justify-end gap-2 pb-5 lg:flex">
            <div className="relative min-w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#73806c]" />
              <input
                className="h-10 w-full rounded-md border border-[#dfe4d8] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#8c9785] focus:border-[#4f6f57]"
                placeholder="Rechercher client, document..."
                type="search"
              />
            </div>
            <Link
              aria-label="Ajouter un client"
              className="grid size-10 place-items-center rounded-md border border-[#dfe4d8] bg-white text-[#526052] transition hover:border-[#b9c4ad] hover:text-[#17201b]"
              href="/clients"
              title="Ajouter un client"
            >
              <Plus className="size-4" />
            </Link>
          </div>

          {children}
        </section>
      </div>
    </main>
  );
}
