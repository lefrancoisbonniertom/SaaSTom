import { prisma } from "@/lib/server/prisma";
import { sendDailyDigestEmail } from "@/lib/server/email";
import { ensureCopilotTable } from "@/lib/server/copilot-repository";
import { computeDeadlines, daysUntil, type Activity, type Periodicity } from "@/lib/copilot";

export const runtime = "nodejs";

// Les échéances du copilote apparaissent dans le récap 7 jours avant
const REMINDER_DAYS = 7;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  await ensureCopilotTable();

  const users = await prisma.user.findMany({
    select: {
      email: true,
      clients: {
        where: { status: "À relancer" },
        select: { name: true, work: true, nextAction: true },
      },
      tasks: {
        where: { done: false },
        select: { title: true },
      },
      copilotProfile: true,
    },
  });

  let emailsSent = 0;

  for (const user of users) {
    const copilot = user.copilotProfile;
    const deadlines =
      copilot && copilot.emailReminders
        ? computeDeadlines({
            activity: copilot.activity as Activity,
            periodicity: copilot.periodicity as Periodicity,
            startDate: copilot.startDate,
            revenueThisYear: copilot.revenueThisYear,
          })
            .filter((d) => !copilot.doneIds.includes(d.id) && daysUntil(d.date) <= REMINDER_DAYS)
            .map((d) => ({
              title: d.title,
              detail: d.detail,
              days: daysUntil(d.date),
              date: d.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }),
              approx: Boolean(d.approx),
              guide: d.guide,
            }))
        : [];

    if (user.clients.length === 0 && user.tasks.length === 0 && deadlines.length === 0) {
      continue;
    }

    await sendDailyDigestEmail({
      to: user.email,
      clients: user.clients,
      tasks: user.tasks,
      deadlines,
    });

    emailsSent += 1;
  }

  return Response.json({ usersChecked: users.length, emailsSent });
}
