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
} from "@/lib/saastom-data";

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
      accent: "bg-[#dff7e7] text-[#17613b]",
    },
    {
      label: "Clients actifs",
      value: String(state.clients.length),
      change: `+${state.stats.newClientsThisWeek}`,
      note: "cette semaine",
      icon: Users,
      accent: "bg-[#def3ff] text-[#155a78]",
    },
    {
      label: "Documents IA",
      value: String(state.documents.length),
      change: `${state.aiCreditsUsed}/10`,
      note: "générations utilisées",
      icon: FileText,
      accent: "bg-[#fff0d0] text-[#84600e]",
    },
    {
      label: "Actions faites",
      value: `${completedTasks}/${state.tasks.length}`,
      change: "focus",
      note: "priorités semaine",
      icon: Zap,
      accent: "bg-[#ffe3db] text-[#9f3b20]",
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
      <section className="relative isolate min-h-[560px] overflow-hidden rounded-lg border border-[#1d2b24] bg-[#0c1411] p-5 text-white shadow-[0_28px_80px_rgba(17,27,23,0.24)] sm:p-7 lg:min-h-[470px]">
        <BusinessConstellationScene />
        <div className="absolute inset-0 z-0 bg-[#0c1411]/40" />

        <div className="relative z-10 grid min-h-[500px] gap-6 lg:min-h-[415px] lg:grid-cols-[0.9fr_0.72fr] lg:items-end">
          <div className="max-w-2xl self-center">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-sm font-semibold text-[#dceee4] backdrop-blur">
              <Sparkles className="size-4 text-[#b9e885]" />
              CRM, documents et relances dans un seul cockpit
            </div>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-normal sm:text-5xl lg:text-6xl">
              Pilote ton activité avec une IA qui prépare le travail.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#c2d0c9]">
              SaaSTom centralise les clients, les priorités et les documents
              pour transformer les briefs en actions vendables.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-5 text-sm font-semibold text-white transition hover:bg-[#f0714f]"
                href="/assistant"
              >
                Lancer l&apos;assistant
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-white/[0.14] bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
                href="/clients"
              >
                Voir les clients
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.12] bg-[#101c17]/[0.82] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#b9e885]">
                  Génération rapide
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  Crée une relance ou une proposition maintenant.
                </h3>
              </div>
              <Link
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-[#111b17] transition hover:bg-[#eef4ea] sm:whitespace-nowrap"
                href="/assistant"
              >
                <Bot className="size-4" />
                Studio IA
              </Link>
            </div>

            <label
              className="mt-5 block text-sm font-semibold text-[#e7f1ec]"
              htmlFor="dashboard-prompt"
            >
              Demande rapide
            </label>
            <textarea
              className="mt-3 min-h-36 w-full resize-none rounded-md border border-white/[0.12] bg-white/10 p-3 text-sm leading-6 text-white outline-none transition placeholder:text-[#91a39a] focus:border-[#b9e885]"
              id="dashboard-prompt"
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Exemple : Rédige une proposition commerciale pour un client qui veut refaire son site vitrine."
              value={prompt}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-[#a9bbb2]">
                Le document est enregistré dans l&apos;historique.
              </p>
              <button
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#b9e885] px-4 text-sm font-semibold text-[#111b17] transition hover:bg-[#cbf49b] disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
                disabled={!prompt.trim() || isGenerating}
                onClick={() => void handleGenerate()}
                type="button"
              >
                <Send className="size-4" />
                {isGenerating ? "Génération..." : "Générer"}
              </button>
            </div>
            {lastGeneratedTitle ? (
              <p className="mt-3 rounded-md border border-[#b9e885]/[0.35] bg-[#b9e885]/[0.12] px-3 py-2 text-sm font-medium text-[#e9ffd9]">
                Document créé : {lastGeneratedTitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <p className="mt-4 text-sm text-[#62736b]">
              <span className="font-semibold text-[#246b48]">
                {metric.change}
              </span>{" "}
              {metric.note}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
                Pipeline clients
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
                Opportunités à suivre
              </h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-[#d8e3dc] bg-white text-[#526052] transition hover:border-[#adc5b8] hover:text-[#17201b]"
              href="/clients"
            >
              <Users className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.clients.slice(0, 3).map((client) => (
              <article
                className="grid gap-3 rounded-lg border border-[#d8e3dc] bg-[#fbfdf9] p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                key={client.id}
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-[#111b17]">
                    {client.name}
                  </h4>
                  <p className="mt-1 text-sm text-[#62736b]">{client.work}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <p className="text-sm font-semibold text-[#111b17]">
                    {formatCurrency(client.amount)}
                  </p>
                  <span
                    className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[client.status]}`}
                  >
                    {client.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
                Focus semaine
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
                {state.tasks.length} actions prioritaires
              </h3>
            </div>
            <Sparkles className="size-5 text-[#e65f3c]" />
          </div>

          <div className="mt-5 space-y-3">
            {state.tasks.map((task) => (
              <div
                className="flex w-full items-start gap-3 rounded-lg border border-[#d8e3dc] bg-[#fbfdf9] p-3"
                key={task.id}
              >
                <button
                  className="flex flex-1 items-start gap-3 text-left"
                  onClick={() => void toggleTask(task.id)}
                  type="button"
                >
                  <CheckCircle2
                    className={`mt-0.5 size-5 shrink-0 ${
                      task.done ? "text-emerald-700" : "text-[#91a39a]"
                    }`}
                  />
                  <p
                    className={`text-sm leading-6 ${
                      task.done
                        ? "text-[#62736b] line-through"
                        : "text-[#26332d]"
                    }`}
                  >
                    {task.title}
                  </p>
                </button>
                <button
                  aria-label="Supprimer la tâche"
                  className="shrink-0 text-[#91a39a] transition hover:text-[#c0432a]"
                  onClick={() => void deleteTask(task.id)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {state.tasks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#d8e3dc] bg-[#fbfdf9] p-3 text-center text-sm text-[#62736b]">
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
              className="h-10 flex-1 rounded-md border border-[#d8e3dc] bg-white px-3 text-sm outline-none focus:border-[#4f6f57]"
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Ajouter une action..."
              value={taskTitle}
            />
            <button
              aria-label="Ajouter la tâche"
              className="grid size-10 shrink-0 place-items-center rounded-md bg-[#17201b] text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!taskTitle.trim() || isAddingTask}
              type="submit"
            >
              <Plus className="size-4" />
            </button>
          </form>
        </section>
      </div>

      <div className="grid gap-4 pb-8 pt-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-white/75 bg-[#111b17] p-4 text-white shadow-[0_18px_55px_rgba(27,43,37,0.14)] sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9fb6aa]">
                Activité
              </p>
              <h3 className="mt-1 text-xl font-semibold">7 derniers jours</h3>
            </div>
            <p className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-[#b9e885]">
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
                  className="flex h-full flex-1 items-end rounded-md bg-white/[0.08]"
                  data-chart-bar="activity"
                  key={index}
                >
                  <div
                    className="w-full rounded-md bg-[#58c7ff]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-white/75 bg-white/[0.78] p-4 shadow-[0_18px_55px_rgba(27,43,37,0.08)] backdrop-blur sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
                Documents récents
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
                Production IA
              </h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-[#d8e3dc] bg-white text-[#526052] transition hover:border-[#adc5b8] hover:text-[#17201b]"
              href="/documents"
            >
              <FileText className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.documents.slice(0, 3).map((document) => (
              <article
                className="flex items-center gap-3 rounded-lg border border-[#d8e3dc] bg-[#fbfdf9] p-3"
                key={document.id}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef8f8] text-[#155a78]">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold text-[#111b17]">
                    {document.title}
                  </h4>
                  <p className="mt-1 text-sm text-[#62736b]">
                    {document.type}
                  </p>
                </div>
                <p className="hidden text-sm font-medium text-[#62736b] sm:block">
                  {document.createdAt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="pb-8">
        <section className="rounded-lg border border-[#d8e3dc] bg-[#fbfdf9] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526b60]">
                Modèles rapides
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#111b17]">
                Démarre depuis un cas concret
              </h3>
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              {promptTemplates.slice(0, 3).map((template) => (
                <button
                  className="flex min-h-12 items-center gap-3 rounded-lg border border-[#d8e3dc] bg-white px-3 text-left text-sm font-semibold text-[#26332d] transition hover:border-[#adc5b8] hover:bg-[#f6faf5]"
                  key={template}
                  onClick={() => setPrompt(template)}
                  type="button"
                >
                  <Mail className="size-4 shrink-0 text-[#e65f3c]" />
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
