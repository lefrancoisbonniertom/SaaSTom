import { prisma } from "@/lib/server/prisma";
import { sendDailyDigestEmail } from "@/lib/server/email";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

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
    },
  });

  let emailsSent = 0;

  for (const user of users) {
    if (user.clients.length === 0 && user.tasks.length === 0) {
      continue;
    }

    await sendDailyDigestEmail({
      to: user.email,
      clients: user.clients,
      tasks: user.tasks,
    });

    emailsSent += 1;
  }

  return Response.json({ usersChecked: users.length, emailsSent });
}
