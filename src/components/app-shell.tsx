"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bot,
  CircleDollarSign,
  FileText,
  Gauge,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { GlobalSearch } from "@/components/global-search";

const navigation: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "Assistant IA", icon: Bot },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings", label: "Réglages", icon: Settings },
  { href: "/pricing", label: "Tarifs", icon: WalletCards },
];

const adminNavigation = { href: "/admin", label: "Suivi", icon: Gauge };

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link className="flex items-center gap-3" href="/dashboard">
      <div className="grid size-10 place-items-center rounded-lg bg-[#e65f3c] text-white shadow-[0_12px_30px_rgba(230,95,60,0.28)]">
        <Sparkles className="size-5" />
      </div>
      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-[0.18em] ${
            tone === "light" ? "text-[#90a39a]" : "text-[#66705f]"
          }`}
        >
          SaaSTom
        </p>
        <h1
          className={`text-xl font-semibold ${
            tone === "light" ? "text-white" : "text-[#17201b]"
          }`}
        >
          BusinessPilot IA
        </h1>
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
          ? "bg-white text-[#17201b] shadow-[0_10px_26px_rgba(0,0,0,0.18)]"
          : "text-[#a9bbb2] hover:bg-white/[0.08] hover:text-white"
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
  const { data: session } = useSession();
  const isAdmin =
    !!process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const items = isAdmin ? [...navigation, adminNavigation] : navigation;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f4f7f4] text-[#17201b]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] overflow-x-hidden lg:overflow-visible">
        <aside className="hidden w-72 shrink-0 border-r border-[#24342c] bg-[#0d1512] px-5 py-5 lg:flex lg:flex-col">
          <Brand tone="light" />

          <nav className="mt-8 space-y-1">
            {items.map((item) => (
              <NavLink
                active={isActiveRoute(pathname, item.href)}
                href={item.href}
                icon={item.icon}
                key={item.href}
                label={item.label}
              />
            ))}
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CircleDollarSign className="size-4 text-[#b9e885]" />
              <span className="text-white">Offre Pro</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#a9bbb2]">
              10 générations IA gratuites incluses. Passez au Pro à 19 EUR/mois pour un accès illimité.
            </p>
            <Link
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-3 text-sm font-semibold text-white transition hover:bg-[#f0714f]"
              href="/pricing"
            >
              Voir le plan
            </Link>
          </div>
        </aside>

        <section className="w-full max-w-[100vw] min-w-0 flex-1 bg-[linear-gradient(135deg,#f5f8f2_0%,#eef8f8_48%,#fff3ec_100%)] px-4 py-4 sm:px-6 lg:px-8">
          <header className="mb-5 border-b border-[#dfe4d8] pb-4 lg:hidden">
            <Brand />
            <nav className="mt-4 flex flex-wrap gap-2 pb-1">
              {items.map((item) => (
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
            <GlobalSearch />
            <Link
              aria-label="Ajouter un client"
              className="grid size-10 place-items-center rounded-md border border-white/70 bg-white/75 text-[#526052] shadow-[0_10px_30px_rgba(27,43,37,0.06)] transition hover:border-[#b9c4ad] hover:text-[#17201b]"
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
