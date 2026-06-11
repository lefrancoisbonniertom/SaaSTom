"use client";

import { AlertCircle, Bot, FileText, MessageSquareText, Save, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-state-provider";
import { promptTemplates, type DocumentRecord } from "@/lib/saastom-data";

const FREE_PLAN_LIMIT = 10;

export function AssistantWorkspace() {
  const { state, generateDocument, updateDocument } = useAppState();
  const [prompt, setPrompt] = useState(promptTemplates[0]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [lastDocument, setLastDocument] = useState<DocumentRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedDocumentId, setEditedDocumentId] = useState<string | undefined>(undefined);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (lastDocument?.id !== editedDocumentId) {
    setEditedDocumentId(lastDocument?.id);
    setEditedContent(lastDocument?.content ?? "");
    setSaveError(null);
    setSaveSuccess(false);
  }

  const isContentDirty = lastDocument
    ? editedContent !== lastDocument.content
    : false;

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

  async function handleSaveContent() {
    if (!lastDocument) {
      return;
    }

    setIsSavingContent(true);
    setSaveError(null);

    try {
      await updateDocument(lastDocument.id, { content: editedContent });
      setLastDocument({ ...lastDocument, content: editedContent });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsSavingContent(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
      <section className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-gold text-canvas">
            <Bot className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink-muted">
              Atelier de génération
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">
              Donne un brief, SaaSTom prépare une première version.
            </h3>
          </div>
        </div>

        <label
          className="mt-6 block text-sm font-semibold text-ink"
          htmlFor="assistant-client"
        >
          Client concerné (optionnel)
        </label>
        <select
          className="mt-3 h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
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
          className="mt-4 block text-sm font-semibold text-ink"
          htmlFor="assistant-prompt"
        >
          Brief
        </label>
        <textarea
          className="mt-3 min-h-72 w-full resize-none rounded-md border border-border bg-canvas-soft p-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:opacity-50"
          disabled={limitReached}
          id="assistant-prompt"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Exemple : Écris une relance polie pour un client qui n'a pas encore réglé sa facture."
          value={prompt}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm ${limitReached ? "font-semibold text-red-400" : "text-ink-muted"}`}>
            {limitReached
              ? "Limite atteinte — passez au plan Pro"
              : `${state.aiCreditsUsed}/${FREE_PLAN_LIMIT} générations gratuites utilisées (${creditsLeft} restante${creditsLeft > 1 ? "s" : ""})`}
          </p>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50 sm:whitespace-nowrap"
            disabled={!prompt.trim() || isGenerating || limitReached}
            onClick={() => void handleGenerate()}
            type="button"
          >
            <Send className="size-4" />
            {isGenerating ? "Génération..." : "Générer et enregistrer"}
          </button>
        </div>

        {genError ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Génération impossible
              </p>
              <p className="mt-1 text-sm text-red-400">{genError}</p>
            </div>
          </div>
        ) : null}

        {lastDocument && !genError ? (
          <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Sparkles className="size-4" />
              Document ajouté à l&apos;historique
            </div>
            <p className="mt-2 text-sm text-emerald-200">{lastDocument.title}</p>
            {lastDocument.clientName ? (
              <p className="mt-1 text-xs font-medium text-emerald-400">
                Lié à {lastDocument.clientName}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      <aside className="space-y-4">
        <section className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
          <p className="text-sm font-medium text-ink-muted">Modèles rapides</p>
          <div className="mt-4 space-y-3">
            {promptTemplates.map((template) => (
              <button
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-canvas-soft p-3 text-left text-sm font-medium text-ink-soft transition hover:border-gold/40 hover:bg-gold/5 disabled:opacity-40"
                disabled={limitReached}
                key={template}
                onClick={() => setPrompt(template)}
                type="button"
              >
                <MessageSquareText className="size-4 shrink-0 text-gold" />
                {template}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-gold" />
            <p className="text-sm font-semibold text-ink">Dernier résultat</p>
          </div>
          {lastDocument ? (
            <>
              <textarea
                className="mt-4 min-h-72 w-full resize-y rounded-md border border-border bg-canvas-soft p-3 text-sm leading-6 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                onChange={(event) => setEditedContent(event.target.value)}
                value={editedContent}
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className={`text-xs font-medium ${
                    saveError
                      ? "text-red-400"
                      : saveSuccess
                        ? "text-sage"
                        : "text-ink-muted"
                  }`}
                >
                  {saveError
                    ? saveError
                    : saveSuccess
                      ? "Modifications enregistrées."
                      : isContentDirty
                        ? "Modifications non enregistrées."
                        : "Tu peux modifier ce texte généré par l'IA."}
                </p>
                <button
                  className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-gold px-3 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!isContentDirty || isSavingContent}
                  onClick={() => void handleSaveContent()}
                  type="button"
                >
                  <Save className="size-4" />
                  {isSavingContent ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </>
          ) : (
            <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-canvas-soft p-3 text-sm leading-6 text-ink-muted">
              Lance une génération pour voir ici le document créé par SaaSTom.
            </pre>
          )}
        </section>
      </aside>
    </div>
  );
}
