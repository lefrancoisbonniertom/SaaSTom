import { prisma } from "@/lib/server/prisma";
import type { Activity, CopilotProfile, Periodicity } from "@/lib/copilot";

// La table est créée à la première utilisation si la migration n'a pas encore
// été appliquée en production (même SQL que prisma/migrations/…_add_copilot_profile).
const FALLBACK_SQL = [
  `CREATE TABLE IF NOT EXISTS "CopilotProfile" (
    "userId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "revenueThisYear" INTEGER NOT NULL DEFAULT 0,
    "doneIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailReminders" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CopilotProfile_pkey" PRIMARY KEY ("userId")
  )`,
  `DO $$ BEGIN
    ALTER TABLE "CopilotProfile" ADD CONSTRAINT "CopilotProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$`,
];

let ready: Promise<void> | null = null;

export function ensureCopilotTable() {
  if (!ready) {
    ready = (async () => {
      for (const sql of FALLBACK_SQL) await prisma.$executeRawUnsafe(sql);
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

const ACTIVITIES: Activity[] = ["services", "liberal", "commerce"];
const PERIODICITIES: Periodicity[] = ["mensuelle", "trimestrielle"];

export type CopilotRecord = { profile: CopilotProfile | null; doneIds: string[]; emailReminders: boolean };

export async function getCopilot(userId: string): Promise<CopilotRecord> {
  await ensureCopilotTable();
  const row = await prisma.copilotProfile.findUnique({ where: { userId } });
  if (!row) return { profile: null, doneIds: [], emailReminders: true };
  return {
    profile: {
      activity: row.activity as Activity,
      periodicity: row.periodicity as Periodicity,
      startDate: row.startDate,
      revenueThisYear: row.revenueThisYear,
    },
    doneIds: row.doneIds,
    emailReminders: row.emailReminders,
  };
}

/** Vérifie et nettoie ce qu'envoie le navigateur. Renvoie null si c'est invalide. */
export function parseProfile(input: unknown): CopilotProfile | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;
  const activity = ACTIVITIES.find((a) => a === p.activity);
  const periodicity = PERIODICITIES.find((x) => x === p.periodicity);
  const startDate = typeof p.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.startDate) ? p.startDate : null;
  const revenue = typeof p.revenueThisYear === "number" && Number.isFinite(p.revenueThisYear) ? Math.round(p.revenueThisYear) : 0;
  if (!activity || !periodicity || !startDate) return null;
  return { activity, periodicity, startDate, revenueThisYear: Math.min(Math.max(revenue, 0), 100_000_000) };
}

export async function saveCopilot(
  userId: string,
  data: { profile?: CopilotProfile | null; doneIds?: string[]; emailReminders?: boolean },
): Promise<CopilotRecord> {
  await ensureCopilotTable();
  if (data.profile === null) {
    await prisma.copilotProfile.deleteMany({ where: { userId } });
    return { profile: null, doneIds: [], emailReminders: true };
  }
  const existing = await prisma.copilotProfile.findUnique({ where: { userId } });
  // Sans situation enregistrée, on ne peut rien mettre à jour d'autre
  if (!existing && !data.profile) return getCopilot(userId);

  const doneIds = data.doneIds?.filter((id) => typeof id === "string" && id.length <= 80).slice(0, 500);
  await prisma.copilotProfile.upsert({
    where: { userId },
    create: {
      userId,
      activity: data.profile!.activity,
      periodicity: data.profile!.periodicity,
      startDate: data.profile!.startDate,
      revenueThisYear: data.profile!.revenueThisYear,
      doneIds: doneIds ?? [],
      emailReminders: data.emailReminders ?? true,
    },
    update: {
      ...(data.profile ?? {}),
      ...(doneIds ? { doneIds } : {}),
      ...(typeof data.emailReminders === "boolean" ? { emailReminders: data.emailReminders } : {}),
    },
  });
  return getCopilot(userId);
}
