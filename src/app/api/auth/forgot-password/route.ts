import { randomBytes } from "crypto";
import { prisma } from "@/lib/server/prisma";
import { sendPasswordResetEmail } from "@/lib/server/email";

export const runtime = "nodejs";

const TOKEN_TTL_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return Response.json({ error: "Email requis." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return Response.json({ ok: true });
}
