"use client";

import {
  Check,
  Download,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useAppState } from "@/components/app-state-provider";
import {
  formatCurrency,
  normalizeTags,
  statusStyles,
  type ClientRecord,
  type ClientStatus,
} from "@/lib/saastom-data";

const statusOptions: ClientStatus[] = [
  "Prospect",
  "À relancer",
  "En cours",
  "Signé",
];

type EditDraft = {
  name: string;
  work: string;
  amount: string;
  status: ClientStatus;
  contact: string;
  nextAction: string;
  tags: string;
};

function toEditDraft(client: ClientRecord): EditDraft {
  return {
    name: client.name,
    work: client.work,
    amount: String(client.amount),
    status: client.status,
    contact: client.contact,
    nextAction: client.nextAction,
    tags: client.tags.join(", "),
  };
}

const fieldClass =
  "mt-2 h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

const cardFieldClass =
  "w-full rounded-md border border-border bg-canvas-soft px-2 py-1.5 text-xs text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20";

export function ClientsWorkspace({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { state, addClient, updateClient, deleteClient } = useAppState();
  const [query, setQuery] = useState(initialQuery);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<ClientStatus>("Prospect");
  const [contact, setContact] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ClientStatus | null>(
    null,
  );

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return state.clients;
    }

    return state.clients.filter((client) =>
      [client.name, client.work, client.contact, client.status, ...client.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, state.clients]);

  const columns = useMemo(
    () =>
      statusOptions.map((columnStatus) => ({
        status: columnStatus,
        clients: filteredClients.filter(
          (client) => client.status === columnStatus,
        ),
      })),
    [filteredClients],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !work.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      await addClient({
        name: name.trim(),
        work: work.trim(),
        amount: Number(amount) || 0,
        status,
        contact: contact.trim() || "contact@client.fr",
        nextAction: "Définir la prochaine action.",
        tags: normalizeTags(tags.split(",")),
      });
      setName("");
      setWork("");
      setAmount("");
      setStatus("Prospect");
      setContact("");
      setTags("");
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(client: ClientRecord) {
    setEditingId(client.id);
    setEditDraft(toEditDraft(client));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  async function saveEdit() {
    if (!editingId || !editDraft) {
      return;
    }

    setIsUpdating(true);

    try {
      await updateClient(editingId, {
        name: editDraft.name.trim(),
        work: editDraft.work.trim(),
        amount: Number(editDraft.amount) || 0,
        status: editDraft.status,
        contact: editDraft.contact.trim(),
        nextAction: editDraft.nextAction.trim(),
        tags: normalizeTags(editDraft.tags.split(",")),
      });
      setEditingId(null);
      setEditDraft(null);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(clientId: string) {
    if (
      !window.confirm("Supprimer ce client ? Cette action est irréversible.")
    ) {
      return;
    }

    await deleteClient(clientId);
  }

  function handleDrop(columnStatus: ClientStatus) {
    const clientId = draggingId;
    setDraggingId(null);
    setDragOverStatus(null);

    if (!clientId) {
      return;
    }

    const client = state.clients.find((item) => item.id === clientId);

    if (client && client.status !== columnStatus) {
      void updateClient(clientId, { status: columnStatus });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-gold" />
          <h3 className="font-display text-lg font-semibold text-ink">Pipeline clients</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              className="h-10 w-full rounded-md border border-border bg-canvas-soft pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrer..."
              type="search"
              value={query}
            />
          </div>
          <a
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-canvas-soft px-4 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold sm:whitespace-nowrap"
            download
            href="/api/clients/export"
          >
            <Download className="size-4" />
            Exporter CSV
          </a>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft sm:whitespace-nowrap"
            onClick={() => setShowForm((value) => !value)}
            type="button"
          >
            <Plus className="size-4" />
            {showForm ? "Fermer" : "Ajouter un client"}
          </button>
        </div>
      </div>

      {showForm ? (
        <section className="rounded-lg border border-border bg-surface p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">
          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="client-name">
                Nom
              </label>
              <input
                className={fieldClass}
                id="client-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Exemple : Studio Martin"
                value={name}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="client-work">
                Projet
              </label>
              <input
                className={fieldClass}
                id="client-work"
                onChange={(event) => setWork(event.target.value)}
                placeholder="Exemple : Proposition commerciale"
                value={work}
              />
            </div>
            <div>
              <label
                className="text-sm font-semibold text-ink"
                htmlFor="client-contact"
              >
                Contact
              </label>
              <input
                className={fieldClass}
                id="client-contact"
                onChange={(event) => setContact(event.target.value)}
                placeholder="email@client.fr"
                type="email"
                value={contact}
              />
            </div>
            <div>
              <label
                className="text-sm font-semibold text-ink"
                htmlFor="client-amount"
              >
                Montant
              </label>
              <input
                className={fieldClass}
                id="client-amount"
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="1200"
                type="number"
                value={amount}
              />
            </div>
            <div>
              <label
                className="text-sm font-semibold text-ink"
                htmlFor="client-status"
              >
                Statut
              </label>
              <select
                className={fieldClass}
                id="client-status"
                onChange={(event) =>
                  setStatus(event.target.value as ClientStatus)
                }
                value={status}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="client-tags">
                Étiquettes
              </label>
              <input
                className={fieldClass}
                id="client-tags"
                onChange={(event) => setTags(event.target.value)}
                placeholder="urgent, web, design"
                value={tags}
              />
            </div>
            <div className="flex items-end">
              <button
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!name.trim() || !work.trim() || isSaving}
                type="submit"
              >
                <Plus className="size-4" />
                {isSaving ? "Ajout..." : "Ajouter au CRM"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        {columns.map((column) => (
          <div
            className={`flex flex-col gap-3 rounded-lg border-2 p-3 transition ${
              dragOverStatus === column.status
                ? "border-gold bg-gold/10"
                : "border-transparent bg-surface/40"
            }`}
            key={column.status}
            onDragLeave={() =>
              setDragOverStatus((current) =>
                current === column.status ? null : current,
              )
            }
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverStatus(column.status);
            }}
            onDrop={() => handleDrop(column.status)}
          >
            <div className="flex items-center justify-between px-1">
              <span
                className={`rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[column.status]}`}
              >
                {column.status}
              </span>
              <span className="text-xs font-semibold text-ink-muted">
                {column.clients.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.clients.map((client) => (
                <article
                  className={`rounded-lg border border-border bg-surface p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition ${
                    editingId === client.id
                      ? ""
                      : "cursor-grab active:cursor-grabbing"
                  } ${draggingId === client.id ? "opacity-50" : ""}`}
                  draggable={editingId !== client.id}
                  key={client.id}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragOverStatus(null);
                  }}
                  onDragStart={() => setDraggingId(client.id)}
                >
                  {editingId === client.id && editDraft ? (
                    <div className="space-y-2">
                      <input
                        className={cardFieldClass}
                        onChange={(event) =>
                          setEditDraft({
                            ...editDraft,
                            name: event.target.value,
                          })
                        }
                        placeholder="Nom"
                        value={editDraft.name}
                      />
                      <input
                        className={cardFieldClass}
                        onChange={(event) =>
                          setEditDraft({
                            ...editDraft,
                            work: event.target.value,
                          })
                        }
                        placeholder="Projet"
                        value={editDraft.work}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className={cardFieldClass}
                          min="0"
                          onChange={(event) =>
                            setEditDraft({
                              ...editDraft,
                              amount: event.target.value,
                            })
                          }
                          placeholder="Montant"
                          type="number"
                          value={editDraft.amount}
                        />
                        <select
                          className={cardFieldClass}
                          onChange={(event) =>
                            setEditDraft({
                              ...editDraft,
                              status: event.target.value as ClientStatus,
                            })
                          }
                          value={editDraft.status}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        className={cardFieldClass}
                        onChange={(event) =>
                          setEditDraft({
                            ...editDraft,
                            contact: event.target.value,
                          })
                        }
                        placeholder="Contact"
                        value={editDraft.contact}
                      />
                      <textarea
                        className={`${cardFieldClass} min-h-16 resize-none`}
                        onChange={(event) =>
                          setEditDraft({
                            ...editDraft,
                            nextAction: event.target.value,
                          })
                        }
                        placeholder="Prochaine action"
                        value={editDraft.nextAction}
                      />
                      <input
                        className={cardFieldClass}
                        onChange={(event) =>
                          setEditDraft({
                            ...editDraft,
                            tags: event.target.value,
                          })
                        }
                        placeholder="Étiquettes (séparées par des virgules)"
                        value={editDraft.tags}
                      />
                      <div className="flex gap-2">
                        <button
                          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-gold text-xs font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isUpdating}
                          onClick={() => void saveEdit()}
                          type="button"
                        >
                          <Check className="size-3.5" />
                          Enregistrer
                        </button>
                        <button
                          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-canvas-soft text-xs font-semibold text-ink-soft transition hover:border-gold/40"
                          onClick={cancelEdit}
                          type="button"
                        >
                          <X className="size-3.5" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-ink">
                            {client.name}
                          </h4>
                          <p className="mt-1 truncate text-xs text-ink-muted">
                            {client.work}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            className="grid size-7 place-items-center rounded-md text-ink-muted transition hover:bg-gold/10 hover:text-gold"
                            onClick={() => startEdit(client)}
                            type="button"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            className="grid size-7 place-items-center rounded-md text-ink-muted transition hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => void handleDelete(client.id)}
                            type="button"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-ink">
                        {formatCurrency(client.amount)}
                      </p>
                      <p className="mt-1 truncate text-xs text-ink-muted">
                        {client.contact}
                      </p>
                      <p className="mt-2 rounded-md border border-border bg-canvas-soft px-2 py-1.5 text-xs leading-5 text-ink-soft">
                        {client.nextAction}
                      </p>
                      {client.tags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {client.tags.map((tag) => (
                            <span
                              className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold"
                              key={tag}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </article>
              ))}

              {column.clients.length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-3 text-center text-xs text-ink-muted">
                  Aucun client
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
