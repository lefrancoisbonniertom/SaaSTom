"use client";

import Link from "next/link";
import { FileText, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useAppState } from "@/components/app-state-provider";

export function GlobalSearch() {
  const { state } = useAppState();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const matchedClients = useMemo(() => {
    if (!normalizedQuery) return [];

    return state.clients
      .filter((client) =>
        [client.name, client.work, client.contact, client.status, ...client.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [normalizedQuery, state.clients]);

  const matchedDocuments = useMemo(() => {
    if (!normalizedQuery) return [];

    return state.documents
      .filter((document) =>
        [document.title, document.type, document.clientName, document.content]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [normalizedQuery, state.documents]);

  const hasResults = matchedClients.length > 0 || matchedDocuments.length > 0;
  const showDropdown = isOpen && normalizedQuery.length > 0;

  function handleSelect() {
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div className="relative min-w-80">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
      <input
        className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/20"
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder="Rechercher client, document..."
        type="search"
        value={query}
      />
      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-96 overflow-y-auto rounded-md border border-border bg-surface-raised p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          {hasResults ? (
            <>
              {matchedClients.length > 0 ? (
                <div className="mb-1">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Clients
                  </p>
                  {matchedClients.map((client) => (
                    <Link
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-ink transition hover:bg-gold/10"
                      href={`/clients?q=${encodeURIComponent(client.name)}`}
                      key={client.id}
                      onClick={handleSelect}
                    >
                      <Users className="size-4 shrink-0 text-sage" />
                      <span className="min-w-0 flex-1 truncate">{client.name}</span>
                      <span className="shrink-0 text-xs text-ink-muted">
                        {client.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
              {matchedDocuments.length > 0 ? (
                <div>
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Documents
                  </p>
                  {matchedDocuments.map((document) => (
                    <Link
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-ink transition hover:bg-gold/10"
                      href={`/documents?id=${document.id}`}
                      key={document.id}
                      onClick={handleSelect}
                    >
                      <FileText className="size-4 shrink-0 text-gold" />
                      <span className="min-w-0 flex-1 truncate">
                        {document.title}
                      </span>
                      <span className="shrink-0 text-xs text-ink-muted">
                        {document.type}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <p className="px-2 py-2 text-sm text-ink-muted">Aucun résultat.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
