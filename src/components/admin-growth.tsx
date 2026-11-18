import { ArrowDownRight, Globe, MousePointerClick } from "lucide-react";
import type { GrowthData } from "@/lib/server/growth";

const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "–");

/** Croissance sur 30 jours : visites, inscriptions, pages et sources, entonnoir. */
export function AdminGrowth({ data }: { data: GrowthData }) {
  const max = Math.max(...data.days.map((d) => d.visits), 1);
  const steps = [
    { label: "Visites", value: data.funnel.visits, hint: "pages publiques" },
    { label: "Page d'inscription", value: data.funnel.registerViews, hint: "vues" },
    { label: "Inscriptions", value: data.funnel.signups, hint: "nouveaux comptes" },
    { label: "Comptes actifs", value: data.funnel.activated, hint: "1 client ou 1 document" },
    { label: "Copilote activé", value: data.funnel.copilot, hint: "situation remplie" },
  ];
  const top = Math.max(steps[0].value, 1);

  return (
    <section className="mt-8 space-y-4">
      <h2 className="font-display text-2xl font-semibold">Croissance · 30 derniers jours</h2>

      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold">Visites et inscriptions par jour</p>
          <p className="flex items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-gold" /> Visites
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-mint" /> Inscriptions
            </span>
          </p>
        </div>
        <div className="mt-5 flex h-48 items-end gap-1">
          {data.days.map((d) => (
            <div
              className="group relative flex h-full flex-1 flex-col justify-end"
              key={d.day}
              title={`${d.day.split("-").reverse().join("/")} : ${d.visits} visite(s), ${d.views} page(s) vue(s), ${d.signups} inscription(s)`}
            >
              {d.signups > 0 ? (
                <span className="mx-auto mb-1 grid size-4 place-items-center rounded-full bg-mint text-[9px] font-bold text-canvas">{d.signups}</span>
              ) : null}
              <div
                className="w-full rounded-t-md bg-linear-to-t from-gold-deep to-gold-soft opacity-80 transition group-hover:opacity-100"
                style={{ height: `${d.visits ? Math.max((d.visits / max) * 100, 4) : 1.5}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
          <span>{data.days[0]?.day.split("-").reverse().slice(0, 2).join("/")}</span>
          <span>aujourd&apos;hui</span>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <p className="flex items-center gap-2 font-semibold">
            <ArrowDownRight className="size-4 text-mint" /> Parcours des visiteurs
          </p>
          <ol className="mt-5 space-y-3">
            {steps.map((s, i) => (
              <li key={s.label}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span>
                    {s.label} <span className="text-xs text-ink-muted">· {s.hint}</span>
                  </span>
                  <span className="font-semibold">
                    {s.value}
                    {i > 0 ? <span className="ml-2 text-xs font-normal text-ink-muted">{pct(s.value, steps[i - 1].value)}</span> : null}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-linear-to-r from-mint to-gold" style={{ width: `${(s.value / top) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass rounded-3xl p-5 sm:p-6">
          <p className="flex items-center gap-2 font-semibold">
            <MousePointerClick className="size-4 text-gold" /> Pages les plus vues
          </p>
          <List empty="Pas encore de pages vues." rows={data.topPages.map((p) => [p.path, p.views])} />
        </div>

        <div className="glass rounded-3xl p-5 sm:p-6">
          <p className="flex items-center gap-2 font-semibold">
            <Globe className="size-4 text-sky" /> D&apos;où viennent les visiteurs
          </p>
          <List empty="Pas encore de visites venant d'un autre site." rows={data.topSources.map((s) => [s.source, s.visits])} />
          <p className="mt-4 text-xs leading-5 text-ink-muted">Les visites sans site d&apos;origine (lien direct, favori) ne sont pas listées.</p>
        </div>
      </div>
    </section>
  );
}

function List({ rows, empty }: { rows: Array<[string, number]>; empty: string }) {
  if (rows.length === 0) return <p className="mt-5 text-sm text-ink-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r[1]), 1);
  return (
    <ul className="mt-4 space-y-2">
      {rows.map(([label, n]) => (
        <li className="relative overflow-hidden rounded-xl px-3 py-2 text-sm" key={label}>
          <span className="absolute inset-y-0 left-0 bg-white/[0.04]" style={{ width: `${(n / max) * 100}%` }} />
          <span className="relative flex justify-between gap-3">
            <span className="truncate">{label}</span>
            <span className="font-semibold">{n}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
