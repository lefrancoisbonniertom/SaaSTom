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
  initialState,
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
  generateDocument: (
    prompt: string,
    type?: string,
  ) => Promise<DocumentRecord>;
  toggleTask: (taskId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
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
  const [state, setState] = useState<SaaSTomState>(initialState);
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
      generateDocument: async (prompt, type = "Document IA") => {
        const payload = await parseJsonResponse<DocumentResponse>(
          await fetch("/api/documents/generate", {
            body: JSON.stringify({ prompt, type }),
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
      resetDemo: async () => {
        const payload = await parseJsonResponse<StateResponse>(
          await fetch("/api/reset", {
            method: "POST",
          }),
        );

        setState(payload.state);
        setError(null);
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
