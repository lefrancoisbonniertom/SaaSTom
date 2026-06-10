import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  business: process.env.STRIPE_BUSINESS_PRICE_ID,
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ message: "Non autorisé." }, { status: 401 });
  }

  const body = (await request.json()) as { plan?: unknown };
  const plan = body.plan === "business" ? "business" : "pro";
  const priceId = PRICE_IDS[plan];

  if (!priceId) {
    return Response.json({ message: "Plan introuvable." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  let customerId = user?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email,
      name: user?.name ?? undefined,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: session.user.id, plan },
    subscription_data: { metadata: { userId: session.user.id, plan } },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return Response.json({ url: checkoutSession.url });
}
