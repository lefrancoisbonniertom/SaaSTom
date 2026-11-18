"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import type { CopilotProfile } from "@/lib/copilot";

// Le copilote est enregistré dans le compte (API /api/copilot).
// Un petit magasin partagé évite de recharger les données dans chaque composant.

type Snapshot = {
  ready: boolean;
  profile: CopilotProfile | null;
  done: string[];
  emailReminders: boolean;
  error: string;
};

const EMPTY: Snapshot = { ready: false, profile: null, done: [], emailReminders: true, error: "" };

let snapshot: Snapshot = EMPTY;
let loadedFor: string | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(next: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Ancienne version : situation gardée dans le navigateur. On la récupère une fois.
const legacyKey = (email: string) => `orfeo-copilot:${email}`;
const legacyDoneKey = (email: string) => `orfeo-copilot-done:${email}`;
function readLegacy(email: string) {
  try {
    const profile = window.localStorage.getItem(legacyKey(email));
    const done = window.localStorage.getItem(legacyDoneKey(email));
    return profile ? { profile: JSON.parse(profile) as CopilotProfile, done: done ? (JSON.parse(done) as string[]) : [] } : null;
  } catch {
    return null;
  }
}
function clearLegacy(email: string) {
  try {
    window.localStorage.removeItem(legacyKey(email));
    window.localStorage.removeItem(legacyDoneKey(email));
  } catch {
    // rien à faire
  }
}

type ApiRecord = { profile: CopilotProfile | null; doneIds: string[]; emailReminders: boolean };

async function save(body: Record<string, unknown>) {
  const res = await fetch("/api/copilot", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("L'enregistrement a échoué. Réessaie dans un instant.");
  const data = (await res.json()) as ApiRecord;
  emit({ profile: data.profile, done: data.doneIds, emailReminders: data.emailReminders, error: "" });
}

function load(email: string) {
  if (loadedFor === email && loading) return loading;
  loadedFor = email;
  loading = (async () => {
    try {
      const res = await fetch("/api/copilot", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as ApiRecord;
      if (!data.profile) {
        const legacy = readLegacy(email);
        if (legacy) {
          await save({ profile: legacy.profile, doneIds: legacy.done });
          clearLegacy(email);
          emit({ ready: true });
          return;
        }
      }
      emit({ ready: true, profile: data.profile, done: data.doneIds, emailReminders: data.emailReminders, error: "" });
    } catch {
      emit({ ready: true, error: "Impossible de charger ton copilote pour le moment." });
      loading = null;
    }
  })();
  return loading;
}

export function useCopilot() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? null;
  const state = useSyncExternalStore(subscribe, () => snapshot, () => EMPTY);

  useEffect(() => {
    if (email) void load(email);
  }, [email]);

  const setProfile = useCallback(async (p: CopilotProfile | null) => {
    const previous = snapshot.profile;
    emit({ profile: p });
    try {
      await save({ profile: p });
    } catch (error) {
      emit({ profile: previous, error: error instanceof Error ? error.message : "Erreur" });
    }
  }, []);

  const toggleDone = useCallback(async (id: string) => {
    const previous = snapshot.done;
    const next = previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id];
    emit({ done: next });
    try {
      await save({ doneIds: next });
    } catch (error) {
      emit({ done: previous, error: error instanceof Error ? error.message : "Erreur" });
    }
  }, []);

  const setEmailReminders = useCallback(async (on: boolean) => {
    emit({ emailReminders: on });
    try {
      await save({ emailReminders: on });
    } catch (error) {
      emit({ emailReminders: !on, error: error instanceof Error ? error.message : "Erreur" });
    }
  }, []);

  return { ...state, setProfile, toggleDone, setEmailReminders };
}
