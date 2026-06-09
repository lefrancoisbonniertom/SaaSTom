import {
  generateDocument,
  getSaaSTomState,
} from "@/lib/server/saastom-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prompt?: unknown;
    type?: unknown;
  };

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return Response.json(
      { message: "Le brief est obligatoire." },
      { status: 400 },
    );
  }

  const document = await generateDocument(
    prompt,
    typeof body.type === "string" ? body.type : "Document IA",
  );
  const state = await getSaaSTomState();

  return Response.json({ document, state }, { status: 201 });
}
