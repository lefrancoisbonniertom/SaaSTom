"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  emptyState,
  type ClientRecord,
  type ClientStatus,
  type DocumentRecord,
  type SaaSTomState,
} from "@/lib/saastom-data";

type NewClientInput = {
  name: string;
  work: string;
  amount: number;
  status: ClientStatus;
  contact: string;
  nextAction: string;
};

type ClientUpdateInput = Partial<NewClientInput>;

type StateResponse = {
  state: SaaSTomState;
};

type ClientResponse = StateResponse & {
  client: ClientRecord;
};

type DocumentResponse = StateResponse & {
  document: DocumentRecord;
};

type AppStateContextValue = {
  state: SaaSTomState;
  isLoading: boolean;
  error: string | null;
  addClient: (client: NewClientInput) => Promise<ClientRecord>;
  updateClient: (
    clientId: string,
    updates: ClientUpdateInput,
  ) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  generateDocument: (
    prompt: string,
    type?: string,
    clientId?: string,
  ) => Promise<DocumentRecord>;
  toggleTask: (taskId: string) => Promise<void>;
  addTask: (title: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  sendDocumentEmail: (documentId: string) => Promise<string>;
  refresh: () => Promise<void>;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Une erreur est survenue.");
  }

  return payload;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaaSTomState>(emptyState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const payload = await parseJsonResponse<StateResponse>(
        await fetch("/api/state", {
          cache: "no-store",
        }),
      );
      setState(payload.state);
      setError(null);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Impossible de charger les donnees.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadState() {
      try {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch("/api/state", {
            cache: "no-store",
          }),
        );

        if (isActive) {
          setState(payload.state);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger les donnees.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadState();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      isLoading,
      error,
      refresh,
      addClient: async (client) => {
        const payload = await parseJsonResponse<ClientResponse>(
          await fetch("/api/clients", {
            body: JSON.stringify(client),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }),
        );

        setState(payload.state);
        setError(null);

        return payload.client;
      },
      updateClient: async (clientId, updates) => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch(`/api/clients/${clientId}`, {
            body: JSON.stringify(updates),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
          }),
        );

        setState(payload.state);
        setError(null);
      },
      deleteClient: async (clientId) => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch(`/api/clients/${clientId}`, {
            method: "DELETE",
          }),
        );

        setState(payload.state);
        setError(null);
      },
      generateDocument: async (prompt, type = "Document IA", clientId) => {
        const payload = await parseJsonResponse<DocumentResponse>(
          await fetch("/api/documents/generate", {
            body: JSON.stringify({ prompt, type, clientId }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }),
        );

        setState(payload.state);
        setError(null);

        return payload.document;
      },
      toggleTask: async (taskId) => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
          }),
        );

        setState(payload.state);
        setError(null);
      },
      addTask: async (title) => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch("/api/tasks", {
            body: JSON.stringify({ title }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }),
        );

        setState(payload.state);
        setError(null);
      },
      deleteTask: async (taskId) => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
          }),
        );

        setState(payload.state);
        setError(null);
      },
      sendDocumentEmail: async (documentId) => {
        const payload = await parseJsonResponse<{ message: string }>(
          await fetch(`/api/documents/${documentId}/send`, {
            method: "POST",
          }),
        );

        return payload.message;
      },
    }),
    [error, isLoading, refresh, state],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}
