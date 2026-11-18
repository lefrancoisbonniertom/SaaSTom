// Copilote administratif : calcule les échéances d'un micro-entrepreneur
// à partir de quelques informations. Règles vérifiées le 17 novembre 2026
// sur entreprendre.service-public.gouv.fr et impots.gouv.fr (voir /guides).

export type Activity = "services" | "liberal" | "commerce";
export type Periodicity = "mensuelle" | "trimestrielle";

export type CopilotProfile = {
  activity: Activity;
  periodicity: Periodicity;
  /** Date de début d'activité (AAAA-MM-JJ) */
  startDate: string;
  /** Chiffre d'affaires encaissé depuis le 1er janvier (HT) */
  revenueThisYear: number;
};

export type Category = "urssaf" | "cfe" | "impots" | "tva" | "facture";

export type Deadline = {
  id: string;
  date: Date;
  title: string;
  detail: string;
  category: Category;
  guide?: string;
  /** Date indicative (fixée chaque année par l'administration) */
  approx?: boolean;
};

export const ACTIVITY_LABELS: Record<Activity, string> = {
  services: "Prestations de services (artisan, commerçant de services)",
  liberal: "Activité libérale (consultant, développeur, coach…)",
  commerce: "Vente de marchandises, restauration, hébergement",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  urssaf: "Urssaf",
  cfe: "CFE",
  impots: "Impôts",
  tva: "TVA",
  facture: "Facturation",
};

/** Seuils de franchise en base de TVA 2026 (inchangés par rapport à 2025). */
export const VAT_THRESHOLDS: Record<Activity, { base: number; major: number }> = {
  services: { base: 37_500, major: 41_250 },
  liberal: { base: 37_500, major: 41_250 },
  commerce: { base: 85_000, major: 93_500 },
};

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « de mars », « d'avril » */
function deMonth(m: number) {
  return /^[aeiouéo]/i.test(MONTHS[m]) ? `d'${MONTHS[m]}` : `de ${MONTHS[m]}`;
}

/** Dernier jour du mois (mois de 0 à 11, peut déborder sur l'année suivante). */
function endOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0, 12);
}

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12);
}

