import { generateAndSendOtp } from "@/lib/server/otp";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Email invalide." }, { status: 400 });
  }

  try {
    const { throttled } = await generateAndSendOtp(email);
    if (throttled) {
      return Response.json(
        { error: "Un code vient d'être envoyé. Patiente quelques secondes." },
        { status: 429 },
      );
    }
  } catch (error) {
    console.error("[otp] envoi échoué", error);
    return Response.json(
      { error: "Impossible d'envoyer le code. Réessaie." },
      { status: 500 },
    );
  }

  // On ne révèle pas si l'email correspond à un compte existant.
  return Response.json({ ok: true });
}
