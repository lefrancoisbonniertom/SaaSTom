"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  FileText,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "@/components/app-state-provider";
import { CountUp, Reveal, Sparkline, SpotlightCard } from "@/components/fx/motion";
import { OrfeoScene } from "@/components/three/orfeo-scene";
import { useCopilot } from "@/lib/copilot-store";
import { computeDeadlines, daysUntil } from "@/lib/copilot";
import { formatCurrency, promptTemplates, type ClientStatus } from "@/lib/orfeo-data";

const STATUS_ORDER: ClientStatus[] = ["Prospect", "À relancer", "En cours", "Signé"];
const STATUS_COLORS: Record<ClientStatus, string> = {
  Prospect: "bg-ink-muted",
  "À relancer": "bg-coral",
  "En cours": "bg-sky",
  Signé: "bg-mint",
};
const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function DashboardOverview() {
  const { state, isLoading, generateDocument, toggleTask, addTask, deleteTask } = useAppState();
  const { data: session } = useSession();
  const { profile, done } = useCopilot();
  const [prompt, setPrompt] = useState("");
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const firstName = (session?.user?.name || session?.user?.email?.split("@")[0] || "").split(" ")[0];
  const hour = new Date().getHours();
  const hello = hour < 5 ? "Bonne nuit" : hour < 18 ? "Bonjour" : "Bonsoir";
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  const totalRevenue = useMemo(() => state.clients.reduce((sum, c) => sum + c.amount, 0), [state.clients]);
  const completedTasks = state.tasks.filter((t) => t.done).length;
  const byStatus = useMemo(
    () =>
      STATUS_ORDER.map((status) => {
        const list = state.clients.filter((c) => c.status === status);
        return { status, count: list.length, amount: list.reduce((s, c) => s + c.amount, 0) };
      }),
    [state.clients],
  );
  const nextDeadline = useMemo(() => {
    if (!profile) return null;
    return computeDeadlines(profile).find((d) => !done.includes(d.id)) ?? null;
  }, [profile, done]);

  const metrics: Array<{ label: string; value: number; format?: (n: number) => string; note: string; icon: LucideIcon; tone: string }> = [
    {
      label: "Revenus suivis",
      value: totalRevenue,
      format: (n) => formatCurrency(n),
      note: `${state.stats.signedRevenuePercent} % du pipeline signé`,
      icon: WalletCards,
      tone: "text-mint bg-mint/12",
    },
    {
      label: "Clients",
      value: state.clients.length,
      note: `+${state.stats.newClientsThisWeek} cette semaine`,
      icon: Users,
      tone: "text-sky bg-sky/12",
    },
    {
      label: "Documents IA",
      value: state.documents.length,
      note: `${state.aiCreditsUsed} génération${state.aiCreditsUsed > 1 ? "s" : ""} utilisée${state.aiCreditsUsed > 1 ? "s" : ""}`,
      icon: FileText,
      tone: "text-gold bg-gold/12",
    },
    {
      label: "Actions faites",
      value: completedTasks,
      format: (n) => `${Math.round(n)}/${state.tasks.length}`,
      note: "priorités de la semaine",
      icon: Zap,
      tone: "text-coral bg-coral/12",
    },
  ];

  async function handleAddTask() {
    const cleaned = taskTitle.trim();
    if (!cleaned) return;
    setIsAddingTask(true);
    try {
      await addTask(cleaned);
      setTaskTitle("");
    } finally {
      setIsAddingTask(false);
    }
  }

  async function handleGenerate() {
    const cleaned = prompt.trim();
    if (!cleaned) return;
    setIsGenerating(true);
    setGenerateError("");
    try {
      const document = await generateDocument(cleaned, "Document IA");
      setLastGeneratedTitle(document.title);
      setPrompt("");
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "La génération a échoué.");
    } finally {
      setIsGenerating(false);
    }
  }

  const maxActivity = Math.max(...state.stats.dailyActivity, 1);

  return (
    <div className="space-y-5">
      {/* ───── Accueil ───── */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm capitalize text-ink-muted">{today}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {hello}
            {firstName ? `, ${firstName}` : ""} <span className="inline-block origin-[70%_70%] animate-[orfeo-float_3s_ease-in-out_infinite]">👋</span>
          </h1>
        </div>
        <p className="text-sm text-ink-muted">Voici où en est ton activité aujourd&apos;hui.</p>
      </header>

      {/* ───── Studio IA + copilote ───── */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Reveal>
          <section className="glass beam noise relative isolate h-full overflow-hidden rounded-3xl p-6 sm:p-7">
            <OrfeoScene className="absolute inset-y-0 right-[-18%] -z-10 hidden w-[75%] opacity-80 md:block" variant="compact" />
            <div className="absolute inset-0 -z-10 hidden bg-linear-to-r from-surface via-surface/85 to-transparent md:block" />
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-sm font-semibold text-gold">
                <Sparkles className="size-4" /> Studio IA
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">Que veux-tu envoyer aujourd&apos;hui ?</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {promptTemplates.slice(0, 3).map((t) => (
                  <button
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-left text-xs font-medium text-ink-soft transition hover:border-gold/40 hover:text-ink"
                    key={t}
                    onClick={() => setPrompt(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative mt-4">
                <textarea
                  aria-label="Demande à l'assistant"
                  className="field min-h-32 resize-none p-4 pr-14 text-sm leading-6"
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void handleGenerate();
                  }}
                  placeholder="Ex. : rédige une proposition pour un client qui veut refaire son site vitrine…"
                  value={prompt}
                />
                <button
                  aria-label="Générer le document"
                  className="btn-gold absolute bottom-3 right-3 grid size-10 place-items-center rounded-xl disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={() => void handleGenerate()}
                  type="button"
                >
                  {isGenerating ? <span className="size-4 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" /> : <Send className="size-4" />}
                </button>
              </div>
              {lastGeneratedTitle ? (
                <Link
                  className="mt-3 flex items-center gap-2 rounded-xl border border-mint/25 bg-mint/10 px-3 py-2 text-sm text-mint"
                  href="/documents"
                >
                  <CheckCircle2 className="size-4" /> Document créé : {lastGeneratedTitle} <ArrowRight className="ml-auto size-4" />
                </Link>
              ) : null}
              {generateError ? <p className="mt-3 text-sm text-coral">{generateError}</p> : null}
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <Link className="group block h-full" href="/echeances">
            <SpotlightCard className="glass h-full rounded-3xl p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-mint">
                  <CalendarClock className="size-4" /> Copilote administratif
                </p>
                <ArrowUpRight className="size-5 text-ink-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
              {nextDeadline ? (
                <>
                  <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink-muted">Prochaine échéance</p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <CountUp className="font-display text-6xl font-semibold text-shine" value={Math.max(daysUntil(nextDeadline.date), 0)} />
                    <span className="text-ink-muted">jours</span>
                  </p>
                  <p className="mt-3 font-semibold">{nextDeadline.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {nextDeadline.approx ? "vers le " : "avant le "}
                    {nextDeadline.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight">Ne rate plus aucune échéance.</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Urssaf, CFE, impôts, TVA : réponds à 4 questions et Orfeo calcule tout ton calendrier.
                  </p>
                  <span className="btn-gold mt-5 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
                    Activer le copilote <ArrowRight className="size-4" />
                  </span>
                </>
              )}
            </SpotlightCard>
          </Link>
        </Reveal>
      </div>

      {/* ───── Indicateurs ───── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <Reveal delay={i * 70} key={m.label}>
            <SpotlightCard className="glass h-full rounded-3xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-ink-muted">{m.label}</p>
                <span className={`grid size-9 place-items-center rounded-xl ${m.tone}`}>
                  <m.icon className="size-[18px]" />
                </span>
              </div>
              {isLoading ? (
                <div className="skeleton mt-3 h-8 w-24 rounded-lg" />
              ) : (
                <CountUp className="mt-2 block text-2xl font-semibold tracking-tight sm:text-3xl" format={m.format} value={m.value} />
              )}
              <p className="mt-2 text-xs text-ink-muted">{m.note}</p>
              {i === 0 ? <Sparkline className="mt-3 h-8 w-full" data={state.stats.dailyActivity} stroke="#5fe3b0" /> : null}
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* ───── Pipeline + tâches ───── */}
      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <section className="glass h-full rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Pipeline</h2>
              <Link className="flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-soft" href="/clients">
                Tous les clients <ArrowRight className="size-4" />
              </Link>
            </div>
            {state.clients.length ? (
              <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-white/5">
                {byStatus.map((s) =>
                  s.count ? (
                    <div
                      className={`${STATUS_COLORS[s.status]} h-full transition-[width] duration-1000`}
                      key={s.status}
                      style={{ width: `${(s.count / state.clients.length) * 100}%` }}
                      title={`${s.status} : ${s.count}`}
                    />
                  ) : null,
                )}
              </div>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {byStatus.map((s) => (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3" key={s.status}>
                  <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <span className={`size-2 rounded-full ${STATUS_COLORS[s.status]}`} /> {s.status}
                  </p>
                  <p className="mt-1 text-xl font-semibold">{s.count}</p>
                  <p className="text-xs text-ink-muted">{formatCurrency(s.amount)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {state.clients.length === 0 ? (
                <EmptyState cta="Ajouter mon premier client" href="/clients" text="Aucun client pour le moment." />
              ) : (
                state.clients.slice(0, 4).map((client) => (
                  <Link
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-gold/25 hover:bg-white/[0.04]"
                    href={`/clients?q=${encodeURIComponent(client.name)}`}
                    key={client.id}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 text-sm font-semibold">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{client.name}</span>
                      <span className="block truncate text-xs text-ink-muted">{client.nextAction || client.work}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-sm font-semibold">{formatCurrency(client.amount)}</span>
                      <span className="flex items-center justify-end gap-1.5 text-xs text-ink-muted">
                        <span className={`size-1.5 rounded-full ${STATUS_COLORS[client.status]}`} /> {client.status}
                      </span>
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="glass h-full rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Focus de la semaine</h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-ink-muted">
                {completedTasks}/{state.tasks.length}
              </span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-linear-to-r from-gold to-mint transition-[width] duration-700"
                style={{ width: `${state.tasks.length ? (completedTasks / state.tasks.length) * 100 : 0}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {state.tasks.map((task) => (
                <li className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3" key={task.id}>
                  <button className="flex flex-1 items-start gap-3 text-left" onClick={() => void toggleTask(task.id)} type="button">
                    <CheckCircle2 className={`mt-0.5 size-5 shrink-0 transition ${task.done ? "scale-110 text-mint" : "text-ink-muted"}`} />
                    <span className={`text-sm leading-6 ${task.done ? "text-ink-muted line-through" : "text-ink-soft"}`}>{task.title}</span>
                  </button>
                  <button
                    aria-label="Supprimer la tâche"
                    className="shrink-0 text-ink-muted opacity-0 transition hover:text-coral group-hover:opacity-100 focus:opacity-100"
                    onClick={() => void deleteTask(task.id)}
                    type="button"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {state.tasks.length === 0 ? (
                <li className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-sm text-ink-muted">Aucune action pour le moment.</li>
              ) : null}
            </ul>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void handleAddTask();
              }}
            >
              <input className="field h-10 px-3 text-sm" onChange={(e) => setTaskTitle(e.target.value)} placeholder="Ajouter une action…" value={taskTitle} />
              <button
                aria-label="Ajouter la tâche"
                className="btn-gold grid size-10 shrink-0 place-items-center rounded-xl disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!taskTitle.trim() || isAddingTask}
                type="submit"
              >
                <Plus className="size-4" />
              </button>
            </form>
          </section>
        </Reveal>
      </div>

      {/* ───── Activité + documents ───── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <section className="glass h-full rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Activité · 7 jours</h2>
              <span className="rounded-full bg-gold/12 px-2.5 py-1 text-xs font-semibold text-gold">
                {state.stats.activityThisWeek} action{state.stats.activityThisWeek > 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-6 flex h-44 items-end gap-2.5">
              {state.stats.dailyActivity.map((count, index) => {
                const height = count > 0 ? Math.max((count / maxActivity) * 100, 10) : 4;
                return (
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={index}>
                    <div className="relative flex w-full flex-1 items-end overflow-hidden rounded-xl bg-white/[0.03]">
                      <div
                        className="w-full origin-bottom rounded-xl bg-linear-to-t from-gold-deep via-gold to-gold-soft shadow-[0_0_24px_-4px_rgba(214,178,110,0.6)]"
                        style={{ height: `${height}%`, animation: `orfeo-rise 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms both` }}
                        title={`${count} action${count > 1 ? "s" : ""}`}
                      />
                    </div>
                    <span className="text-[11px] text-ink-muted">{DAYS[((new Date().getDay() + 6) % 7 - (6 - index) + 14) % 7]}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        <Reveal delay={80}>
          <section className="glass h-full rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Documents récents</h2>
              <Link className="flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-soft" href="/documents">
                Tout voir <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {state.documents.length === 0 ? (
                <EmptyState cta="Générer mon premier document" href="/assistant" text="Aucun document pour le moment." />
              ) : (
                state.documents.slice(0, 4).map((d) => (
                  <Link
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-gold/25 hover:bg-white/[0.04]"
                    href="/documents"
                    key={d.id}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold">
                      <FileText className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{d.title}</span>
                      <span className="block truncate text-xs text-ink-muted">
                        {d.type}
                        {d.clientName ? ` · ${d.clientName}` : ""}
                      </span>
                    </span>
                    <span className="hidden text-xs text-ink-muted sm:block">{d.createdAt}</span>
                  </Link>
                ))
              )}
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

function EmptyState({ text, cta, href }: { text: string; cta: string; href: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
      <p className="text-sm text-ink-muted">{text}</p>
      <Link className="btn-gold mt-3 inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold" href={href}>
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
