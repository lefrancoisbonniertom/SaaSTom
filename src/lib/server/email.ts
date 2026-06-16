import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Orfeo <onboarding@resend.dev>";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  business: "Business",
};

function wrapEmail(title: string, body: string) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background-color: #f3f5ef; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #dfe4d8; border-radius: 12px; overflow: hidden;">
        <div style="background: #17201b; padding: 20px 24px;">
          <span style="color: #ffffff; font-size: 18px; font-weight: 700;">Orfeo</span>
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
          Merci pour ta confiance ! Ton compte Orfeo est maintenant sur le plan <strong>${planLabel}</strong>.
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

export async function sendOtpEmail(to: string, code: string) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${code} est ton code de connexion Orfeo`,
    html: wrapEmail(
      "Ton code de connexion",
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Utilise ce code pour te connecter à ton espace Orfeo. Il est valable 10 minutes.
        </p>
        <div style="margin: 20px 0; text-align: center;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #17201b; background: #f3f5ef; border: 1px solid #dfe4d8; border-radius: 10px; padding: 14px 22px;">
            ${code}
          </span>
        </div>
        <p style="margin-top: 16px; font-size: 13px; line-height: 20px; color: #8c9785;">
          Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet email.
        </p>
      `,
    ),
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Réinitialise ton mot de passe Orfeo",
    html: wrapEmail(
      "Réinitialisation du mot de passe",
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Tu as demandé à réinitialiser le mot de passe de ton compte Orfeo. Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 12px; background: #e65f3c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
          Réinitialiser mon mot de passe
        </a>
        <p style="margin-top: 16px; font-size: 13px; line-height: 20px; color: #8c9785;">
          Ce lien est valable 1 heure. Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet email.
        </p>
      `,
    ),
  });
}

export async function sendDocumentEmail({
  to,
  documentTitle,
  documentType,
  clientName,
  pdfBuffer,
  pdfFilename,
}: {
  to: string;
  documentTitle: string;
  documentType: string;
  clientName: string | null;
  pdfBuffer: Buffer;
  pdfFilename: string;
}) {
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Document : ${documentTitle}`,
    html: wrapEmail(
      documentTitle,
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Bonjour${clientName ? ` ${clientName}` : ""},
        </p>
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Vous trouverez ci-joint le document <strong>${documentTitle}</strong> (${documentType}).
        </p>
      `,
    ),
    attachments: [
      {
        filename: pdfFilename,
        content: pdfBuffer,
      },
    ],
  });
}

export async function sendDailyDigestEmail({
  to,
  clients,
  tasks,
}: {
  to: string;
  clients: { name: string; work: string; nextAction: string }[];
  tasks: { title: string }[];
}) {
  if (!resend) return;

  const clientItems = clients
    .map(
      (client) => `
        <li style="margin-bottom: 8px;">
          <strong>${client.name}</strong> — ${client.work}<br />
          <span style="color: #8c9785;">Prochaine action : ${client.nextAction}</span>
        </li>
      `,
    )
    .join("");

  const taskItems = tasks
    .map((task) => `<li style="margin-bottom: 8px;">${task.title}</li>`)
    .join("");

  const sections = [
    clients.length
      ? `
        <h2 style="font-size: 14px; color: #17201b; margin: 20px 0 8px;">À relancer (${clients.length})</h2>
        <ul style="padding-left: 18px; margin: 0; font-size: 14px; line-height: 22px; color: #384438;">${clientItems}</ul>
      `
      : "",
    tasks.length
      ? `
        <h2 style="font-size: 14px; color: #17201b; margin: 20px 0 8px;">Tâches en attente (${tasks.length})</h2>
        <ul style="padding-left: 18px; margin: 0; font-size: 14px; line-height: 22px; color: #384438;">${taskItems}</ul>
      `
      : "",
  ].join("");

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Votre récapitulatif Orfeo du jour",
    html: wrapEmail(
      "Votre récapitulatif du jour",
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Voici ce qui mérite votre attention aujourd'hui.
        </p>
        ${sections}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 16px; background: #e65f3c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
          Ouvrir mon espace
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
    subject: "Ton abonnement Orfeo a été annulé",
    html: wrapEmail(
      "Abonnement annulé",
      `
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Ton abonnement a bien été annulé et ton compte est repassé sur le plan Gratuit.
        </p>
        <p style="font-size: 14px; line-height: 22px; color: #384438;">
          Tu peux te réabonner à tout moment depuis ton espace Orfeo.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="display: inline-block; margin-top: 12px; background: #17201b; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 6px;">
          Voir les plans
        </a>
      `,
    ),
  });
}
