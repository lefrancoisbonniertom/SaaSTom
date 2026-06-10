import { auth } from "@/lib/auth";
import { getSaaSTomState } from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const state = await getSaaSTomState(session.user.id);
  return Response.json({ state });
}
