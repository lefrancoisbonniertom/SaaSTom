export type ClientStatus = "Prospect" | "A relancer" | "En cours" | "Signe";

export type ClientRecord = {
  id: string;
  name: string;
  work: string;
  amount: number;
  status: ClientStatus;
  contact: string;
  nextAction: string;
};

export type DocumentRecord = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  clientName?: string;
  content: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  done: boolean;
};

export type SaaSTomState = {
  clients: ClientRecord[];
  documents: DocumentRecord[];
  tasks: TaskRecord[];
  aiCreditsUsed: number;
};

export const initialClients: ClientRecord[] = [
  {
    id: "client-atelier-moreau",
    name: "Atelier Moreau",
    work: "Refonte devis + proposition",
    amount: 2400,
    status: "A relancer",
    contact: "camille@atelier-moreau.fr",
    nextAction: "Verifier le devis puis relancer vendredi.",
  },
  {
    id: "client-nova-studio",
    name: "Nova Studio",
    work: "Pack social media",
    amount: 950,
    status: "En cours",
    contact: "hello@novastudio.fr",
    nextAction: "Envoyer 3 idees de posts LinkedIn.",
  },
  {
    id: "client-maison-leroux",
    name: "Maison Leroux",
    work: "Facture mensuelle",
    amount: 1280,
    status: "Signe",
    contact: "contact@maisonleroux.fr",
    nextAction: "Preparer la facture de fin de mois.",
  },
];

export const initialDocuments: DocumentRecord[] = [
  {
    id: "doc-relance-2026-018",
    title: "Relance facture #2026-018",
    type: "Email client",
    createdAt: "Il y a 12 min",
    clientName: "Maison Leroux",
    content:
      "Bonjour,\n\nJe me permets de revenir vers vous concernant la facture #2026-018. Pouvez-vous me confirmer sa bonne reception et la date de reglement prevue ?\n\nMerci beaucoup,\nTom",
  },
  {
    id: "doc-proposition-nova",
    title: "Proposition commerciale Nova",
    type: "Offre IA",
    createdAt: "Aujourd'hui",
    clientName: "Nova Studio",
    content:
      "Objectif : structurer un mois de contenus courts pour LinkedIn.\n\nLivrables : calendrier editorial, 8 posts, 3 variantes d'accroche et une proposition de rythme de publication.",
  },
  {
    id: "doc-devis-atelier",
    title: "Devis Atelier Moreau",
    type: "Document",
    createdAt: "Hier",
    clientName: "Atelier Moreau",
    content:
      "Prestation : refonte du devis client et clarification de la proposition commerciale.\n\nMontant estime : 2 400 EUR HT.",
  },
];

export const initialTasks: TaskRecord[] = [
  {
    id: "task-atelier",
    title: "Verifier le devis Atelier Moreau",
    done: false,
  },
  {
    id: "task-leroux",
    title: "Envoyer la relance facture a Maison Leroux",
    done: false,
  },
  {
    id: "task-nova",
    title: "Preparer 3 posts LinkedIn pour Nova Studio",
    done: false,
  },
];

export const promptTemplates = [
  "Transforme mes notes en devis clair",
  "Redige une relance polie pour facture impayee",
  "Prepare une proposition commerciale courte",
  "Resume ce brief client en actions concretes",
];

export const statusStyles: Record<ClientStatus, string> = {
  Prospect: "border-zinc-300 bg-zinc-50 text-zinc-700",
  "A relancer": "border-amber-300 bg-amber-50 text-amber-800",
  "En cours": "border-sky-300 bg-sky-50 text-sky-800",
  Signe: "border-emerald-300 bg-emerald-50 text-emerald-800",
};

export function formatCurrency(amount: number) {
  const rounded = Math.round(amount);
  const readable = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${readable} EUR`;
}

export function buildDemoDocument(prompt: string) {
  return [
    "Proposition generee en mode demo",
    "",
    `Brief recu : ${prompt}`,
    "",
    "1. Clarifier le besoin client et le resultat attendu.",
    "2. Proposer une solution courte, lisible et actionnable.",
    "3. Terminer par une prochaine etape simple : validation, appel ou signature.",
    "",
    "Message pret a adapter :",
    "Bonjour, merci pour votre retour. Je vous propose une approche simple : cadrer le besoin, livrer une premiere version rapidement, puis ajuster avec vos retours. Si cela vous convient, je peux vous envoyer une proposition detaillee aujourd'hui.",
  ].join("\n");
}

export const initialState: SaaSTomState = {
  clients: initialClients,
  documents: initialDocuments,
  tasks: initialTasks,
  aiCreditsUsed: 3,
};
