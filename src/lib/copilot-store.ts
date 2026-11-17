"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { CopilotProfile } from "@/lib/copilot";

// Le profil du copilote est gardé dans le navigateur (par compte).
// Les échéances sont recalculées à chaque visite à partir de ce profil.

const keyFor = (email?: string | null) => `orfeo-copilot:${email ?? "anonyme"}`;
const doneKeyFor = (email?: string | null) => `orfeo-copilot-done:${email ?? "anonyme"}`;
const EVENT = "orfeo-copilot-change";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible (navigation privée…) : on ignore
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useCopilot() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [profile, setProfileState] = useState<CopilotProfile | null>(null);
  const [done, setDoneState] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      setProfileState(read<CopilotProfile | null>(keyFor(email), null));
      setDoneState(read<string[]>(doneKeyFor(email), []));
      setReady(true);
    };
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [email]);

  const setProfile = useCallback((p: CopilotProfile | null) => write(keyFor(email), p), [email]);
  const toggleDone = useCallback(
    (id: string) => {
      const current = read<string[]>(doneKeyFor(email), []);
      write(doneKeyFor(email), current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
    },
    [email],
  );

  return { profile, done, ready, setProfile, toggleDone };
}
