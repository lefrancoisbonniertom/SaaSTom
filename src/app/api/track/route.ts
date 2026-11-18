import { prisma } from "@/lib/server/prisma";
import { ensureAnalyticsTable, isBot, isTrackedPath, referrerHost } from "@/lib/server/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // Seul le site lui-même peut envoyer des mesures
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") ?? "";
  let sameOrigin = request.headers.get("sec-fetch-site") === "same-origin";
  if (origin) {
    try {
      sameOrigin = new URL(origin).host === host;
    } catch {
      sameOrigin = false;
    }
  }
  if (!sameOrigin || isBot(request.headers.get("user-agent"))) {
    return new Response(null, { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 204 });
  }

  const path = typeof body.path === "string" ? body.path.split("?")[0].slice(0, 120) : "";
  if (!isTrackedPath(path)) return new Response(null, { status: 204 });

  try {
    await ensureAnalyticsTable();
    await prisma.pageView.create({
      data: {
        path,
        referrer: referrerHost(body.referrer, host.split(":")[0]),
        entry: body.entry === true,
      },
    });
  } catch (error) {
    console.error("[track]", error);
  }
  return new Response(null, { status: 204 });
}
