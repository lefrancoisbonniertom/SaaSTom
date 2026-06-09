import { prisma } from "@/lib/server/prisma";
import {
  buildDemoDocument,
  initialClients,
  initialDocuments,
  initialState,
  initialTasks,
  type ClientRecord,
  type ClientStatus,
  type DocumentRecord,
  type SaaSTomState,
  type TaskRecord,
} from "@/lib/saastom-data";

type NewClientInput = {
  name: string;
  work: string;
  amount: number;
  status: ClientStatus;
  contact: string;
  nextAction?: string;
};

const clientStatuses = new Set<ClientStatus>([
  "Prospect",
  "A relancer",
  "En cours",
  "Signe",
]);

let seedPromise: Promise<void> | null = null;

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
    return "A l'instant";
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
  clientName: string | null;
  content: string;
}): DocumentRecord {
  return {
    id: document.id,
    title: document.title,
    type: document.type,
    createdAt: formatDateLabel(document.createdAt),
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

function initialDocumentDate(index: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - [12, 180, 1440][index]);
  return date;
}

async function seedDefaults() {
  const now = new Date();

  await prisma.client.createMany({
    data: initialClients.map((client) => ({
      ...client,
      createdAt: now,
      updatedAt: now,
    })),
  });

  await prisma.document.createMany({
    data: initialDocuments.map((document, index) => {
      const createdAt = initialDocumentDate(index);

      return {
        id: document.id,
        title: document.title,
        type: document.type,
        content: document.content,
        clientName: document.clientName,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  });

  await prisma.task.createMany({
    data: initialTasks.map((task) => ({
      ...task,
      createdAt: now,
      updatedAt: now,
    })),
  });

  await prisma.usage.create({
    data: {
      id: "default",
      aiCreditsUsed: initialState.aiCreditsUsed,
      updatedAt: now,
    },
  });
}

export async function ensureSeedData() {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    const clientCount = await prisma.client.count();

    if (clientCount > 0) {
      return;
    }

    await seedDefaults();
  })();

  return seedPromise;
}

export async function getSaaSTomState(): Promise<SaaSTomState> {
  await ensureSeedData();

  const [clients, documents, tasks, usage] = await Promise.all([
    prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.task.findMany({
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.usage.findUnique({
      where: {
        id: "default",
      },
    }),
  ]);

  return {
    clients: clients.map(toClientRecord),
    documents: documents.map(toDocumentRecord),
    tasks: tasks.map(toTaskRecord),
    aiCreditsUsed: usage?.aiCreditsUsed ?? 0,
  };
}

export async function createClient(input: NewClientInput) {
  const client = await prisma.client.create({
    data: {
      name: input.name,
      work: input.work,
      amount: input.amount,
      status: input.status,
      contact: input.contact,
      nextAction: input.nextAction ?? "Definir la prochaine action.",
    },
  });

  return toClientRecord(client);
}

export async function generateDocument(prompt: string, type = "Document IA") {
  const document = await prisma.document.create({
    data: {
      title: prompt.slice(0, 46) || "Nouveau document IA",
      type,
      content: buildDemoDocument(prompt),
    },
  });

  await prisma.usage.upsert({
    where: {
      id: "default",
    },
    update: {
      aiCreditsUsed: {
        increment: 1,
      },
    },
    create: {
      id: "default",
      aiCreditsUsed: 1,
    },
  });

  return toDocumentRecord(document);
}

export async function toggleTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      done: !task.done,
    },
  });

  return toTaskRecord(updatedTask);
}

export async function resetSaaSTomDemo() {
  seedPromise = null;

  await prisma.document.deleteMany();
  await prisma.client.deleteMany();
  await prisma.task.deleteMany();
  await prisma.usage.deleteMany();
  await seedDefaults();

  return getSaaSTomState();
}
