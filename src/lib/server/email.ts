import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM ?? "SaaSTom <onboarding@resend.dev>";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  business: "Business",
};

function wrapEmail(title: string, body: string) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background-color: #f3f5ef; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #dfe4d8; border-radius: 12px; overflow: hidden;">
        <div style="background: #17201b; padding: 20px 24px;">
          <span style="color: #ffffff; font-size: 18px; font-weight: 700;">SaaSTom</span>
        </div>
        <div style="padding: 24px;">
          <h1 style="font-size: 18px; color: #17201b; margin: 0 0 12px;">${title}</h1>
          ${body}
        </div>
      </div>
    </div>
  `;
}

export async function sendPlanUpgradeEmail(to: string, plan: string) {
  if (!resend) return;

  const planLabel = PLAN_LABELS[plan] ?? plan;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Bienvenue dans le plan ${planLabel}`,
    html: wrapEmail(
      `Ton abonnement ${planLabel} est actif`,
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Merci pour ta confiance ! Ton compte SaaSTom est maintenant sur le plan <strong>${planLabel}</strong>.
        </p>
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Tu profites désormais de générations IA illimitées et de toutes les fonctionnalités du plan ${planLabel}.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 12px; background: #e65f3c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
          Accéder à mon espace
        </a>
      `,
    ),
  });
}

export async function sendPlanCanceledEmail(to: string) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Ton abonnement SaaSTom a été annulé",
    html: wrapEmail(
      "Abonnement annulé",
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Ton abonnement a bien été annulé et ton compte est repassé sur le plan Gratuit.
        </p>
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Tu peux te réabonner à tout moment depuis ton espace SaaSTom.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="display: inline-block; margin-top: 12px; background: #17201b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
          Voir les plans
        </a>
      `,
    ),
  });
}
