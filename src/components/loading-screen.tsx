"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function LoadingScreen() {
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 850);
    const hideTimer = setTimeout(() => setIsHidden(true), 1250);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-canvas transition-opacity duration-500 ease-out ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex animate-loading-pulse items-center gap-3">
        <div className="grid size-12 place-items-center rounded-xl border border-gold/30 bg-linear-to-br from-gold-soft to-gold-deep text-canvas shadow-[0_18px_45px_rgba(201,164,94,0.35)]">
          <Sparkles className="size-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-ink-muted">
            SaaSTom
          </p>
          <p className="font-display text-2xl font-semibold text-ink">
            BusinessPilot IA
          </p>
        </div>
      </div>
      <div className="h-px w-48 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-linear-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
