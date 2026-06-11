"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Mail,
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
import { BusinessConstellationScene } from "@/components/business-constellation-scene";
import {
  formatCurrency,
  promptTemplates,
  statusStyles,
} from "@/lib/orfeo-data";

type Metric = {
  label: string;
  value: string;
  change: string;
  note: string;
  icon: LucideIcon;
  accent: string;
};

export function DashboardOverview() {
  const { state, generateDocument, toggleTask, addTask, deleteTask } = useAppState();
  const [prompt, setPrompt] = useState("");
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const totalRevenue = useMemo(
    () => state.clients.reduce((sum, client) => sum + client.amount, 0),
    [state.clients],
  );

  const completedTasks = state.tasks.filter((task) => task.done).length;

  const metrics: Metric[] = [
    {
      label: "Revenus suivis",
      value: formatCurrency(totalRevenue),
      change: `${state.stats.signedRevenuePercent}%`,
      note: "du pipeline signé",
      icon: WalletCards,
      accent: "bg-emerald-400/10 text-emerald-300",
    },
    {
      label: "Clients actifs",
      value: String(state.clients.length),
      change: `+${state.stats.newClientsThisWeek}`,
      note: "cette semaine",
      icon: Users,
      accent: "bg-sky-400/10 text-sky-300",
    },
    {
      label: "Documents IA",
      value: String(state.documents.length),
      change: `${state.aiCreditsUsed}/10`,
      note: "générations utilisées",
      icon: FileText,
      accent: "bg-gold/10 text-gold",
    },
    {
      label: "Actions faites",
      value: `${completedTasks}/${state.tasks.length}`,
      change: "focus",
      note: "priorités semaine",
      icon: Zap,
      accent: "bg-rose-400/10 text-rose-300",
    },
  ];

  async function handleAddTask() {
    const cleanedTitle = taskTitle.trim();

    if (!cleanedTitle) {
      return;
    }

    setIsAddingTask(true);

    try {
      await addTask(cleanedTitle);
      setTaskTitle("");
    } finally {
      setIsAddingTask(false);
    }
  }

  async function handleGenerate() {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      return;
    }

    setIsGenerating(true);

    try {
      const document = await generateDocument(cleanedPrompt, "Document IA");
      setLastGeneratedTitle(document.title);
      setPrompt("");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <section className="relative isolate min-h-[560px] overflow-hidden rounded-lg border border-border bg-canvas p-5 text-ink shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:p-7 lg:min-h-[470px]">
        <BusinessConstellationScene />
        <div className="absolute inset-0 z-0 bg-canvas/40" />

        <div className="relative z-10 grid min-h-[500px] gap-6 lg:min-h-[415px] lg:grid-cols-[0.9fr_0.72fr] lg:items-end">
          <div className="max-w-2xl self-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold/10 px-3 py-2 text-sm font-semibold text-ink-soft backdrop-blur">
              <Sparkles className="size-4 text-gold" />
              CRM, documents et relances dans un seul cockpit
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-normal sm:text-5xl lg:text-6xl">
              Pilote ton activité avec une IA qui prépare le travail.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
              Orfeo centralise les clients, les priorités et les documents
              pour transformer les briefs en actions vendables.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-gold px-5 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
                href="/assistant"
              >
                Lancer l&apos;assistant
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft bg-surface/60 px-5 text-sm font-semibold text-ink transition hover:bg-surface-raised"
                href="/clients"
              >
                Voir les clients
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface/80 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-gold">
                  Génération rapide
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                  Crée une relance ou une proposition maintenant.
                </h3>
              </div>
              <Link
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft sm:whitespace-nowrap"
                href="/assistant"
              >
                <Bot className="size-4" />
                Studio IA
              </Link>
            </div>

            <label
              className="mt-5 block text-sm font-semibold text-ink-soft"
              htmlFor="dashboard-prompt"
            >
              Demande rapide
            </label>
            <textarea
              className="mt-3 min-h-36 w-full resize-none rounded-md border border-border bg-canvas-soft p-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
              id="dashboard-prompt"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Exemple : Rédige une proposition commerciale pour un client qui veut refaire son site vitrine."
              value={prompt}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-ink-muted">
                Le document est enregistré dans l&apos;historique.
              </p>
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
                disabled={!prompt.trim() || isGenerating}
                onClick={() => void handleGenerate()}
                type="button"
              >
                <Send className="size-4" />
                {isGenerating ? "Génération..." : "Générer"}
              </button>
            </div>
            {lastGeneratedTitle ? (
              <p className="mt-3 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-sm font-medium text-gold-soft">
                Document créé : {lastGeneratedTitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <section
            className="rounded-lg border border-border bg-surface/70 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-muted">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {metric.value}
                </p>
              </div>
              <div
                className={`grid size-10 place-items-center rounded-md ${metric.accent}`}
              >
                <metric.icon className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              <span className="font-semibold text-gold-soft">
                {metric.change}
              </span>{" "}
              {metric.note}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-border bg-surface/70 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                Pipeline clients
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                Opportunités à suivre
              </h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-border bg-canvas-soft text-ink-muted transition hover:border-gold/40 hover:text-gold"
              href="/clients"
            >
              <Users className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.clients.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-canvas-soft p-5 text-center">
                <p className="text-sm text-ink-muted">
                  Aucun client pour le moment.
                </p>
                <Link
                  className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
                  href="/clients"
                >
                  Ajouter ton premier client
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              state.clients.slice(0, 3).map((client) => (
                <article
                  className="grid gap-3 rounded-lg border border-border bg-canvas-soft p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                  key={client.id}
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-ink">
                      {client.name}
                    </h4>
                    <p className="mt-1 text-sm text-ink-muted">{client.work}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <p className="text-sm font-semibold text-ink">
                      {formatCurrency(client.amount)}
                    </p>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[client.status]}`}
                    >
                      {client.status}
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface/70 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                Focus semaine
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                {state.tasks.length} actions prioritaires
              </h3>
            </div>
            <Sparkles className="size-5 text-gold" />
          </div>

          <div className="mt-5 space-y-3">
            {state.tasks.map((task) => (
              <div
                className="flex w-full items-start gap-3 rounded-lg border border-border bg-canvas-soft p-3"
                key={task.id}
              >
                <button
                  className="flex flex-1 items-start gap-3 text-left"
                  onClick={() => void toggleTask(task.id)}
                  type="button"
                >
                  <CheckCircle2
                    className={`mt-0.5 size-5 shrink-0 ${
                      task.done ? "text-gold" : "text-ink-muted"
                    }`}
                  />
                  <p
                    className={`text-sm leading-6 ${
                      task.done
                        ? "text-ink-muted line-through"
                        : "text-ink-soft"
                    }`}
                  >
                    {task.title}
                  </p>
                </button>
                <button
                  aria-label="Supprimer la tâche"
                  className="shrink-0 text-ink-muted transition hover:text-red-400"
                  onClick={() => void deleteTask(task.id)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {state.tasks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-canvas-soft p-3 text-center text-sm text-ink-muted">
                Aucune action pour le moment.
              </p>
            ) : null}
          </div>

          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void handleAddTask();
            }}
          >
            <input
              className="h-10 flex-1 rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Ajouter une action..."
              value={taskTitle}
            />
            <button
              aria-label="Ajouter la tâche"
              className="grid size-10 shrink-0 place-items-center rounded-md bg-gold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!taskTitle.trim() || isAddingTask}
              type="submit"
            >
              <Plus className="size-4" />
            </button>
          </form>
        </section>
      </div>

      <div className="grid gap-4 pb-8 pt-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-border bg-surface-raised p-4 text-ink shadow-[0_18px_55px_rgba(0,0,0,0.35)] sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Activité
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">7 derniers jours</h3>
            </div>
            <p className="rounded-md bg-gold/10 px-2 py-1 text-xs font-semibold text-gold">
              {state.stats.activityThisWeek} action
              {state.stats.activityThisWeek > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex h-40 items-end gap-2">
            {state.stats.dailyActivity.map((count, index) => {
              const maxActivity = Math.max(...state.stats.dailyActivity, 1);
              const height =
                count > 0 ? Math.max((count / maxActivity) * 100, 12) : 4;

              return (
                <div
                  className="flex h-full flex-1 items-end rounded-md bg-canvas-soft"
                  data-chart-bar="activity"
                  key={index}
                >
                  <div
                    className="w-full rounded-md bg-linear-to-t from-gold-deep to-gold-soft"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface/70 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] backdrop-blur sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                Documents récents
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                Production IA
              </h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-border bg-canvas-soft text-ink-muted transition hover:border-gold/40 hover:text-gold"
              href="/documents"
            >
              <FileText className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.documents.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-canvas-soft p-5 text-center">
                <p className="text-sm text-ink-muted">
                  Aucun document généré pour le moment.
                </p>
                <Link
                  className="mt-3 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft"
                  href="/assistant"
                >
                  Générer ton premier document
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              state.documents.slice(0, 3).map((document) => (
                <article
                  className="flex items-center gap-3 rounded-lg border border-border bg-canvas-soft p-3"
                  key={document.id}
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-md bg-gold/10 text-gold">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-semibold text-ink">
                      {document.title}
                    </h4>
                    <p className="mt-1 text-sm text-ink-muted">
                      {document.type}
                    </p>
                  </div>
                  <p className="hidden text-sm font-medium text-ink-muted sm:block">
                    {document.createdAt}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="pb-8">
        <section className="rounded-lg border border-border bg-surface/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
                Modèles rapides
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                Démarre depuis un cas concret
              </h3>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {promptTemplates.slice(0, 3).map((template) => (
                <button
                  className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-canvas-soft px-3 text-left text-sm font-semibold text-ink-soft transition hover:border-gold/40 hover:bg-gold/5"
                  key={template}
                  onClick={() => setPrompt(template)}
                  type="button"
                >
                  <Mail className="size-4 shrink-0 text-gold" />
                  <span>{template}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
