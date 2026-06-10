import Groq from "groq-sdk";
import { prisma } from "@/lib/server/prisma";
import {
  buildDemoDocument,
  type ClientRecord,
  type ClientStatus,
  type DashboardStats,
  type DocumentRecord,
  type SaaSTomState,
  type TaskRecord,
} from "@/lib/saastom-data";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateWithGroq(
  prompt: string
): Promise<{ title: string; content: string }> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Tu es un assistant IA intégré à SaaSTom, un CRM et outil de productivité pour freelances et indépendants français.

Mission : À partir d'un brief utilisateur, génère un document professionnel complet, prêt à l'emploi : relance client, proposition commerciale, devis descriptif, email de suivi, brief projet, compte-rendu, etc.

Réponds UNIQUEMENT avec un objet JSON valide :
{"title": "Titre court et descriptif (55 caractères max)", "content": "Contenu complet du document"}

Critères :
- Écris en français, ton professionnel
- Adapte le registre au type (formel pour devis, chaleureux pour relance)
- Le contenu doit être directement envoyable au client ou utilisable`,
      },
      { role: "user", content: prompt },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    return {
      title:
        typeof parsed.title === "string"
          ? parsed.title.slice(0, 55)
          : prompt.slice(0, 46),
      content:
        typeof parsed.content === "string" ? parsed.content : text,
    };
  } catch {
    return {
      title: prompt.slice(0, 46) || "Document IA",
      content: text || buildDemoDocument(prompt),
    };
  }
}

type NewClientInput = {
  name: string;
  work: string;
  amount: number;
  status: ClientStatus;
  contact: string;
  nextAction?: string;
};

type ClientUpdateInput = Partial<{
  name: string;
  work: string;
  amount: number;
  status: ClientStatus;
  contact: string;
  nextAction: string;
}>;

const clientStatuses = new Set<ClientStatus>([
  "Prospect",
  "À relancer",
  "En cours",
  "Signé",
]);

const seedPromises = new Map<string, Promise<void>>();

function normalizeStatus(status: string): ClientStatus {
  if (clientStatuses.has(status as ClientStatus)) {
    return status as ClientStatus;
  }

  return "Prospect";
}

function formatDateLabel(date: Date) {
  const now = Date.now();
  const diffInMinutes = Math.max(0, Math.round((now - date.getTime()) / 60000));

  if (diffInMinutes < 1) {
    return "À l'instant";
  }

  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function toClientRecord(client: {
  id: string;
  name: string;
  work: string;
  amount: number;
  status: string;
  contact: string;
  nextAction: string;
}): ClientRecord {
  return {
    id: client.id,
    name: client.name,
    work: client.work,
    amount: client.amount,
    status: normalizeStatus(client.status),
    contact: client.contact,
    nextAction: client.nextAction,
  };
}

function toDocumentRecord(document: {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  clientId: string | null;
  clientName: string | null;
  content: string;
}): DocumentRecord {
  return {
    id: document.id,
    title: document.title,
    type: document.type,
    createdAt: formatDateLabel(document.createdAt),
    clientId: document.clientId ?? undefined,
    clientName: document.clientName ?? undefined,
    content: document.content,
  };
}

function toTaskRecord(task: {
  id: string;
  title: string;
  done: boolean;
}): TaskRecord {
  return {
    id: task.id,
    title: task.title,
    done: task.done,
  };
}

function computeDashboardStats(
  clients: { amount: number; status: string; createdAt: Date }[],
  documents: { createdAt: Date }[],
): DashboardStats {
  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyActivity: number[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const dayStart = new Date(today.getTime() - i * dayMs);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const count =
      clients.filter((client) => client.createdAt >= dayStart && client.createdAt < dayEnd).length +
      documents.filter((document) => document.createdAt >= dayStart && document.createdAt < dayEnd).length;
    dailyActivity.push(count);
  }

  const weekStart = new Date(today.getTime() - 6 * dayMs);
  const newClientsThisWeek = clients.filter((client) => client.createdAt >= weekStart).length;

  const totalRevenue = clients.reduce((sum, client) => sum + client.amount, 0);
  const signedRevenue = clients
    .filter((client) => client.status === "Signé")
    .reduce((sum, client) => sum + client.amount, 0);

  return {
    dailyActivity,
    activityThisWeek: dailyActivity.reduce((sum, count) => sum + count, 0),
    newClientsThisWeek,
    signedRevenuePercent: totalRevenue > 0 ? Math.round((signedRevenue / totalRevenue) * 100) : 0,
  };
}

async function ensureUsage(userId: string) {
  const existing = seedPromises.get(userId);
  if (existing) return existing;

  const promise = (async () => {
    const usage = await prisma.usage.findUnique({ where: { userId } });
    if (!usage) {
      await prisma.usage.create({
        data: { userId, aiCreditsUsed: 0, updatedAt: new Date() },
      });
    }
  })();

  seedPromises.set(userId, promise);
  return promise;
}

export async function getSaaSTomState(userId: string): Promise<SaaSTomState> {
  await ensureUsage(userId);

  const [clients, documents, tasks, usage] = await Promise.all([
    prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.usage.findUnique({ where: { userId } }),
  ]);

  return {
    clients: clients.map(toClientRecord),
    documents: documents.map(toDocumentRecord),
    tasks: tasks.map(toTaskRecord),
    aiCreditsUsed: usage?.aiCreditsUsed ?? 0,
    stats: computeDashboardStats(clients, documents),
  };
}

export async function createClient(userId: string, input: NewClientInput) {
  const client = await prisma.client.create({
    data: {
      userId,
      name: input.name,
      work: input.work,
      amount: input.amount,
      status: input.status,
      contact: input.contact,
      nextAction: input.nextAction ?? "Définir la prochaine action.",
    },
  });

  return toClientRecord(client);
}

export async function updateClient(
  userId: string,
  clientId: string,
  input: ClientUpdateInput,
) {
  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });

  if (!existing) {
    throw new Error("Client not found");
  }

  const client = await prisma.client.update({
    where: { id: clientId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.work !== undefined && { work: input.work }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.contact !== undefined && { contact: input.contact }),
      ...(input.nextAction !== undefined && { nextAction: input.nextAction }),
    },
  });

  if (input.name !== undefined) {
    await prisma.document.updateMany({
      where: { clientId, userId },
      data: { clientName: input.name },
    });
  }

  return toClientRecord(client);
}

export async function deleteClient(userId: string, clientId: string) {
  const existing = await prisma.client.findFirst({
    where: { id: clientId, userId },
  });

  if (!existing) {
    throw new Error("Client not found");
  }

  await prisma.client.delete({ where: { id: clientId } });
}

export async function generateDocument(
  userId: string,
  prompt: string,
  type = "Document IA",
  clientId?: string,
) {
  let title: string;
  let content: string;

  if (process.env.GROQ_API_KEY) {
    const result = await generateWithGroq(prompt);
    title = result.title;
    content = result.content;
  } else {
    title = prompt.slice(0, 46) || "Nouveau document IA";
    content = buildDemoDocument(prompt);
  }

  let linkedClient: { id: string; name: string } | null = null;
  if (clientId) {
    linkedClient = await prisma.client.findFirst({
      where: { id: clientId, userId },
      select: { id: true, name: true },
    });
  }

  const document = await prisma.document.create({
    data: {
      userId,
      title,
      type,
      content,
      clientId: linkedClient?.id,
      clientName: linkedClient?.name,
    },
  });

  await prisma.usage.upsert({
    where: { userId },
    update: { aiCreditsUsed: { increment: 1 } },
    create: { userId, aiCreditsUsed: 1 },
  });

  return toDocumentRecord(document);
}

export async function toggleTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { done: !task.done },
  });

  return toTaskRecord(updatedTask);
}

export async function createTask(userId: string, title: string) {
  const task = await prisma.task.create({
    data: { userId, title },
  });

  return toTaskRecord(task);
}

export async function deleteTask(userId: string, taskId: string) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new Error("Task not found");
  }

  await prisma.task.delete({ where: { id: taskId } });
}

