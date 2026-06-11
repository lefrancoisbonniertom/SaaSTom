import { auth } from "@/lib/auth";
import { deleteTask, getOrfeoState, toggleTask } from "@/lib/server/orfeo-repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;

  const { id } = await context.params;

  try {
    const task = await toggleTask(userId, id);
    const state = await getOrfeoState(userId);
    return Response.json({ task, state });
  } catch {
    return Response.json({ message: "Tache introuvable." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;

  const { id } = await context.params;

  try {
    await deleteTask(userId, id);
    const state = await getOrfeoState(userId);
    return Response.json({ state });
  } catch {
    return Response.json({ message: "Tache introuvable." }, { status: 404 });
  }
}
