import { resetSaaSTomDemo } from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

export async function POST() {
  const state = await resetSaaSTomDemo();

  return Response.json({ state });
}
