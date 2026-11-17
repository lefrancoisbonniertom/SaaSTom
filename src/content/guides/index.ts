import type { ComponentType } from "react";
import type { GuideMeta } from "./types";
import Calendrier, { meta as calendrier } from "./calendrier-micro-entrepreneur";
import Tva, { meta as tva } from "./seuil-tva-micro-entrepreneur";
import Cfe, { meta as cfe } from "./cfe-micro-entrepreneur";

export type Guide = GuideMeta & { Content: ComponentType };

// Ordre d'affichage dans la rubrique
export const GUIDES: Guide[] = [
  { ...calendrier, Content: Calendrier },
  { ...tva, Content: Tva },
  { ...cfe, Content: Cfe },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export const SITE_URL = "https://orfeo.digitaleweb.fr";

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
