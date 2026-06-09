import {
  getSaaSTomState,
  toggleTask,
} from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const task = await toggleTask(id);
    const state = await getSaaSTomState();

    return Response.json({ task, state });
  } catch {
    return Response.json({ message: "Tache introuvable." }, { status: 404 });
  }
}
