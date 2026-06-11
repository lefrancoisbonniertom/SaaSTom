"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { clearSessionMarker } from "@/lib/session-marker";

export function SettingsActions() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    clearSessionMarker();
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="mt-4">
      <section className="rounded-lg border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Déconnexion
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Ferme ta session sur cet appareil. Tes données restent
              sauvegardées.
            </p>
          </div>
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-red-500/90 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60 sm:whitespace-nowrap"
            disabled={isLoggingOut}
            onClick={() => void handleLogout()}
            type="button"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </section>
    </div>
  );
}
