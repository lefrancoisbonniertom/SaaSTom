export type ClientStatus = "Prospect" | "À relancer" | "En cours" | "Signé";

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
  clientId?: string;
  clientName?: string;
  content: string;
};

export type TaskRecord = {
  id: string;
  title: string;
  done: boolean;
};

export type DashboardStats = {
  dailyActivity: number[];
  activityThisWeek: number;
  newClientsThisWeek: number;
  signedRevenuePercent: number;
};

export type SaaSTomState = {
  clients: ClientRecord[];
  documents: DocumentRecord[];
  tasks: TaskRecord[];
  aiCreditsUsed: number;
  stats: DashboardStats;
};

export const promptTemplates = [
  "Transforme mes notes en devis clair",
  "Rédige une relance polie pour facture impayée",
  "Prépare une proposition commerciale courte",
  "Résume ce brief client en actions concrètes",
];

export const statusStyles: Record<ClientStatus, string> = {
  Prospect: "border-zinc-300 bg-zinc-50 text-zinc-700",
  "À relancer": "border-amber-300 bg-amber-50 text-amber-800",
  "En cours": "border-sky-300 bg-sky-50 text-sky-800",
  Signé: "border-emerald-300 bg-emerald-50 text-emerald-800",
};

export function formatCurrency(amount: number) {
  const rounded = Math.round(amount);
  const readable = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${readable} EUR`;
}

export function buildDemoDocument(prompt: string) {
  return [
    "Proposition générée en mode démo",
    "",
    `Brief reçu : ${prompt}`,
    "",
    "1. Clarifier le besoin client et le résultat attendu.",
    "2. Proposer une solution courte, lisible et actionnable.",
    "3. Terminer par une prochaine étape simple : validation, appel ou signature.",
    "",
    "Message prêt à adapter :",
    "Bonjour, merci pour votre retour. Je vous propose une approche simple : cadrer le besoin, livrer une première version rapidement, puis ajuster avec vos retours. Si cela vous convient, je peux vous envoyer une proposition détaillée aujourd'hui.",
  ].join("\n");
}

export const emptyState: SaaSTomState = {
  clients: [],
  documents: [],
  tasks: [],
  aiCreditsUsed: 0,
  stats: {
    dailyActivity: [0, 0, 0, 0, 0, 0, 0],
    activityThisWeek: 0,
    newClientsThisWeek: 0,
    signedRevenuePercent: 0,
  },
};
