import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function planFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return "business";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ message: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return Response.json({ message: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const userId = session.metadata?.userId;
      if (!userId || !session.subscription) break;

      const sub = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      const priceId = sub.items.data[0]?.price.id ?? "";
      const plan = planFromPriceId(priceId);

      await prisma.user.update({
        where: { id: userId },
        data: { plan, stripeSubscriptionId: sub.id },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;

      const priceId = sub.items.data[0]?.price.id ?? "";
      const plan = planFromPriceId(priceId);

      await prisma.user.update({
        where: { id: userId },
        data: { plan },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;

      await prisma.user.update({
        where: { id: userId },
        data: { plan: "free", stripeSubscriptionId: null },
      });
      break;
    }
  }

  return Response.json({ received: true });
}
