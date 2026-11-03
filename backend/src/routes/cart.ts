import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";

const addItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0).max(20),
});

export default async function cartRoutes(app: FastifyInstance) {
  app.get("/cart", { preHandler: requireAuth }, async (req, reply) => {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: { include: { product: true } } },
    });
    return reply.send({ cart });
  });

  app.post("/cart/items", { preHandler: requireAuth }, async (req, reply) => {
    const body = addItemSchema.parse(req.body);
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId: req.userId! } });

    const product = await prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) return reply.code(404).send({ error: "Product not found" });

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: body.productId } },
    });
    const limit = Math.min(20, product.stock);
    if ((existing?.quantity ?? 0) + body.quantity > limit) {
      return reply.code(409).send({ error: limit === 0 ? `${product.name} is out of stock` : `You can add at most ${limit} of ${product.name}` });
    }

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: body.productId } },
      update: { quantity: { increment: body.quantity } },
      create: { cartId: cart.id, productId: body.productId, quantity: body.quantity },
    });

    return reply.code(201).send({ item });
  });

  app.put("/cart/items/:productId", { preHandler: requireAuth }, async (req, reply) => {
    const { productId } = z.object({ productId: z.string().uuid() }).parse(req.params);
    const body = updateItemSchema.parse(req.body);
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId: req.userId! } });

    if (body.quantity === 0) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
      return reply.send({ removed: true });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || body.quantity > product.stock) {
      return reply.code(409).send({ error: "Not enough stock" });
    }

    const item = await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity: body.quantity },
    });

    return reply.send({ item });
  });
}
