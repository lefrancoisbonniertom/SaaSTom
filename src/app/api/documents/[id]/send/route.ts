import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";
import { renderDocumentPdf, slugifyDocumentTitle } from "@/lib/server/document-pdf";
import { sendDocumentEmail } from "@/lib/server/email";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const { id } = await context.params;
  const document = await prisma.document.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true },
  });

  if (!document) {
    return Response.json({ message: "Document introuvable." }, { status: 404 });
  }

  const recipient = document.client?.contact.trim();

  if (!recipient || !EMAIL_REGEX.test(recipient)) {
    return Response.json(
      { message: "Aucune adresse email valide n'est associée à ce client." },
      { status: 400 },
    );
  }

  const buffer = await renderDocumentPdf({
    title: document.title,
    type: document.type,
    content: document.content,
    clientName: document.clientName,
    createdAt: document.createdAt,
  });

  await sendDocumentEmail({
    to: recipient,
    documentTitle: document.title,
    documentType: document.type,
    clientName: document.clientName,
    pdfBuffer: buffer,
    pdfFilename: `${slugifyDocumentTitle(document.title)}.pdf`,
  });

  return Response.json({ message: `Document envoyé à ${recipient}.` });
}
