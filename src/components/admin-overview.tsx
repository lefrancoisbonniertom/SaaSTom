import { Crown, FileText, UserPlus, Users, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/saastom-data";

type PlanBreakdown = {
  free: number;
  pro: number;
  business: number;
};

type RecentUser = {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  createdAt: string;
};

type AdminOverviewProps = {
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  payingUsers: number;
  conversionRate: number;
  mrr: number;
  planBreakdown: PlanBreakdown;
  recentUsers: RecentUser[];
  totalClients: number;
  totalDocuments: number;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  pro: "Pro",
  business: "Business",
};

const PLAN_BADGE_STYLES: Record<string, string> = {
  free: "border-[#d8e3dc] bg-[#f3f7ec] text-[#526052]",
  pro: "border-[#b9e885]/50 bg-[#eafbe0] text-[#2f6b1f]",
  business: "border-[#58c7ff]/40 bg-[#e6f7ff] text-[#155a78]",
};

const PLAN_BAR_STYLES: Record<string, string> = {
  free: "bg-[#a9bbb2]",
  pro: "bg-[#7bc24a]",
  business: "bg-[#58c7ff]",
};

type Metric = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  accent: string;
};

export function AdminOverview({
  totalUsers,
  newUsers7d,
  newUsers30d,
  payingUsers,
  conversionRate,
  mrr,
  planBreakdown,
  recentUsers,
  totalClients,
  totalDocuments,
}: AdminOverviewProps) {
  const metrics: Metric[] = [
    {
      label: "Utilisateurs inscrits",
      value: String(totalUsers),
      note: `+${newUsers7d} cette semaine`,
      icon: Users,
      accent: "bg-[#def3ff] text-[#155a78]",
    },
    {
      label: "Abonnés payants",
      value: String(payingUsers),
      note: `${conversionRate.toFixed(1)}% de conversion`,
      icon: Crown,
      accent: "bg-[#fff0d0] text-[#84600e]",
    },
    {
      label: "MRR estimé",
      value: formatCurrency(mrr),
      note: "Pro + Business",
      icon: WalletCards,
      accent: "bg-[#dff7e7] text-[#17613b]",
    },
    {
      label: "Nouveaux (30 jours)",
      value: String(newUsers30d),
      note: "inscriptions récentes",
      icon: UserPlus,
      accent: "bg-[#ffe3db] text-[#9f3b20]",
    },
  ];

  const planRows = (["free", "pro", "business"] as const).map((key) => ({
    key,
    label: PLAN_LABELS[key],
    count: planBreakdown[key],
    share: totalUsers > 0 ? (planBreakdown[key] / totalUsers) * 100 : 0,
  }));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <section
            className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#62736b]">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#111b17]">
                  {metric.value}
                </p>
              </div>
              <div
                className={`grid size-10 place-items-center rounded-md ${metric.accent}`}
              >
                <metric.icon className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-[#62736b]">{metric.note}</p>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
            Répartition
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
            Utilisateurs par plan
          </h3>

          <div className="mt-5 space-y-4">
            {planRows.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${PLAN_BADGE_STYLES[row.key]}`}
                  >
                    {row.label}
                  </span>
                  <span className="font-semibold text-[#111b17]">
                    {row.count}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#eef2ec]">
                  <div
                    className={`h-full rounded-full ${PLAN_BAR_STYLES[row.key]}`}
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#d8e3dc] pt-4">
            <div>
              <p className="text-sm text-[#62736b]">Clients enregistrés</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#111b17]">
                <Users className="size-4 text-[#526b60]" />
                {totalClients}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#62736b]">Documents générés</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#111b17]">
                <FileText className="size-4 text-[#526b60]" />
                {totalDocuments}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur sm:p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
            Acquisition
          </p>
          <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
            Derniers inscrits
          </h3>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.1em] text-[#90a39a]">
                  <th className="pb-2 pr-3">Nom</th>
                  <th className="pb-2 pr-3">Email</th>
                  <th className="pb-2 pr-3">Plan</th>
                  <th className="pb-2">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td className="py-4 text-[#62736b]" colSpan={4}>
                      Aucun utilisateur pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((user) => (
                    <tr
                      className="border-t border-[#eef2ec]"
                      key={user.id}
                    >
                      <td className="py-2 pr-3 font-medium text-[#111b17]">
                        {user.name ?? "—"}
                      </td>
                      <td className="py-2 pr-3 text-[#62736b]">
                        {user.email}
                      </td>
                      <td className="py-2 pr-3">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${PLAN_BADGE_STYLES[user.plan] ?? PLAN_BADGE_STYLES.free}`}
                        >
                          {PLAN_LABELS[user.plan] ?? user.plan}
                        </span>
                      </td>
                      <td className="py-2 text-[#62736b]">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
