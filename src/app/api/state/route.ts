import { auth } from "@/lib/auth";
import { getOrfeoState } from "@/lib/server/orfeo-repository";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const state = await getOrfeoState(session.user.id);
  return Response.json({ state });
}
