import { auth } from "@/lib/auth";
import { createClient, getSaaSTomState } from "@/lib/server/saastom-repository";
import { normalizeTags, type ClientStatus } from "@/lib/saastom-data";

export const runtime = "nodejs";

const statuses: ClientStatus[] = ["Prospect", "À relancer", "En cours", "Signé"];

function isClientStatus(status: unknown): status is ClientStatus {
  return typeof status === "string" && statuses.includes(status as ClientStatus);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;

  const body = (await request.json()) as {
    name?: unknown;
    work?: unknown;
    amount?: unknown;
    status?: unknown;
    contact?: unknown;
    nextAction?: unknown;
    tags?: unknown;
  };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const work = typeof body.work === "string" ? body.work.trim() : "";

  if (!name || !work) {
    return Response.json(
      { message: "Le nom et le projet sont obligatoires." },
      { status: 400 },
    );
  }

  const client = await createClient(userId, {
    name,
    work,
    amount: typeof body.amount === "number" ? body.amount : 0,
    status: isClientStatus(body.status) ? body.status : "Prospect",
    contact:
      typeof body.contact === "string" && body.contact.trim()
        ? body.contact.trim()
        : "contact@client.fr",
    nextAction:
      typeof body.nextAction === "string" && body.nextAction.trim()
        ? body.nextAction.trim()
        : undefined,
    tags: normalizeTags(body.tags),
  });
  const state = await getSaaSTomState(userId);

  return Response.json({ client, state }, { status: 201 });
}
