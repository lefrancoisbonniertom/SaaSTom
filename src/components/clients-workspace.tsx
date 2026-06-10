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
};

function toEditDraft(client: ClientRecord): EditDraft {
  return {
    name: client.name,
    work: client.work,
    amount: String(client.amount),
    status: client.status,
    contact: client.contact,
    nextAction: client.nextAction,
  };
}

const fieldClass =
  "mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]";

const cardFieldClass =
  "w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-2 py-1.5 text-xs outline-none focus:border-[#4f6f57]";

export function ClientsWorkspace() {
  const { state, addClient, updateClient, deleteClient } = useAppState();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<ClientStatus>("Prospect");
  const [contact, setContact] = useState("");
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
      [client.name, client.work, client.contact, client.status]
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
      });
      setName("");
      setWork("");
      setAmount("");
      setStatus("Prospect");
      setContact("");
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
      <div className="flex flex-col gap-3 rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-[#4f6f57]" />
          <h3 className="text-lg font-semibold">Pipeline clients</h3>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#73806c]" />
            <input
              className="h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] pl-9 pr-3 text-sm outline-none focus:border-[#4f6f57]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrer..."
              type="search"
              value={query}
            />
          </div>
          <a
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe4d8] bg-white px-4 text-sm font-semibold text-[#17201b] transition hover:border-[#b9c4ad] sm:whitespace-nowrap"
            download
            href="/api/clients/export"
          >
            <Download className="size-4" />
            Exporter CSV
          </a>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] sm:whitespace-nowrap"
            onClick={() => setShowForm((value) => !value)}
            type="button"
          >
            <Plus className="size-4" />
            {showForm ? "Fermer" : "Ajouter un client"}
          </button>
        </div>
      </div>

      {showForm ? (
        <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="text-sm font-semibold" htmlFor="client-name">
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
              <label className="text-sm font-semibold" htmlFor="client-work">
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
                className="text-sm font-semibold"
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
                className="text-sm font-semibold"
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
                className="text-sm font-semibold"
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
            <div className="flex items-end">
              <button
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
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
                ? "border-[#4f6f57] bg-[#f3f7ec]"
                : "border-transparent bg-[#f3f5ef]"
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
              <span className="text-xs font-semibold text-[#73806c]">
                {column.clients.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.clients.map((client) => (
                <article
                  className={`rounded-lg border border-[#dfe4d8] bg-white p-3 shadow-[0_1px_0_rgba(23,32,27,0.04)] transition ${
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
                      <div className="flex gap-2">
                        <button
                          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#17201b] text-xs font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isUpdating}
                          onClick={() => void saveEdit()}
                          type="button"
                        >
                          <Check className="size-3.5" />
                          Enregistrer
                        </button>
                        <button
                          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe4d8] bg-[#fbfcf8] text-xs font-semibold text-[#384438] transition hover:border-[#b9c4ad]"
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
                          <h4 className="truncate text-sm font-semibold">
                            {client.name}
                          </h4>
                          <p className="mt-1 truncate text-xs text-[#66705f]">
                            {client.work}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            className="grid size-7 place-items-center rounded-md text-[#73806c] transition hover:bg-[#f3f7ec] hover:text-[#17201b]"
                            onClick={() => startEdit(client)}
                            type="button"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            className="grid size-7 place-items-center rounded-md text-[#73806c] transition hover:bg-red-50 hover:text-red-600"
                            onClick={() => void handleDelete(client.id)}
                            type="button"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold">
                        {formatCurrency(client.amount)}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#66705f]">
                        {client.contact}
                      </p>
                      <p className="mt-2 rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-2 py-1.5 text-xs leading-5 text-[#384438]">
                        {client.nextAction}
                      </p>
                    </>
                  )}
                </article>
              ))}

              {column.clients.length === 0 ? (
                <p className="rounded-md border border-dashed border-[#dfe4d8] p-3 text-center text-xs text-[#8c9785]">
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
