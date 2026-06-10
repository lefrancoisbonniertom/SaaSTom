import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as { webhookUrl?: unknown };
  const webhookUrl =
    typeof body.webhookUrl === "string" ? body.webhookUrl.trim() : "";

  if (webhookUrl && !/^https?:\/\//i.test(webhookUrl)) {
    return Response.json(
      { message: "L'URL du webhook doit commencer par http:// ou https://." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { webhookUrl: webhookUrl || null },
    select: { webhookUrl: true },
  });

  return Response.json({ webhookUrl: user.webhookUrl });
}