export function formatDay(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function daysUntil(date: Date, from = new Date()) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Échéances Urssaf (déclaration du chiffre d'affaires). */
function urssafDeadlines(p: CopilotProfile, from: Date, to: Date): Deadline[] {
  const start = parseDate(p.startDate);
  const out: Deadline[] = [];

  if (p.periodicity === "mensuelle") {
    // Première déclaration : fin du mois qui suit les 3 premiers mois d'activité
    const firstFullMonth = start.getDate() === 1 ? start.getMonth() : start.getMonth() + 1;
    const first = endOfMonth(start.getFullYear(), firstFullMonth + 3);
    for (let y = from.getFullYear() - 1; y <= to.getFullYear(); y++) {
      for (let m = 0; m < 12; m++) {
        const due = endOfMonth(y, m + 1); // CA du mois m, à déclarer avant la fin du mois suivant
        if (due < first) continue;
        const isFirst = due.getTime() === first.getTime();
        out.push({
          id: `urssaf-${y}-${m}`,
          date: due,
          title: isFirst ? "Première déclaration Urssaf" : `Déclarer le CA ${deMonth(m)}`,
          detail: isFirst
            ? "Elle regroupe vos premiers mois d'activité. À faire même si vous n'avez rien encaissé (indiquez 0)."
            : `Chiffre d'affaires encaissé en ${MONTHS[m]} ${y}, sur autoentrepreneur.urssaf.fr. À faire même à 0 €.`,
          category: "urssaf",
          guide: isFirst ? "premiere-declaration-urssaf" : "calendrier-micro-entrepreneur",
        });
      }
    }
  } else {
    // Trimestres : T1 → 30 avril, T2 → 31 juillet, T3 → 31 octobre, T4 → 31 janvier
    const startQuarter = Math.floor(start.getMonth() / 3);
    const firstQuarterIndex = start.getFullYear() * 4 + startQuarter + 1; // trimestre suivant celui de la création
    for (let y = from.getFullYear() - 1; y <= to.getFullYear(); y++) {
      for (let q = 0; q < 4; q++) {
        const qIndex = y * 4 + q;
        if (qIndex < firstQuarterIndex) continue;
        const due = endOfMonth(y, q * 3 + 3);
        const isFirst = qIndex === firstQuarterIndex;
        const months = `${MONTHS[q * 3]} à ${MONTHS[q * 3 + 2]}`;
        out.push({
          id: `urssaf-${y}-t${q + 1}`,
          date: due,
          title: isFirst ? "Première déclaration Urssaf" : `Déclarer le CA du ${q + 1}${q === 0 ? "er" : "e"} trimestre`,
          detail: isFirst
            ? "Elle couvre le trimestre de création et le suivant. À faire même si vous n'avez rien encaissé (indiquez 0)."
            : `Chiffre d'affaires encaissé de ${months} ${y}, sur autoentrepreneur.urssaf.fr. À faire même à 0 €.`,
          category: "urssaf",
          guide: isFirst ? "premiere-declaration-urssaf" : "calendrier-micro-entrepreneur",
        });
      }
    }
  }
  return out;
}

/** Toutes les échéances entre aujourd'hui et dans 12 mois, triées. */
export function computeDeadlines(p: CopilotProfile, from = new Date(), months = 12): Deadline[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0);
  const to = new Date(today.getFullYear(), today.getMonth() + months, today.getDate(), 23);
  const start = parseDate(p.startDate);
  const creationYear = start.getFullYear();
  const list: Deadline[] = [...urssafDeadlines(p, today, to)];

  for (let y = today.getFullYear(); y <= to.getFullYear(); y++) {
    // Déclaration initiale de CFE, l'année de création
    if (y === creationYear) {
      list.push({
        id: `cfe-1447-${y}`,
        date: new Date(y, 11, 31, 12),
        title: "Déclaration initiale de CFE (1447-C-SD)",
        detail: "À envoyer à votre service des impôts des entreprises. Elle ouvre droit à l'exonération de la première année.",
        category: "cfe",
        guide: "cfe-micro-entrepreneur",
      });
    }
    // CFE à payer à partir de la 2e année
    if (y > creationYear) {
      list.push({
        id: `cfe-${y}`,
        date: new Date(y, 11, 15, 12),
        title: "Payer la CFE",
        detail:
          y === creationYear + 1
            ? "Deuxième année : base réduite de moitié. L'avis est dans votre espace impots.gouv.fr (pas de courrier)."
            : "L'avis est dans votre espace impots.gouv.fr (pas de courrier). Exonération si votre CA de l'année N-2 ≤ 5 000 €.",
        category: "cfe",
        guide: "cfe-micro-entrepreneur",
      });
    }
    // Repasser en déclaration mensuelle (seulement pour le trimestriel)
    if (p.periodicity === "trimestrielle") {
      list.push({
        id: `periodicite-${y}`,
        date: new Date(y, 9, 31, 12),
        title: "Dernier jour pour repasser en mensuel",
        detail: `Si vous préférez déclarer chaque mois à partir de janvier ${y + 1}, la demande doit être faite à l'Urssaf avant cette date.`,
        category: "urssaf",
        guide: "calendrier-micro-entrepreneur",
      });
    }
    // Déclaration de revenus (date indicative)
    if (y > creationYear) {
      list.push({
        id: `ir-${y}`,
        date: new Date(y, 4, 31, 12),
        title: "Déclaration de revenus",
        detail: `Reportez votre chiffre d'affaires ${y - 1} dans la partie « professions non salariées ». Les dates exactes (mai – juin) sont fixées chaque année : vérifiez-les sur impots.gouv.fr.`,
        category: "impots",
        guide: "calendrier-micro-entrepreneur",
        approx: true,
      });
    }
  }

  // Facture électronique : émission obligatoire pour les micro-entreprises
  list.push({
    id: "facture-electronique-2027",
    date: new Date(2027, 8, 1, 12),
    title: "Facture électronique obligatoire",
    detail: "Les micro-entreprises doivent émettre leurs factures via une plateforme agréée. Choisissez-la à l'avance (logiciel, banque ou expert-comptable).",
    category: "facture",
    guide: "calendrier-micro-entrepreneur",
  });

  return list
    .filter((d) => d.date >= today && d.date <= to && d.date >= start)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export type VatStatus = {
  base: number;
  major: number;
  ratio: number;
  level: "ok" | "watch" | "base" | "major";
  message: string;
};

/** Où en est-on par rapport aux seuils de TVA ? */
export function vatStatus(p: CopilotProfile): VatStatus {
  const { base, major } = VAT_THRESHOLDS[p.activity];
  const ca = Math.max(0, p.revenueThisYear || 0);
  const ratio = ca / base;
  const fmt = (n: number) => `${n.toLocaleString("fr-FR")} €`;
  if (ca > major)
    return {
      base,
      major,
      ratio,
      level: "major",
      message: `Seuil majoré (${fmt(major)}) dépassé : la TVA s'applique depuis le jour du dépassement. Demandez votre numéro de TVA et facturez-la.`,
    };
  if (ca > base)
    return {
      base,
      major,
      ratio,
      level: "base",
      message: `Seuil de base (${fmt(base)}) dépassé : vous restez en franchise cette année, la TVA s'appliquera au 1er janvier prochain. Attention au seuil majoré de ${fmt(major)}.`,
    };
  if (ratio >= 0.8)
    return {
      base,
      major,
      ratio,
      level: "watch",
      message: `Vous approchez du seuil de ${fmt(base)} : il vous reste ${fmt(base - ca)} avant de devoir facturer la TVA l'an prochain.`,
    };
  return {
    base,
    major,
    ratio,
    level: "ok",
    message: `Vous êtes en franchise de TVA. Marge restante avant le seuil : ${fmt(base - ca)}.`,
  };
}

/** Fichier calendrier (.ics) avec un rappel 3 jours avant chaque échéance. */
export function buildIcs(deadlines: Deadline[]) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const next = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Orfeo//Copilote administratif//FR",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Orfeo · Mes échéances",
  ];
  for (const d of deadlines) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${d.id}@orfeo.digitaleweb.fr`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day(d.date)}`,
      `DTEND;VALUE=DATE:${day(next(d.date))}`,
      `SUMMARY:${esc(d.title)}`,
      `DESCRIPTION:${esc(d.detail + (d.guide ? `\n\nGuide : https://orfeo.digitaleweb.fr/guides/${d.guide}` : ""))}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(d.title)}`,
      "TRIGGER:-P3D",
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
