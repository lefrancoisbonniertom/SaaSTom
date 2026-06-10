import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import {
  generateDocument,
  getSaaSTomState,
} from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

const FREE_PLAN_LIMIT = 10;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  const userId = session.user.id;

  const [usage, user] = await Promise.all([
    prisma.usage.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { plan: true } }),
  ]);

  const isPaid = user?.plan === "pro" || user?.plan === "business";

  if (!isPaid && (usage?.aiCreditsUsed ?? 0) >= FREE_PLAN_LIMIT) {
    return Response.json(
      {
        message:
          "Tu as atteint la limite de 10 générations gratuites. Passe au plan Pro pour continuer.",
      },
      { status: 402 },
    );
  }

  const body = (await request.json()) as {
    prompt?: unknown;
    type?: unknown;
    clientId?: unknown;
  };
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return Response.json({ message: "Le brief est obligatoire." }, { status: 400 });
  }

  const document = await generateDocument(
    userId,
    prompt,
    typeof body.type === "string" ? body.type : "Document IA",
    typeof body.clientId === "string" && body.clientId ? body.clientId : undefined,
  );
  const state = await getSaaSTomState(userId);

  return Response.json({ document, state }, { status: 201 });
}
