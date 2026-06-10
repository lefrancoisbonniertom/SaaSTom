import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { renderDocumentPdf, slugifyDocumentTitle } from "@/lib/server/document-pdf";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const document = await prisma.document.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!document) {
    return Response.json({ message: "Document introuvable." }, { status: 404 });
  }

  const buffer = await renderDocumentPdf({
    title: document.title,
    type: document.type,
    content: document.content,
    clientName: document.clientName,
    createdAt: document.createdAt,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slugifyDocumentTitle(document.title)}.pdf"`,
    },
  });
}
