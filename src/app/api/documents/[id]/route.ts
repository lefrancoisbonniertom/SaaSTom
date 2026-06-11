import { auth } from "@/lib/auth";
import {
  deleteDocument,
  getSaaSTomState,
  updateDocument,
} from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;
  const { id } = await context.params;

  const body = (await request.json()) as {
    title?: unknown;
    content?: unknown;
  };

  try {
    await updateDocument(userId, id, {
      ...(typeof body.title === "string" && { title: body.title.trim() }),
      ...(typeof body.content === "string" && { content: body.content }),
    });
  } catch {
    return Response.json({ message: "Document introuvable." }, { status: 404 });
  }

  const state = await getSaaSTomState(userId);
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
    await deleteDocument(userId, id);
  } catch {
    return Response.json({ message: "Document introuvable." }, { status: 404 });
  }

  const state = await getSaaSTomState(userId);
  return Response.json({ state });
}
