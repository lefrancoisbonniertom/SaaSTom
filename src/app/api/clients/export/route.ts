import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { toCsv } from "@/lib/server/csv";

export const runtime = "nodejs";

const BOM = "﻿";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["Nom", "Projet", "Montant (EUR)", "Statut", "Contact", "Prochaine action", "Tags"],
    ...clients.map((client) => [
      client.name,
      client.work,
      String(client.amount),
      client.status,
      client.contact,
      client.nextAction,
      client.tags.join("; "),
    ]),
  ];

  return new Response(BOM + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clients.csv"`,
    },
  });
}
