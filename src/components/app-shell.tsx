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

function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/dashboard">
      <div className="grid size-10 place-items-center rounded-lg bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_12px_30px_rgba(201,164,94,0.28)]">
        <Sparkles className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Orfeo
        </p>
        <h1 className="font-display text-xl font-semibold text-ink">
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
          ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_rgba(201,164,94,0.25)]"
          : "text-ink-muted hover:bg-surface-raised hover:text-ink"
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
    <main className="min-h-screen w-full overflow-x-hidden bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] overflow-x-hidden lg:overflow-visible">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-canvas px-5 py-5 lg:flex lg:flex-col">
          <Brand />

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

          <div className="mt-auto rounded-lg border border-border bg-surface-raised p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CircleDollarSign className="size-4 text-gold" />
              <span className="text-ink">Offre Pro</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              10 générations IA gratuites incluses. Passez au Pro à 19 EUR/mois pour un accès illimité.
            </p>
            <Link
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gold px-3 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
              href="/pricing"
            >
              Voir le plan
            </Link>
          </div>
        </aside>

        <section className="relative w-full max-w-[100vw] min-w-0 flex-1 overflow-hidden bg-canvas-soft px-4 py-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,164,94,0.07),transparent_55%)]" />

          <div className="relative">
            <header className="mb-5 border-b border-border pb-4 lg:hidden">
              <Brand />
              <nav className="mt-4 flex flex-wrap gap-2 pb-1">
                {items.map((item) => (
                  <Link
                    className={`flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition ${
                      isActiveRoute(pathname, item.href)
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : "border-border bg-surface text-ink-muted hover:text-ink"
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
                className="grid size-10 place-items-center rounded-md border border-border bg-surface text-ink-muted shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:border-gold/40 hover:text-gold"
                href="/clients"
                title="Ajouter un client"
              >
                <Plus className="size-4" />
              </Link>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
