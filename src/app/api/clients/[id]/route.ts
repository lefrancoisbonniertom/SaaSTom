import { auth } from "@/lib/auth";
import {
  deleteClient,
  getOrfeoState,
  updateClient,
} from "@/lib/server/orfeo-repository";
import { normalizeTags, type ClientStatus } from "@/lib/orfeo-data";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const statuses: ClientStatus[] = ["Prospect", "À relancer", "En cours", "Signé"];

function isClientStatus(status: unknown): status is ClientStatus {
  return typeof status === "string" && statuses.includes(status as ClientStatus);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;
  const { id } = await context.params;

  const body = (await request.json()) as {
    name?: unknown;
    work?: unknown;
    amount?: unknown;
    status?: unknown;
    contact?: unknown;
    nextAction?: unknown;
    tags?: unknown;
  };

  try {
    await updateClient(userId, id, {
      ...(typeof body.name === "string" && { name: body.name.trim() }),
      ...(typeof body.work === "string" && { work: body.work.trim() }),
      ...(typeof body.amount === "number" && { amount: body.amount }),
      ...(isClientStatus(body.status) && { status: body.status }),
      ...(typeof body.contact === "string" && { contact: body.contact.trim() }),
      ...(typeof body.nextAction === "string" && {
        nextAction: body.nextAction.trim(),
      }),
      ...(body.tags !== undefined && { tags: normalizeTags(body.tags) }),
    });
  } catch {
    return Response.json({ message: "Client introuvable." }, { status: 404 });
  }

  const state = await getOrfeoState(userId);
  return Response.json({ state });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;
  const { id } = await context.params;

  try {
    await deleteClient(userId, id);
  } catch {
    return Response.json({ message: "Client introuvable." }, { status: 404 });
  }

  const state = await getOrfeoState(userId);
  return Response.json({ state });
}
