"use client";

import Link from "next/link";
import {
  Bot,
  CheckCircle2,
  FileText,
  Mail,
  Send,
  Sparkles,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "@/components/app-state-provider";
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
  const { state, generateDocument, toggleTask } = useAppState();
  const [prompt, setPrompt] = useState("");
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totalRevenue = useMemo(
    () => state.clients.reduce((sum, client) => sum + client.amount, 0),
    [state.clients],
  );

  const metrics: Metric[] = [
    {
      label: "Revenus suivis",
      value: formatCurrency(totalRevenue),
      change: "+18%",
      note: "sur 30 jours",
      icon: WalletCards,
      accent: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "Clients actifs",
      value: String(state.clients.length),
      change: "+5",
      note: "nouveaux contacts",
      icon: Users,
      accent: "bg-sky-100 text-sky-800",
    },
    {
      label: "Documents IA",
      value: String(state.documents.length),
      change: `${state.aiCreditsUsed}/10`,
      note: "generations gratuites",
      icon: FileText,
      accent: "bg-amber-100 text-amber-800",
    },
    {
      label: "Temps gagne",
      value: "14 h",
      change: "est.",
      note: "automatisations",
      icon: Zap,
      accent: "bg-rose-100 text-rose-800",
    },
  ];

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <section
            className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)]"
            key={metric.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#66705f]">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              </div>
              <div
                className={`grid size-10 place-items-center rounded-md ${metric.accent}`}
              >
                <metric.icon className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-[#66705f]">
              <span className="font-semibold text-[#246b48]">
                {metric.change}
              </span>{" "}
              {metric.note}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#66705f]">
                Assistant IA
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Cree un document ou une relance en quelques secondes.
              </h3>
            </div>
            <Link
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] sm:whitespace-nowrap"
              href="/assistant"
            >
              <Bot className="size-4" />
              Ouvrir l&apos;assistant
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-4">
              <label
                className="text-sm font-semibold text-[#384438]"
                htmlFor="dashboard-prompt"
              >
                Demande rapide
              </label>
              <textarea
                className="mt-3 min-h-40 w-full resize-none rounded-md border border-[#dfe4d8] bg-white p-3 text-sm leading-6 outline-none transition placeholder:text-[#8c9785] focus:border-[#4f6f57]"
                id="dashboard-prompt"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Exemple : Redige une proposition commerciale pour un client qui veut refaire son site vitrine."
                value={prompt}
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-medium text-[#66705f]">
                  Mode demo : le document est ajoute a l&apos;historique.
                </p>
                <button
                  className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-4 text-sm font-semibold text-white transition hover:bg-[#c94f32] disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
                  disabled={!prompt.trim() || isGenerating}
                  onClick={() => void handleGenerate()}
                  type="button"
                >
                  <Send className="size-4" />
                  {isGenerating ? "Generation..." : "Generer"}
                </button>
              </div>
              {lastGeneratedTitle ? (
                <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                  Document cree : {lastGeneratedTitle}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {promptTemplates.slice(0, 3).map((template) => (
                <button
                  className="flex w-full items-center gap-3 rounded-lg border border-[#dfe4d8] bg-white p-3 text-left text-sm font-medium text-[#384438] transition hover:border-[#b9c4ad] hover:bg-[#fbfcf8]"
                  key={template}
                  onClick={() => setPrompt(template)}
                  type="button"
                >
                  <Mail className="size-4 shrink-0 text-[#e65f3c]" />
                  <span>{template}</span>
                </button>
              ))}
              <div className="rounded-lg border border-[#dfe4d8] bg-[#f3f7ec] p-4">
                <p className="text-sm font-semibold text-[#384438]">
                  Prochaine automatisation
                </p>
                <p className="mt-2 text-sm leading-6 text-[#66705f]">
                  Detecter les factures en retard et proposer une relance
                  adaptee au ton du client.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#66705f]">
                Focus semaine
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {state.tasks.length} actions prioritaires
              </h3>
            </div>
            <Sparkles className="size-5 text-[#4f6f57]" />
          </div>

          <div className="mt-5 space-y-3">
            {state.tasks.map((task) => (
              <button
                className="flex w-full items-start gap-3 rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-3 text-left transition hover:border-[#b9c4ad]"
                key={task.id}
                onClick={() => void toggleTask(task.id)}
                type="button"
              >
                <CheckCircle2
                  className={`mt-0.5 size-5 shrink-0 ${
                    task.done ? "text-emerald-700" : "text-[#8c9785]"
                  }`}
                />
                <p
                  className={`text-sm leading-6 ${
                    task.done
                      ? "text-[#66705f] line-through"
                      : "text-[#384438]"
                  }`}
                >
                  {task.title}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Activite</p>
              <p className="text-xs font-medium text-[#66705f]">7 jours</p>
            </div>
            <div className="flex h-32 items-end gap-2">
              {[44, 68, 38, 82, 56, 74, 92].map((height, index) => (
                <div
                  className="flex h-full flex-1 items-end rounded-md bg-[#eef2ea]"
                  data-chart-bar="activity"
                  key={`${height}-${index}`}
                >
                  <div
                    className="w-full rounded-md bg-[#4f6f57]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 pb-8 pt-4 xl:grid-cols-2">
        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#66705f]">
                Pipeline clients
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Opportunites a suivre
              </h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-[#dfe4d8] bg-white text-[#526052] transition hover:border-[#b9c4ad] hover:text-[#17201b]"
              href="/clients"
            >
              <Users className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.clients.slice(0, 3).map((client) => (
              <article
                className="grid gap-3 rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-3 sm:grid-cols-[1fr_auto] sm:items-center"
                key={client.id}
              >
                <div className="min-w-0">
                  <h4 className="font-semibold">{client.name}</h4>
                  <p className="mt-1 text-sm text-[#66705f]">{client.work}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <p className="text-sm font-semibold">
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

        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#66705f]">
                Documents recents
              </p>
              <h3 className="mt-1 text-xl font-semibold">Production IA</h3>
            </div>
            <Link
              className="grid size-10 place-items-center rounded-md border border-[#dfe4d8] bg-white text-[#526052] transition hover:border-[#b9c4ad] hover:text-[#17201b]"
              href="/documents"
            >
              <FileText className="size-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {state.documents.slice(0, 3).map((document) => (
              <article
                className="flex items-center gap-3 rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-3"
                key={document.id}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-white text-[#4f6f57]">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold">{document.title}</h4>
                  <p className="mt-1 text-sm text-[#66705f]">
                    {document.type}
                  </p>
                </div>
                <p className="hidden text-sm font-medium text-[#66705f] sm:block">
                  {document.createdAt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
