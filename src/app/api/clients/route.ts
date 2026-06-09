import { createClient, getSaaSTomState } from "@/lib/server/saastom-repository";
import type { ClientStatus } from "@/lib/saastom-data";

export const runtime = "nodejs";

const statuses: ClientStatus[] = [
  "Prospect",
  "A relancer",
  "En cours",
  "Signe",
];

function isClientStatus(status: unknown): status is ClientStatus {
  return typeof status === "string" && statuses.includes(status as ClientStatus);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: unknown;
    work?: unknown;
    amount?: unknown;
    status?: unknown;
    contact?: unknown;
    nextAction?: unknown;
  };

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const work = typeof body.work === "string" ? body.work.trim() : "";

  if (!name || !work) {
    return Response.json(
      { message: "Le nom et le projet sont obligatoires." },
      { status: 400 },
    );
  }

  const client = await createClient({
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
  });
  const state = await getSaaSTomState();

  return Response.json({ client, state }, { status: 201 });
}
