"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarPlus,
  Check,
  CheckCircle2,
  Circle,
  Info,
  PencilLine,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { CountUp, Reveal, SpotlightCard } from "@/components/fx/motion";
import { useCopilot } from "@/lib/copilot-store";
import {
  ACTIVITY_LABELS,
  CATEGORY_LABELS,
  buildIcs,
  computeDeadlines,
  daysUntil,
  formatDay,
  vatStatus,
  type Activity,
  type Category,
  type CopilotProfile,
  type Periodicity,
} from "@/lib/copilot";

const CATEGORY_STYLES: Record<Category, string> = {
  urssaf: "bg-mint/12 text-mint border-mint/25",
  cfe: "bg-gold/12 text-gold border-gold/25",
  impots: "bg-sky/12 text-sky border-sky/25",
  tva: "bg-coral/12 text-coral border-coral/25",
  facture: "bg-white/5 text-ink-soft border-white/10",
};

export function CopilotWorkspace() {
  const { profile, done, ready, setProfile, toggleDone } = useCopilot();
  const [editing, setEditing] = useState(false);

  if (!ready) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="skeleton h-64 rounded-3xl" />
        <div className="skeleton h-64 rounded-3xl" />
      </div>
    );
  }

  if (!profile || editing) {
    return (
      <ProfileForm
        initial={profile}
        onCancel={profile ? () => setEditing(false) : undefined}
        onSave={(p) => {
          setProfile(p);
          setEditing(false);
        }}
      />
    );
  }

  return <CopilotDashboard done={done} onEdit={() => setEditing(true)} onToggle={toggleDone} profile={profile} setProfile={setProfile} />;
}

/* ───────────────────────── Tableau des échéances ───────────────────────── */

