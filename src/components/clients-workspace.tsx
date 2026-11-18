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
  type ClientRecord,
  type ClientStatus,
} from "@/lib/orfeo-data";

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

const COLUMN_ACCENT: Record<ClientStatus, { bar: string; line: string; over: string; avatar: string }> = {
  Prospect: { bar: "bg-ink-muted", line: "bg-linear-to-r from-transparent via-ink-muted/60 to-transparent", over: "border-white/30 bg-white/[0.05]", avatar: "bg-white/8 text-ink-soft" },
  "À relancer": { bar: "bg-coral", line: "bg-linear-to-r from-transparent via-coral to-transparent", over: "border-coral/50 bg-coral/[0.07]", avatar: "bg-coral/15 text-coral" },
  "En cours": { bar: "bg-sky", line: "bg-linear-to-r from-transparent via-sky to-transparent", over: "border-sky/50 bg-sky/[0.07]", avatar: "bg-sky/15 text-sky" },
  Signé: { bar: "bg-mint", line: "bg-linear-to-r from-transparent via-mint to-transparent", over: "border-mint/50 bg-mint/[0.07]", avatar: "bg-mint/15 text-mint" },
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
        total: filteredClients
          .filter((client) => client.status === columnStatus)
          .reduce((sum, client) => sum + client.amount, 0),
      })),
    [filteredClients],
  );
  const pipelineTotal = columns.reduce((sum, column) => sum + column.total, 0);

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
      <div className="glass flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-gold" />
          <h3 className="font-display text-lg font-semibold text-ink">Pipeline clients</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            <input
              className="field h-10 w-full rounded-xl pl-9 pr-3 text-sm"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrer..."
              type="search"
              value={query}
            />
          </div>
          <a
            className="btn-ghost flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-ink hover:border-gold/40 hover:text-gold sm:whitespace-nowrap"
            download
            href="/api/clients/export"
          >
            <Download className="size-4" />
            Exporter CSV
          </a>
          <button
            className="btn-gold flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold sm:whitespace-nowrap"
            onClick={() => setShowForm((value) => !value)}
            type="button"
          >
            <Plus className="size-4" />
            {showForm ? "Fermer" : "Ajouter un client"}
          </button>
        </div>
      </div>

      {showForm ? (
        <section className="glass rounded-3xl p-4 sm:p-5">
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
                className="btn-gold flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* Répartition du pipeline */}
      <div className="glass rounded-3xl p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Pipeline total</p>
            <p className="mt-1 font-display text-3xl font-semibold">{formatCurrency(pipelineTotal)}</p>
          </div>
          <p className="text-sm text-ink-muted">
            {filteredClients.length} client{filteredClients.length > 1 ? "s" : ""}
            <span className="hidden lg:inline"> · glisse une fiche pour changer son étape</span>
            <span className="lg:hidden"> · change l&apos;étape depuis chaque fiche</span>
          </p>
        </div>
        <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-white/5">
          {columns.map((column) =>
            column.total > 0 ? (
              <div
                className={`${COLUMN_ACCENT[column.status].bar} h-full transition-[width] duration-700`}
                key={column.status}
                style={{ width: `${pipelineTotal ? (column.total / pipelineTotal) * 100 : 0}%` }}
                title={`${column.status} : ${formatCurrency(column.total)}`}
              />
            ) : null,
          )}
        </div>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {columns.map((column) => (
          <div
            className={`relative flex w-[82%] shrink-0 snap-start flex-col gap-3 overflow-hidden rounded-3xl border p-3 transition duration-300 sm:w-[46%] lg:w-auto ${
              dragOverStatus === column.status
                ? `${COLUMN_ACCENT[column.status].over} scale-[1.01]`
                : "border-white/5 bg-white/[0.02]"
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
            <span aria-hidden className={`absolute inset-x-0 top-0 h-px ${COLUMN_ACCENT[column.status].line}`} />
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${COLUMN_ACCENT[column.status].bar}`} />
                <span className="text-sm font-semibold text-ink">{column.status}</span>
                <span className="rounded-full bg-white/5 px-1.5 text-[11px] font-semibold text-ink-muted">{column.clients.length}</span>
              </span>
              <span className="text-xs font-semibold text-ink-muted">{formatCurrency(column.total)}</span>
            </div>

            <div className="space-y-3">
              {column.clients.map((client) => (
                <article
                  className={`group animate-rise rounded-2xl border border-white/6 bg-linear-to-b from-surface-raised/90 to-surface/90 p-3.5 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] transition duration-200 ${
                    editingId === client.id
                      ? ""
                      : "cursor-grab hover:-translate-y-0.5 hover:border-gold/30 active:cursor-grabbing"
                  } ${draggingId === client.id ? "rotate-2 scale-95 opacity-40" : ""}`}
                  draggable={editingId !== client.id}
                  key={`${client.id}-${client.status}`}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragOverStatus(null);
                  }}
                  onDragStart={(event) => {
                    // Nécessaire pour Firefox
                    event.dataTransfer.setData("text/plain", client.id);
                    event.dataTransfer.effectAllowed = "move";
                    setDraggingId(client.id);
                  }}
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
                          className="btn-gold flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isUpdating}
                          onClick={() => void saveEdit()}
                          type="button"
                        >
                          <Check className="size-3.5" />
                          Enregistrer
                        </button>
                        <button
                          className="btn-ghost flex h-8 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-ink-soft hover:border-gold/40"
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
                        <div className="flex min-w-0 items-start gap-2.5">
                          <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${COLUMN_ACCENT[client.status].avatar}`}>
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-ink">{client.name}</h4>
                            <p className="mt-0.5 truncate text-xs text-ink-muted">{client.work}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-1 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
                          <button
                            className="grid size-7 place-items-center rounded-xl text-ink-muted transition hover:bg-gold/10 hover:text-gold"
                            onClick={() => startEdit(client)}
                            type="button"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            className="grid size-7 place-items-center rounded-xl text-ink-muted transition hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => void handleDelete(client.id)}
                            type="button"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-base font-semibold text-ink">{formatCurrency(client.amount)}</p>
                        {/* Sur téléphone, le glisser-déposer n'existe pas : on change l'étape ici */}
                        <select
                          aria-label={`Étape de ${client.name}`}
                          className="rounded-lg border border-white/10 bg-canvas px-1.5 py-1 text-[11px] text-ink-soft lg:hidden"
                          onChange={(event) => void updateClient(client.id, { status: event.target.value as ClientStatus })}
                          value={client.status}
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-1 truncate text-xs text-ink-muted">
                        {client.contact}
                      </p>
                      <p className="mt-2 rounded-xl border border-white/5 bg-white/[0.02] px-2 py-1.5 text-xs leading-5 text-ink-soft">
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
                <p
                  className={`rounded-2xl border border-dashed p-6 text-center text-xs transition ${
                    dragOverStatus === column.status ? "border-gold/50 text-gold" : "border-white/10 text-ink-muted"
                  }`}
                >
                  {draggingId ? "Dépose la fiche ici" : "Aucun client à cette étape"}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
