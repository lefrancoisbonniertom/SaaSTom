import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { webhookUrl: true },
  });

  if (!user?.webhookUrl) {
    return Response.json(
      { message: "Aucune URL de webhook n'est configurée." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(user.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "webhook.test",
        data: { message: "Ceci est un test envoyé depuis Orfeo." },
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return Response.json(
        { message: `Le webhook a répondu avec le statut ${response.status}.` },
        { status: 502 },
      );
    }
  } catch {
    return Response.json(
      { message: "Impossible de joindre l'URL du webhook." },
      { status: 502 },
    );
  }

  return Response.json({ message: "Webhook de test envoyé avec succès." });
}