function CopilotDashboard({
  profile,
  done,
  onToggle,
  onEdit,
  setProfile,
}: {
  profile: CopilotProfile;
  done: string[];
  onToggle: (id: string) => void;
  onEdit: () => void;
  setProfile: (p: CopilotProfile) => void;
}) {
  const deadlines = useMemo(() => computeDeadlines(profile), [profile]);
  const vat = useMemo(() => vatStatus(profile), [profile]);
  const next = deadlines.find((d) => !done.includes(d.id));
  const [revenue, setRevenue] = useState(String(profile.revenueThisYear || ""));

  const byMonth = useMemo(() => {
    const map = new Map<string, typeof deadlines>();
    for (const d of deadlines) {
      const k = d.date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      map.set(k, [...(map.get(k) ?? []), d]);
    }
    return [...map.entries()];
  }, [deadlines]);

  function downloadIcs() {
    const blob = new Blob([buildIcs(deadlines.filter((d) => !done.includes(d.id)))], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orfeo-echeances.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function saveRevenue(event: FormEvent) {
    event.preventDefault();
    const n = Number(String(revenue).replace(/\s/g, "").replace(",", "."));
    if (Number.isFinite(n) && n >= 0) setProfile({ ...profile, revenueThisYear: Math.round(n) });
  }

  const days = next ? daysUntil(next.date) : 0;
  const urgency = days <= 3 ? "text-coral" : days <= 14 ? "text-gold" : "text-mint";
  const ringPct = next ? Math.max(4, 100 - Math.min(days, 60) * (100 / 60)) : 100;
  const vatColor =
    vat.level === "major" ? "from-coral to-coral" : vat.level === "base" ? "from-gold to-coral" : vat.level === "watch" ? "from-mint to-gold" : "from-mint to-mint";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-gold flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold" onClick={downloadIcs} type="button">
          <CalendarPlus className="size-4" /> Ajouter à mon agenda
        </button>
        <button className="btn-ghost flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold" onClick={onEdit} type="button">
          <PencilLine className="size-4" /> Modifier ma situation
        </button>
        <p className="text-xs text-ink-muted sm:ml-2">
          {ACTIVITY_LABELS[profile.activity].split(" (")[0]} · déclaration {profile.periodicity}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Prochaine échéance */}
        <Reveal>
          <SpotlightCard className="glass ring-gradient h-full rounded-3xl p-6 sm:p-8">
            {next ? (
              <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
                <div className="relative mx-auto grid size-40 shrink-0 place-items-center sm:mx-0">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" fill="none" r="52" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      className="transition-[stroke-dashoffset] duration-[1600ms] ease-out"
                      cx="60"
                      cy="60"
                      fill="none"
                      r="52"
                      stroke="url(#ring)"
                      strokeDasharray={2 * Math.PI * 52}
                      strokeDashoffset={2 * Math.PI * 52 * (1 - ringPct / 100)}
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                    <defs>
                      <linearGradient id="ring" x1="0" x2="1">
                        <stop offset="0%" stopColor="#5fe3b0" />
                        <stop offset="100%" stopColor="#d6b26e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <CountUp className={`block font-display text-5xl font-semibold ${urgency}`} value={Math.max(days, 0)} />
                    <span className="text-xs uppercase tracking-[0.2em] text-ink-muted">{days === 1 ? "jour" : "jours"}</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Prochaine échéance</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">{next.title}</h2>
                  <p className="mt-1 text-sm text-gold-soft">
                    {next.approx ? "vers le " : "avant le "}
                    {formatDay(next.date)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{next.detail}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      className="btn-ghost flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold"
                      onClick={() => onToggle(next.id)}
                      type="button"
                    >
                      <Check className="size-4 text-mint" /> C&apos;est fait
                    </button>
                    {next.guide ? (
                      <Link
                        className="flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-gold hover:text-gold-soft"
                        href={`/guides/${next.guide}`}
                        target="_blank"
                      >
                        <BookOpen className="size-4" /> Comprendre
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-ink-soft">Aucune échéance à venir dans les 12 prochains mois. Profites-en !</p>
            )}
          </SpotlightCard>
        </Reveal>

        {/* Seuil de TVA */}
        <Reveal delay={90}>
          <SpotlightCard className="glass h-full rounded-3xl p-6 sm:p-7">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Receipt className="size-4 text-coral" /> Franchise de TVA
            </p>
            <p className="mt-4 flex items-end gap-2">
              <CountUp
                className="font-display text-4xl font-semibold"
                format={(n) => `${Math.round(n).toLocaleString("fr-FR")} €`}
                value={profile.revenueThisYear}
              />
              <span className="pb-1.5 text-sm text-ink-muted">encaissés cette année</span>
            </p>
            <div className="relative mt-5 h-3 rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-linear-to-r ${vatColor} transition-[width] duration-1000 ease-out`}
                style={{ width: `${Math.min((profile.revenueThisYear / vat.major) * 100, 100)}%` }}
              />
              <span
                className="absolute -top-1 h-5 w-px bg-ink-soft"
                style={{ left: `${(vat.base / vat.major) * 100}%` }}
                title={`Seuil de base : ${vat.base.toLocaleString("fr-FR")} €`}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-ink-muted">
              <span>0 €</span>
              <span>seuil {vat.base.toLocaleString("fr-FR")} €</span>
              <span>majoré {vat.major.toLocaleString("fr-FR")} €</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-soft">{vat.message}</p>
            <form className="mt-4 flex gap-2" onSubmit={saveRevenue}>
              <input
                aria-label="Chiffre d'affaires encaissé depuis le 1er janvier"
                className="field h-10 px-3 text-sm"
                inputMode="decimal"
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="CA depuis le 1er janvier"
                value={revenue}
              />
              <button className="btn-ghost h-10 shrink-0 rounded-xl px-3 text-sm font-semibold" type="submit">
                Mettre à jour
              </button>
            </form>
            <Link className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-soft" href="/guides/seuil-tva-micro-entrepreneur" target="_blank">
              Que faire si je dépasse ? <ArrowRight className="size-3.5" />
            </Link>
          </SpotlightCard>
        </Reveal>
      </div>

      {/* Calendrier */}
      <Reveal delay={120}>
        <section className="glass rounded-3xl p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">Les 12 prochains mois</h2>
            <p className="text-sm text-ink-muted">
              {deadlines.filter((d) => done.includes(d.id)).length} / {deadlines.length} faites
            </p>
          </div>
          <div className="mt-6 space-y-8">
            {byMonth.map(([month, items]) => (
              <div className="grid gap-3 sm:grid-cols-[140px_1fr]" key={month}>
                <p className="pt-3 text-sm font-semibold capitalize text-ink-muted">{month}</p>
                <ul className="space-y-2">
                  {items.map((d) => {
                    const isDone = done.includes(d.id);
                    return (
                      <li
                        className={`group flex items-start gap-3 rounded-2xl border p-3.5 transition ${
                          isDone ? "border-white/5 bg-white/[0.015] opacity-60" : "border-white/6 bg-white/[0.03] hover:border-gold/25"
                        }`}
                        key={d.id}
                      >
                        <button
                          aria-label={isDone ? "Marquer comme à faire" : "Marquer comme fait"}
                          className="mt-0.5 shrink-0 text-ink-muted transition hover:text-mint"
                          onClick={() => onToggle(d.id)}
                          type="button"
                        >
                          {isDone ? <CheckCircle2 className="size-5 text-mint" /> : <Circle className="size-5" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className={`font-medium ${isDone ? "line-through" : ""}`}>{d.title}</p>
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_STYLES[d.category]}`}>
                              {CATEGORY_LABELS[d.category]}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-ink-muted">{d.detail}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold">
                            {d.approx ? "~ " : ""}
                            {d.date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                          {d.guide ? (
                            <Link className="text-xs text-gold opacity-0 transition group-hover:opacity-100" href={`/guides/${d.guide}`} target="_blank">
                              Guide
                            </Link>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <p className="flex items-start gap-2 px-1 text-xs leading-5 text-ink-muted">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Calcul indicatif à partir des règles publiées par l&apos;administration (vérifiées le 17 novembre 2026). Quand une
        date tombe un week-end, elle est parfois reportée, mais pas toujours : déclarez quelques jours avant. Ta situation
        est enregistrée sur cet appareil.
      </p>
    </div>
  );
}

/* ───────────────────────── Formulaire de situation ───────────────────────── */

function ProfileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: CopilotProfile | null;
  onSave: (p: CopilotProfile) => void;
  onCancel?: () => void;
}) {
  const [activity, setActivity] = useState<Activity>(initial?.activity ?? "liberal");
  const [periodicity, setPeriodicity] = useState<Periodicity>(initial?.periodicity ?? "mensuelle");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [revenue, setRevenue] = useState(initial ? String(initial.revenueThisYear) : "");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!startDate) return;
    const n = Number(String(revenue || "0").replace(/\s/g, "").replace(",", "."));
    onSave({ activity, periodicity, startDate, revenueThisYear: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0 });
  }

  return (
    <Reveal>
      <form className="glass ring-gradient mx-auto max-w-3xl rounded-3xl p-6 sm:p-9" onSubmit={submit}>
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint/15 text-mint">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold">Ton copilote en 30 secondes</h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              Quatre questions, et Orfeo calcule toutes tes échéances de micro-entrepreneur pour les 12 prochains mois.
            </p>
          </div>
        </div>

        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">1. Ton activité</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(Object.keys(ACTIVITY_LABELS) as Activity[]).map((a) => (
              <label
                className={`cursor-pointer rounded-2xl border p-4 text-sm transition ${
                  activity === a ? "border-gold/60 bg-gold/10 text-ink" : "border-white/8 bg-white/[0.02] text-ink-muted hover:border-white/20"
                }`}
                key={a}
              >
                <input checked={activity === a} className="sr-only" name="activity" onChange={() => setActivity(a)} type="radio" />
                <span className="block font-semibold text-ink">{ACTIVITY_LABELS[a].split(" (")[0]}</span>
                {ACTIVITY_LABELS[a].includes("(") ? (
                  <span className="mt-1 block text-xs">{ACTIVITY_LABELS[a].split(" (")[1].replace(")", "")}</span>
                ) : null}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-7">
          <legend className="text-sm font-semibold">2. Tu déclares ton chiffre d&apos;affaires à l&apos;Urssaf…</legend>
          <div className="mt-3 inline-flex rounded-2xl border border-white/8 bg-white/[0.02] p-1">
            {(["mensuelle", "trimestrielle"] as Periodicity[]).map((p) => (
              <label
                className={`cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold transition ${
                  periodicity === p ? "bg-gold text-canvas" : "text-ink-muted hover:text-ink"
                }`}
                key={p}
              >
                <input checked={periodicity === p} className="sr-only" name="periodicity" onChange={() => setPeriodicity(p)} type="radio" />
                {p === "mensuelle" ? "Chaque mois" : "Chaque trimestre"}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">3. Date de début d&apos;activité</span>
            <input className="field mt-3 h-11 px-3" onChange={(e) => setStartDate(e.target.value)} required type="date" value={startDate} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">4. CA encaissé depuis le 1er janvier</span>
            <input
              className="field mt-3 h-11 px-3"
              inputMode="decimal"
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="ex. 12 000"
              value={revenue}
            />
          </label>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button className="btn-gold flex h-11 items-center gap-2 rounded-xl px-5 font-semibold" type="submit">
            Calculer mes échéances <ArrowRight className="size-4" />
          </button>
          {onCancel ? (
            <button className="btn-ghost h-11 rounded-xl px-5 font-semibold" onClick={onCancel} type="button">
              Annuler
            </button>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-ink-muted">Ces informations restent sur cet appareil. Tu peux les modifier à tout moment.</p>
      </form>
    </Reveal>
  );
}
