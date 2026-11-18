import { auth } from "@/lib/auth";
import { getCopilot, parseProfile, saveCopilot } from "@/lib/server/copilot-repository";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }
  return Response.json(await getCopilot(session.user.id));
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ message: "Requête invalide." }, { status: 400 });
  }

  const update: Parameters<typeof saveCopilot>[1] = {};
  if ("profile" in body) {
    if (body.profile === null) {
      update.profile = null;
    } else {
      const profile = parseProfile(body.profile);
      if (!profile) {
        return Response.json({ message: "Informations du copilote invalides." }, { status: 400 });
      }
      update.profile = profile;
    }
  }
  if (Array.isArray(body.doneIds)) update.doneIds = body.doneIds.filter((x): x is string => typeof x === "string");
  if (typeof body.emailReminders === "boolean") update.emailReminders = body.emailReminders;

  return Response.json(await saveCopilot(session.user.id, update));
}
