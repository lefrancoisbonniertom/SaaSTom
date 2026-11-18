import { prisma } from "@/lib/server/prisma";
import { ensureAnalyticsTable } from "@/lib/server/analytics";
import { ensureCopilotTable } from "@/lib/server/copilot-repository";

export type GrowthData = {
  days: Array<{ day: string; visits: number; views: number; signups: number }>;
  topPages: Array<{ path: string; views: number }>;
  topSources: Array<{ source: string; visits: number }>;
  funnel: { visits: number; registerViews: number; signups: number; activated: number; copilot: number };
};

const DAYS = 30;

/** Chiffres de croissance des 30 derniers jours (jours calculés à l'heure de Paris). */
export async function getGrowthData(): Promise<GrowthData> {
  await Promise.all([ensureAnalyticsTable(), ensureCopilotTable()]);
  const since = new Date(Date.now() - DAYS * 86_400_000);

  const [viewsByDay, signupsByDay, pages, sources, registerViews, newUsers] = await Promise.all([
    prisma.$queryRawUnsafe<Array<{ day: string; views: number; visits: number }>>(
      `SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris', 'YYYY-MM-DD') AS day,
              count(*)::int AS views,
              (count(*) FILTER (WHERE "entry"))::int AS visits
         FROM "PageView" WHERE "createdAt" >= $1 GROUP BY 1`,
      since,
    ),
    prisma.$queryRawUnsafe<Array<{ day: string; signups: number }>>(
      `SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Paris', 'YYYY-MM-DD') AS day,
              count(*)::int AS signups
         FROM "User" WHERE "createdAt" >= $1 GROUP BY 1`,
      since,
    ),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where: { createdAt: { gte: since }, entry: true, referrer: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 6,
    }),
    prisma.pageView.count({ where: { createdAt: { gte: since }, path: "/register" } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { _count: { select: { clients: true, documents: true } }, copilotProfile: { select: { userId: true } } },
    }),
  ]);

  const byDay = new Map<string, { visits: number; views: number; signups: number }>();
  const fmt = new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });
  for (let i = DAYS - 1; i >= 0; i--) {
    byDay.set(fmt.format(new Date(Date.now() - i * 86_400_000)), { visits: 0, views: 0, signups: 0 });
  }
  for (const row of viewsByDay) {
    const d = byDay.get(row.day);
    if (d) {
      d.views = Number(row.views);
      d.visits = Number(row.visits);
    }
  }
  for (const row of signupsByDay) {
    const d = byDay.get(row.day);
    if (d) d.signups = Number(row.signups);
  }
  const days = [...byDay.entries()].map(([day, v]) => ({ day, ...v }));

  return {
    days,
    topPages: pages.map((p) => ({ path: p.path, views: p._count._all })),
    topSources: sources.map((s) => ({ source: s.referrer ?? "direct", visits: s._count._all })),
    funnel: {
      visits: days.reduce((sum, d) => sum + d.visits, 0),
      registerViews,
      signups: newUsers.length,
      activated: newUsers.filter((u) => u._count.clients > 0 || u._count.documents > 0).length,
      copilot: newUsers.filter((u) => u.copilotProfile).length,
    },
  };
}
