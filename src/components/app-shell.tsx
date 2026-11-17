"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bot,
  CalendarClock,
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
import { useMemo, type ReactNode } from "react";
import { GlobalSearch } from "@/components/global-search";
import { OrfeoLogo } from "@/components/orfeo-logo";
import { useCopilot } from "@/lib/copilot-store";
import { computeDeadlines, daysUntil } from "@/lib/copilot";

type NavItem = { href: string; label: string; short: string; icon: LucideIcon };

const groups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Pilotage",
    items: [
      { href: "/dashboard", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
      { href: "/echeances", label: "Mes échéances", short: "Échéances", icon: CalendarClock },
    ],
  },
  {
    title: "Ventes",
    items: [
      { href: "/assistant", label: "Assistant IA", short: "Assistant", icon: Bot },
      { href: "/clients", label: "Clients", short: "Clients", icon: Users },
      { href: "/documents", label: "Documents", short: "Docs", icon: FileText },
    ],
  },
  {
    title: "Compte",
    items: [
      { href: "/settings", label: "Réglages", short: "Réglages", icon: Settings },
      { href: "/pricing", label: "Abonnement", short: "Offre", icon: WalletCards },
    ],
  },
];

const adminItem: NavItem = { href: "/admin", label: "Suivi", short: "Suivi", icon: Gauge };
const mobileTabs = ["/dashboard", "/echeances", "/assistant", "/clients", "/documents"];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { profile } = useCopilot();
  const isAdmin =
    !!process.env.NEXT_PUBLIC_ADMIN_EMAIL && session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const navGroups = useMemo(
    () =>
      isAdmin
        ? groups.map((g) => (g.title === "Compte" ? { ...g, items: [...g.items, adminItem] } : g))
        : groups,
    [isAdmin],
  );
  const allItems = navGroups.flatMap((g) => g.items);

  // Pastille : nombre d'échéances dans les 14 prochains jours
  const soon = useMemo(() => {
    if (!profile) return null;
    return computeDeadlines(profile, new Date(), 1).filter((d) => daysUntil(d.date) <= 14).length;
  }, [profile]);

  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const initial = (name || "O").charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-canvas text-ink">
      {/* Fond : halos et quadrillage */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[10%] h-[480px] w-[480px] rounded-full bg-mint/[0.06] blur-[120px]" />
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_60%_at_60%_0%,#000,transparent)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px]">
        {/* ───── Barre latérale (ordinateur) ───── */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col p-4 lg:flex">
          <div className="glass flex h-full flex-col rounded-3xl p-4">
            <Link className="flex items-center gap-3 px-1" href="/dashboard">
              <OrfeoLogo />
              <span>
                <span className="block font-display text-lg font-semibold leading-none">Orfeo</span>
                <span className="text-xs text-ink-muted">BusinessPilot IA</span>
              </span>
            </Link>

            <nav className="scroll-thin mt-7 flex-1 space-y-6 overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted/70">{group.title}</p>
                  <div className="mt-2 space-y-1">
                    {group.items.map((item) => {
                      const active = isActiveRoute(pathname, item.href);
                      return (
                        <Link
                          className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            active ? "bg-white/[0.06] text-ink" : "text-ink-muted hover:bg-white/[0.04] hover:text-ink"
                          }`}
                          href={item.href}
                          key={item.href}
                        >
                          {active ? (
                            <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-linear-to-b from-gold-soft to-gold shadow-[0_0_12px_rgba(214,178,110,0.8)]" />
                          ) : null}
                          <item.icon className={`size-[18px] shrink-0 transition ${active ? "text-gold" : "group-hover:text-gold"}`} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.href === "/echeances" && soon ? (
                            <span className="grid min-w-5 place-items-center rounded-full bg-mint/15 px-1.5 text-[11px] font-bold text-mint">{soon}</span>
                          ) : null}
                          {item.href === "/echeances" && !profile ? (
                            <span className="size-2 rounded-full bg-mint shadow-[0_0_10px_rgba(95,227,176,0.9)]" title="Nouveau" />
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <Link className="ring-gradient mt-4 block overflow-hidden rounded-2xl bg-linear-to-br from-gold/15 to-transparent p-4 transition hover:from-gold/20" href="/pricing">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-gold" /> Passer au Pro
              </p>
              <p className="mt-1.5 text-xs leading-5 text-ink-muted">IA et clients illimités, 19 EUR/mois.</p>
            </Link>

            <Link className="mt-3 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]" href="/settings">
              <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-mint/40 to-sky/30 text-sm font-bold">{initial}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-ink-muted">{session?.user?.email}</span>
              </span>
            </Link>
          </div>
        </aside>

        {/* ───── Contenu ───── */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:pl-2 lg:pr-6">
            <div className="glass flex h-14 items-center gap-3 rounded-2xl px-3">
              <Link className="lg:hidden" href="/dashboard">
                <OrfeoLogo />
              </Link>
              <div className="min-w-0 flex-1">
                <GlobalSearch />
              </div>
              <Link
                className="btn-gold hidden h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold sm:flex"
                href="/assistant"
              >
                <Sparkles className="size-4" /> Générer
              </Link>
              <Link
                aria-label="Ajouter un client"
                className="btn-ghost grid size-10 shrink-0 place-items-center rounded-xl"
                href="/clients"
                title="Ajouter un client"
              >
                <Plus className="size-4" />
              </Link>
              <Link
                aria-label="Réglages"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-mint/40 to-sky/30 text-sm font-bold lg:hidden"
                href="/settings"
              >
                {initial}
              </Link>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pl-2 lg:pr-6" key={pathname}>
            <div className="animate-rise">{children}</div>
          </main>
        </div>
      </div>

      {/* ───── Barre d'onglets (téléphone) ───── */}
      <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden" aria-label="Navigation principale">
        <div className="glass grid grid-cols-5 rounded-2xl p-1.5">
          {allItems
            .filter((i) => mobileTabs.includes(i.href))
            .map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  className={`relative flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition ${
                    active ? "bg-white/[0.07] text-gold" : "text-ink-muted"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <item.icon className="size-5" />
                  {item.short}
                  {item.href === "/echeances" && soon ? (
                    <span className="absolute right-3 top-1.5 size-2 rounded-full bg-mint shadow-[0_0_8px_rgba(95,227,176,0.9)]" />
                  ) : null}
                </Link>
              );
            })}
        </div>
      </nav>
    </div>
  );
}
