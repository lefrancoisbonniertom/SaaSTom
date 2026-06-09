"use client";

import { Plus, Search, Users } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useAppState } from "@/components/app-state-provider";
import {
  formatCurrency,
  statusStyles,
  type ClientStatus,
} from "@/lib/saastom-data";

const statusOptions: ClientStatus[] = [
  "Prospect",
  "A relancer",
  "En cours",
  "Signe",
];

export function ClientsWorkspace() {
  const { state, addClient } = useAppState();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [work, setWork] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<ClientStatus>("Prospect");
  const [contact, setContact] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        nextAction: "Definir la prochaine action.",
      });
      setName("");
      setWork("");
      setAmount("");
      setStatus("Prospect");
      setContact("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-[#e65f3c]" />
          <h3 className="text-lg font-semibold">Ajouter un client</h3>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold" htmlFor="client-name">
              Nom
            </label>
            <input
              className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
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
              className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
              id="client-work"
              onChange={(event) => setWork(event.target.value)}
              placeholder="Exemple : Proposition commerciale"
              value={work}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold" htmlFor="client-amount">
                Montant
              </label>
              <input
                className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
                id="client-amount"
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="1200"
                type="number"
                value={amount}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="client-status">
                Statut
              </label>
              <select
                className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
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
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="client-contact">
              Contact
            </label>
            <input
              className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
              id="client-contact"
              onChange={(event) => setContact(event.target.value)}
              placeholder="email@client.fr"
              type="email"
              value={contact}
            />
          </div>
          <button
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!name.trim() || !work.trim() || isSaving}
            type="submit"
          >
            <Plus className="size-4" />
            {isSaving ? "Ajout..." : "Ajouter au CRM"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-[#dfe4d8] bg-white p-4 shadow-[0_1px_0_rgba(23,32,27,0.04)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#4f6f57]" />
            <h3 className="text-lg font-semibold">Pipeline clients</h3>
          </div>
          <div className="relative sm:min-w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#73806c]" />
            <input
              className="h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] pl-9 pr-3 text-sm outline-none focus:border-[#4f6f57]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrer..."
              type="search"
              value={query}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filteredClients.map((client) => (
            <article
              className="rounded-lg border border-[#dfe4d8] bg-[#fbfcf8] p-4"
              key={client.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h4 className="font-semibold">{client.name}</h4>
                  <p className="mt-1 text-sm text-[#66705f]">{client.work}</p>
                  <p className="mt-2 text-sm text-[#66705f]">{client.contact}</p>
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
              </div>
              <p className="mt-4 rounded-md border border-[#dfe4d8] bg-white px-3 py-2 text-sm text-[#384438]">
                {client.nextAction}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
