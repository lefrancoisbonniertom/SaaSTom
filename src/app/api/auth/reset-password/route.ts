import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: unknown; password?: unknown };
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!token || !password) {
    return Response.json({ error: "Lien invalide." }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return Response.json({ error: "Ce lien a expiré ou est invalide." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });
  await prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });

  return Response.json({ ok: true });
}
