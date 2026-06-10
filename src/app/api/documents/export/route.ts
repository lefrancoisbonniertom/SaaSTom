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

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["Titre", "Type", "Client", "Date de création", "Contenu"],
    ...documents.map((document) => [
      document.title,
      document.type,
      document.clientName ?? "",
      document.createdAt.toISOString(),
      document.content,
    ]),
  ];

  return new Response(BOM + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="documents.csv"`,
    },
  });
}
