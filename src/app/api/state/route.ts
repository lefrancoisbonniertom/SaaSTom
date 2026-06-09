import { getSaaSTomState } from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

export async function GET() {
  const state = await getSaaSTomState();

  return Response.json({ state });
}
