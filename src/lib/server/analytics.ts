import { prisma } from "@/lib/server/prisma";

// Mesure d'audience anonyme : ni cookie, ni adresse IP, ni identifiant.
// Seuls le chemin de la page, le site d'origine et « première page de la visite » sont gardés.

const SQL = [
  `CREATE TABLE IF NOT EXISTS "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "entry" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`,
];

let ready: Promise<void> | null = null;

export function ensureAnalyticsTable() {
  if (!ready) {
    ready = (async () => {
      for (const sql of SQL) await prisma.$executeRawUnsafe(sql);
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

/** Pages publiques suivies (l'espace connecté n'est jamais mesuré). */
export function isTrackedPath(path: string) {
  return (
    path === "/" ||
    path === "/register" ||
    path === "/login" ||
    path === "/guides" ||
    /^\/guides\/[a-z0-9-]{1,80}$/.test(path) ||
    path === "/mentions-legales" ||
    path === "/cgv" ||
    path === "/confidentialite"
  );
}

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|monitor/i;

export function isBot(userAgent: string | null) {
  return !userAgent || BOT.test(userAgent);
}

/** Ne garde que le nom du site d'origine (ex. « google.com »), jamais l'adresse complète. */
export function referrerHost(referrer: unknown, ownHost: string) {
  if (typeof referrer !== "string" || !referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || host === ownHost.replace(/^www\./, "")) return null;
    return host.slice(0, 100);
  } catch {
    return null;
  }
}
