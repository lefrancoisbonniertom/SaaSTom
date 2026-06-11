import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { PageHeader } from "@/components/page-header";
import { AdminOverview } from "@/components/admin-overview";

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  pro: 19,
  business: 49,
};

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export default async function AdminPage() {
  const session = await auth();

  if (
    !process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    redirect("/dashboard");
  }

  const sevenDaysAgo = daysAgo(7);
  const thirtyDaysAgo = daysAgo(30);

  const [
    totalUsers,
    newUsers7d,
    newUsers30d,
    planCounts,
    recentUsers,
    totalClients,
    totalDocuments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.groupBy({ by: ["plan"], _count: true }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, plan: true, createdAt: true },
    }),
    prisma.client.count(),
    prisma.document.count(),
  ]);

  const planBreakdown = { free: 0, pro: 0, business: 0 };
  for (const row of planCounts) {
    if (row.plan in planBreakdown) {
      planBreakdown[row.plan as keyof typeof planBreakdown] = row._count;
    }
  }

  const payingUsers = planBreakdown.pro + planBreakdown.business;
  const mrr =
    planBreakdown.pro * PLAN_PRICES.pro +
    planBreakdown.business * PLAN_PRICES.business;
  const conversionRate = totalUsers > 0 ? (payingUsers / totalUsers) * 100 : 0;

  return (
    <>
      <PageHeader
        description="Vue d'ensemble des inscriptions, abonnements et revenus récurrents de Orfeo."
        eyebrow="Suivi"
        title="Le pouls de l'application."
      />
      <AdminOverview
        conversionRate={conversionRate}
        mrr={mrr}
        newUsers7d={newUsers7d}
        newUsers30d={newUsers30d}
        payingUsers={payingUsers}
        planBreakdown={planBreakdown}
        recentUsers={recentUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          createdAt: user.createdAt.toISOString(),
        }))}
        totalClients={totalClients}
        totalDocuments={totalDocuments}
        totalUsers={totalUsers}
      />
    </>
  );
}
