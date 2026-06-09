"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useAppState } from "@/components/app-state-provider";

export function SettingsActions() {
  const { resetDemo } = useAppState();
  const [isResetting, setIsResetting] = useState(false);

  async function handleReset() {
    setIsResetting(true);

    try {
      await resetDemo();
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Donnees de demonstration</h3>
          <p className="mt-2 text-sm leading-6 text-[#66705f]">
            Efface les clients et documents ajoutes dans ce navigateur, puis
            recharge les donnees de depart.
          </p>
        </div>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-4 text-sm font-semibold text-[#384438] transition hover:border-[#b9c4ad] hover:bg-white sm:whitespace-nowrap"
          disabled={isResetting}
          onClick={() => void handleReset()}
          type="button"
        >
          <RotateCcw className="size-4" />
          {isResetting ? "Reinitialisation..." : "Reinitialiser"}
        </button>
      </div>
    </section>
  );
}
