"use client";

import { Download, FileText, Mail, Plus, Save, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "@/components/app-state-provider";

type ActionFeedback = {
  documentId: string;
  type: "success" | "error";
  text: string;
};

export function DocumentsWorkspace({
  initialSelectedId = "",
}: {
  initialSelectedId?: string;
}) {
  const { state, generateDocument, sendDocumentEmail, updateDocument, deleteDocument } =
    useAppState();
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [draftClientId, setDraftClientId] = useState("");
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<ActionFeedback | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedDocumentId, setEditedDocumentId] = useState<string | undefined>(undefined);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<ActionFeedback | null>(null);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return state.documents;
    }

    return state.documents.filter((document) =>
      [document.title, document.type, document.clientName, document.content]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, state.documents]);

  const selectedDocument =
    state.documents.find((document) => document.id === selectedId) ??
    state.documents[0];

  if (selectedDocument?.id !== editedDocumentId) {
    setEditedDocumentId(selectedDocument?.id);
    setEditedContent(selectedDocument?.content ?? "");
    setSaveFeedback(null);
  }

  const isContentDirty = selectedDocument
    ? editedContent !== selectedDocument.content
    : false;

  async function handleCreate() {
    const cleanedPrompt = prompt.trim();

    if (!cleanedPrompt) {
      return;
    }

    setIsCreating(true);

    try {
      const document = await generateDocument(
        cleanedPrompt,
        "Brouillon",
        draftClientId || undefined,
      );
      setSelectedId(document.id);
      setPrompt("");
      setDraftClientId("");
    } finally {
      setIsCreating(false);
    }
  }

  function handleSelectDocument(documentId: string) {
    setSelectedId(documentId);
    setSendFeedback(null);
  }

  async function handleSendEmail() {
    if (!selectedDocument) {
      return;
    }

    setIsSending(true);

    try {
      const message = await sendDocumentEmail(selectedDocument.id);
      setSendFeedback({ documentId: selectedDocument.id, type: "success", text: message });
    } catch (error) {
      setSendFeedback({
        documentId: selectedDocument.id,
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete() {
    if (!selectedDocument) {
      return;
    }

    if (
      !window.confirm("Supprimer ce document ? Cette action est irréversible.")
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDocument(selectedDocument.id);
      setSelectedId("");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSaveContent() {
    if (!selectedDocument) {
      return;
    }

    setIsSavingContent(true);

    try {
      await updateDocument(selectedDocument.id, { content: editedContent });
      setSaveFeedback({
        documentId: selectedDocument.id,
        type: "success",
        text: "Modifications enregistrées.",
      });
    } catch (error) {
      setSaveFeedback({
        documentId: selectedDocument.id,
        type: "error",
        text: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSavingContent(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
          <div className="flex items-center gap-2">
            <Plus className="size-4 text-gold" />
            <h3 className="font-display text-lg font-semibold text-ink">Nouveau brouillon</h3>
          </div>
          <textarea
            className="mt-4 min-h-32 w-full resize-none rounded-md border border-border bg-canvas-soft p-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Exemple : Créer un email de relance pour Atelier Moreau."
            value={prompt}
          />
          <select
            className="mt-3 h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
            onChange={(event) => setDraftClientId(event.target.value)}
            value={draftClientId}
          >
            <option value="">Aucun client</option>
            {state.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          <button
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!prompt.trim() || isCreating}
            onClick={() => void handleCreate()}
            type="button"
          >
            <FileText className="size-4" />
            {isCreating ? "Création..." : "Créer le document"}
          </button>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                className="h-10 w-full rounded-md border border-border bg-canvas-soft pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher document..."
                type="search"
                value={query}
              />
            </div>
            <a
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-canvas-soft px-3 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold"
              download
              href="/api/documents/export"
            >
              <Download className="size-4" />
              CSV
            </a>
          </div>

          <div className="mt-4 space-y-3">
            {filteredDocuments.map((document) => (
              <button
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                  selectedDocument?.id === document.id
                    ? "border-gold bg-gold/10"
                    : "border-border bg-canvas-soft hover:border-gold/40"
                }`}
                key={document.id}
                onClick={() => handleSelectDocument(document.id)}
                type="button"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-surface text-gold">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {document.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-muted">
                    {document.type} · {document.createdAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
        {selectedDocument ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-muted">
                  {selectedDocument.type}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                  {selectedDocument.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {selectedDocument.clientName ?? "Sans client lié"} ·{" "}
                  {selectedDocument.createdAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="flex h-9 items-center gap-2 rounded-md border border-border bg-canvas-soft px-3 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSending}
                  onClick={() => void handleSendEmail()}
                  type="button"
                >
                  <Mail className="size-4" />
                  {isSending ? "Envoi..." : "Envoyer au client"}
                </button>
                <a
                  className="flex h-9 items-center gap-2 rounded-md border border-border bg-canvas-soft px-3 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold"
                  download
                  href={`/api/documents/${selectedDocument.id}/pdf`}
                >
                  <Download className="size-4" />
                  PDF
                </a>
                <button
                  className="flex h-9 items-center gap-2 rounded-md border border-border bg-canvas-soft px-3 text-sm font-semibold text-ink-muted transition hover:border-red-500/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isDeleting}
                  onClick={() => void handleDelete()}
                  type="button"
                >
                  <Trash2 className="size-4" />
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
            {sendFeedback && sendFeedback.documentId === selectedDocument.id ? (
              <p
                className={`mt-3 text-sm font-medium ${
                  sendFeedback.type === "success" ? "text-sage" : "text-red-400"
                }`}
              >
                {sendFeedback.text}
              </p>
            ) : null}
            <textarea
              className="mt-5 min-h-96 w-full resize-y rounded-md border border-border bg-canvas-soft p-4 text-sm leading-6 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              onChange={(event) => setEditedContent(event.target.value)}
              value={editedContent}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-xs font-medium ${
                  saveFeedback && saveFeedback.documentId === selectedDocument.id
                    ? saveFeedback.type === "success"
                      ? "text-sage"
                      : "text-red-400"
                    : "text-ink-muted"
                }`}
              >
                {saveFeedback && saveFeedback.documentId === selectedDocument.id
                  ? saveFeedback.text
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
                {isSavingContent ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </>
        ) : (
          <div className="grid min-h-96 place-items-center rounded-md border border-dashed border-border bg-canvas-soft p-6 text-center">
            <div>
              <FileText className="mx-auto size-8 text-ink-muted" />
              <p className="mt-3 text-sm font-medium text-ink-muted">
                Aucun document pour le moment.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
