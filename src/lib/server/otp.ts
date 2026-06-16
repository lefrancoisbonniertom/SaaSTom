import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/prisma";
import { sendOtpEmail } from "@/lib/server/email";

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_MS = 30_000;

function generateCode(): string {
  // Code à 6 chiffres, sans biais (000000–999999).
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Génère un code OTP, le stocke (hashé) et l'envoie par email.
 * Renvoie `{ throttled: true }` si un code a déjà été envoyé il y a moins de 30 s.
 */
export async function generateAndSendOtp(
  rawEmail: string,
): Promise<{ throttled: boolean }> {
  const email = normalizeEmail(rawEmail);

  const recent = await prisma.emailOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (recent && Date.now() - recent.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return { throttled: true };
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Un seul code valide à la fois par email.
  await prisma.emailOtp.deleteMany({ where: { email } });
  await prisma.emailOtp.create({ data: { email, codeHash, expiresAt } });

  await sendOtpEmail(email, code);

  return { throttled: false };
}

/**
 * Vérifie un code OTP. En cas de succès, supprime tous les codes de cet email.
 */
export async function verifyOtp(
  rawEmail: string,
  code: string,
): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  if (!/^\d{6}$/.test(code)) return false;

  const otp = await prisma.emailOtp.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return false;
  if (otp.expiresAt.getTime() < Date.now()) {
    await prisma.emailOtp.deleteMany({ where: { email } });
    return false;
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.emailOtp.deleteMany({ where: { email } });
    return false;
  }

  const valid = await bcrypt.compare(code, otp.codeHash);

  if (!valid) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.emailOtp.deleteMany({ where: { email } });
  return true;
}
