"use client";

import { AlertCircle, Bot, FileText, MessageSquareText, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-state-provider";
import { promptTemplates, type DocumentRecord } from "@/lib/saastom-data";

const FREE_PLAN_LIMIT = 10;

export function AssistantWorkspace() {
  const { state, generateDocument } = useAppState();
  const [prompt, setPrompt] = useState(promptTemplates[0]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [lastDocument, setLastDocument] = useState<DocumentRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const creditsLeft = FREE_PLAN_LIMIT - state.aiCreditsUsed;
  const limitReached = state.aiCreditsUsed >= FREE_PLAN_LIMIT;

  async function handleGenerate() {
    const cleanedPrompt = prompt.trim();
    if (!cleanedPrompt) return;

    setIsGenerating(true);
    setGenError(null);

    try {
      const document = await generateDocument(
        cleanedPrompt,
        "Génération IA",
        selectedClientId || undefined,
      );
      setLastDocument(document);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
      <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-[#17201b] text-white">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#66705f]">
              Atelier de génération
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              Donne un brief, SaaSTom prépare une première version.
            </h3>
          </div>
        </div>

        <label
          className="mt-6 block text-sm font-semibold text-[#384438]"
          htmlFor="assistant-client"
        >
          Client concerné (optionnel)
        </label>
        <select
          className="mt-3 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57] disabled:opacity-50"
          disabled={limitReached}
          id="assistant-client"
          onChange={(event) => setSelectedClientId(event.target.value)}
          value={selectedClientId}
        >
          <option value="">Aucun client</option>
          {state.clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <label
          className="mt-4 block text-sm font-semibold text-[#384438]"
          htmlFor="assistant-prompt"
        >
          Brief
        </label>
        <textarea
          className="mt-3 min-h-72 w-full resize-none rounded-md border border-[#dfe4d8] bg-[#fbfcf8] p-3 text-sm leading-6 outline-none transition placeholder:text-[#8c9785] focus:border-[#4f6f57] disabled:opacity-50"
          disabled={limitReached}
          id="assistant-prompt"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Exemple : Écris une relance polie pour un client qui n'a pas encore réglé sa facture."
          value={prompt}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm ${limitReached ? "font-semibold text-red-600" : "text-[#66705f]"}`}>
            {limitReached
              ? "Limite atteinte — passez au plan Pro"
              : `${state.aiCreditsUsed}/${FREE_PLAN_LIMIT} générations gratuites utilisées (${creditsLeft} restante${creditsLeft > 1 ? "s" : ""})`}
          </p>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#e65f3c] px-4 text-sm font-semibold text-white transition hover:bg-[#c94f32] disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
            disabled={!prompt.trim() || isGenerating || limitReached}
            onClick={() => void handleGenerate()}
            type="button"
          >
            <Send className="size-4" />
            {isGenerating ? "Génération..." : "Générer et enregistrer"}
          </button>
        </div>

        {genError ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Génération impossible
              </p>
              <p className="mt-1 text-sm text-red-600">{genError}</p>
            </div>
          </div>
        ) : null}

        {lastDocument && !genError ? (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
              <Sparkles className="size-4" />
              Document ajouté à l&apos;historique
            </div>
            <p className="mt-2 text-sm text-emerald-800">{lastDocument.title}</p>
            {lastDocument.clientName ? (
              <p className="mt-1 text-xs font-medium text-emerald-700">
                Lié à {lastDocument.clientName}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <aside className="space-y-4">
        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <p className="text-sm font-medium text-[#66705f]">Modèles rapides</p>
          <div className="mt-4 space-y-3">
            {promptTemplates.map((template) => (
              <button
                className="flex w-full items-center gap-3 rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-3 text-left text-sm font-medium text-[#384438] transition hover:border-[#b9c4ad] disabled:opacity-40"
                disabled={limitReached}
                key={template}
                onClick={() => setPrompt(template)}
                type="button"
              >
                <MessageSquareText className="size-4 shrink-0 text-[#e65f3c]" />
                {template}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-[#4f6f57]" />
            <p className="text-sm font-semibold">Dernier résultat</p>
          </div>
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-[#dfe4d8] bg-[#fbfcf8] p-3 text-sm leading-6 text-[#384438]">
            {lastDocument?.content ??
              "Lance une génération pour voir ici le document créé par SaaSTom."}
          </pre>
        </section>
      </aside>
    </div>
  );
}
