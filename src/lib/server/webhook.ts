import { prisma } from "@/lib/server/prisma";

export async function dispatchWebhook(
  userId: string,
  event: string,
  data: Record<string, unknown>,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { webhookUrl: true },
  });

  if (!user?.webhookUrl) {
    return;
  }

  try {
    await fetch(user.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // La livraison du webhook ne doit jamais faire échouer l'action principale.
  }
}
