import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: unknown;
    password?: unknown;
    name?: unknown;
  };

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!email || !password) {
    return Response.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ error: "Le mot de passe doit faire au moins 8 caractères." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Cet email est déjà utilisé." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name: name || email, password: hashedPassword },
  });

  return Response.json({ id: user.id }, { status: 201 });
}
