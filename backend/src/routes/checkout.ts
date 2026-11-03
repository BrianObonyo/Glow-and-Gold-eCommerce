import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import Stripe from "stripe";
import { requireAuth } from "../middleware/requireAuth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder");

export default async function checkoutRoutes(app: FastifyInstance) {
  // Creates a Stripe PaymentIntent from the user's current cart.
  // Prices are always re-read from the database here, never trusted from the client.
  app.post("/checkout", { preHandler: requireAuth }, async (req, reply) => {
    const cart = await prisma.cart.findUniqueOrThrow({
      where: { userId: req.userId! },
      include: { items: { include: { product: true } } },
    });

    if (cart.items.length === 0) {
      return reply.code(400).send({ error: "Cart is empty" });
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return reply.code(409).send({ error: `Not enough stock for ${item.product.name}` });
      }
    }

    const totalCents = cart.items.reduce(
      (sum, item) => sum + item.product.priceCents * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        totalCents,
        status: "pending",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceCentsAtOrder: item.product.priceCents,
          })),
        },
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return reply.send({ orderId: order.id, clientSecret: paymentIntent.client_secret });
  });

  // Stripe calls this when a payment succeeds or fails.
  // Registered in its own scope so the raw request body is available: Stripe signs the
  // exact bytes it sends, so the signature can only be verified against the unparsed body.
  await app.register(async (scope) => {
    scope.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) => done(null, body));

    scope.post("/checkout/webhook", async (req, reply) => {
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) return reply.code(503).send({ error: "Webhook secret not configured" });

      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.body as Buffer, req.headers["stripe-signature"] as string, secret);
      } catch {
        return reply.code(400).send({ error: "Invalid signature" });
      }

      if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata.orderId;
        const existing = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null;

        // Stripe retries webhooks: only process an order once.
        if (existing && existing.status !== "paid") {
          const order = await prisma.order.update({
            where: { id: existing.id },
            data: { status: "paid" },
            include: { items: true },
          });

          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          await prisma.cartItem.deleteMany({ where: { cart: { userId: order.userId } } });
        }
      }

      if (event.type === "payment_intent.payment_failed") {
        const orderId = (event.data.object as Stripe.PaymentIntent).metadata.orderId;
        if (orderId) {
          await prisma.order.updateMany({ where: { id: orderId, status: "pending" }, data: { status: "failed" } });
        }
      }

      return reply.send({ received: true });
    });
  });
}
