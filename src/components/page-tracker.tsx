"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Mesure d'audience anonyme des pages publiques (voir /api/track).
// Aucun cookie : un simple indicateur de session dans l'onglet sert à compter les visites.
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    let entry = false;
    try {
      entry = !window.sessionStorage.getItem("orfeo-visit");
      window.sessionStorage.setItem("orfeo-visit", "1");
    } catch {
      // stockage indisponible : la page est comptée sans « entrée »
    }
    const payload = JSON.stringify({ path: pathname, referrer: entry ? document.referrer : "", entry });
    try {
      const sent = navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "text/plain" }));
      if (!sent) void fetch("/api/track", { method: "POST", body: payload, keepalive: true });
    } catch {
      // une mesure perdue n'a aucune importance
    }
  }, [pathname]);

  return null;
}
