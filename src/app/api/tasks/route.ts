import { auth } from "@/lib/auth";
import { createTask, getSaaSTomState } from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;

  const body = (await request.json()) as { title?: unknown };
  const title = typeof body.title === "string" ? body.title.trim() : "";

  if (!title) {
    return Response.json(
      { message: "Le titre de la tâche est obligatoire." },
      { status: 400 },
    );
  }

  const task = await createTask(userId, title);
  const state = await getSaaSTomState(userId);

  return Response.json({ task, state }, { status: 201 });
}
