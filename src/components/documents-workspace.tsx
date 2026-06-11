"use client";

import { Download, FileText, Mail, Plus, Save, Search } from "lucide-react";
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
  const { state, generateDocument, sendDocumentEmail, updateDocument } = useAppState();
  const [query, setQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [draftClientId, setDraftClientId] = useState("");
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
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
        <div className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex items-center gap-2">
            <Plus className="size-4 text-[#e65f3c]" />
            <h3 className="text-lg font-semibold">Nouveau brouillon</h3>
          </div>
          <textarea
            className="mt-4 min-h-32 w-full resize-none rounded-md border border-[#dfe4d8] bg-[#fbfcf8] p-3 text-sm leading-6 outline-none focus:border-[#4f6f57]"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Exemple : Créer un email de relance pour Atelier Moreau."
            value={prompt}
          />
          <select
            className="mt-3 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
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
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!prompt.trim() || isCreating}
            onClick={() => void handleCreate()}
            type="button"
          >
            <FileText className="size-4" />
            {isCreating ? "Création..." : "Créer le document"}
          </button>
        </div>

        <div className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#73806c]" />
              <input
                className="h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] pl-9 pr-3 text-sm outline-none focus:border-[#4f6f57]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher document..."
                type="search"
                value={query}
              />
            </div>
            <a
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#dfe4d8] bg-white px-3 text-sm font-semibold text-[#17201b] transition hover:border-[#b9c4ad]"
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
                    ? "border-[#4f6f57] bg-[#f3f7ec]"
                    : "border-[#dfe4d8] bg-[#fbfcf8] hover:border-[#b9c4ad]"
                }`}
                key={document.id}
                onClick={() => handleSelectDocument(document.id)}
                type="button"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-[#4f6f57]">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {document.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#66705f]">
                    {document.type} · {document.createdAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
        {selectedDocument ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#66705f]">
                  {selectedDocument.type}
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  {selectedDocument.title}
                </h3>
                <p className="mt-2 text-sm text-[#66705f]">
                  {selectedDocument.clientName ?? "Sans client lié"} ·{" "}
                  {selectedDocument.createdAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="flex h-9 items-center gap-2 rounded-md border border-[#dfe4d8] bg-white px-3 text-sm font-semibold text-[#17201b] transition hover:border-[#b9c4ad] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSending}
                  onClick={() => void handleSendEmail()}
                  type="button"
                >
                  <Mail className="size-4" />
                  {isSending ? "Envoi..." : "Envoyer au client"}
                </button>
                <a
                  className="flex h-9 items-center gap-2 rounded-md border border-[#dfe4d8] bg-white px-3 text-sm font-semibold text-[#17201b] transition hover:border-[#b9c4ad]"
                  download
                  href={`/api/documents/${selectedDocument.id}/pdf`}
                >
                  <Download className="size-4" />
                  PDF
                </a>
              </div>
            </div>
            {sendFeedback && sendFeedback.documentId === selectedDocument.id ? (
              <p
                className={`mt-3 text-sm font-medium ${
                  sendFeedback.type === "success" ? "text-[#4f6f57]" : "text-[#c0432a]"
                }`}
              >
                {sendFeedback.text}
              </p>
            ) : null}
            <textarea
              className="mt-5 min-h-96 w-full resize-y rounded-md border border-[#dfe4d8] bg-[#fbfcf8] p-4 text-sm leading-6 text-[#384438] outline-none transition focus:border-[#4f6f57] focus:ring-2 focus:ring-[#4f6f57]/20"
              onChange={(event) => setEditedContent(event.target.value)}
              value={editedContent}
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p
                className={`text-xs font-medium ${
                  saveFeedback && saveFeedback.documentId === selectedDocument.id
                    ? saveFeedback.type === "success"
                      ? "text-[#4f6f57]"
                      : "text-[#c0432a]"
                    : "text-[#8c9785]"
                }`}
              >
                {saveFeedback && saveFeedback.documentId === selectedDocument.id
                  ? saveFeedback.text
                  : isContentDirty
                    ? "Modifications non enregistrées."
                    : "Tu peux modifier ce texte généré par l'IA."}
              </p>
              <button
                className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-[#17201b] px-3 text-sm font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="grid min-h-96 place-items-center rounded-md border border-dashed border-[#dfe4d8] bg-[#fbfcf8] p-6 text-center">
            <div>
              <FileText className="mx-auto size-8 text-[#8c9785]" />
              <p className="mt-3 text-sm font-medium text-[#66705f]">
                Aucun document pour le moment.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
