import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export default async function productRoutes(app: FastifyInstance) {
  app.get("/products", async (req, reply) => {
    const { category, search } = z
      .object({ category: z.string().max(40).optional(), search: z.string().max(80).optional() })
      .parse(req.query);

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ products });
  });

  app.get("/products/:id", async (req, reply) => {
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return reply.code(404).send({ error: "Product not found" });
    return reply.send({ product });
  });
}
