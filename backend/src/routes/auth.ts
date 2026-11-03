import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword, burnPasswordCheck, signToken } from "../lib/auth.js";

const email = z.string().trim().toLowerCase().email("Enter a valid email").max(254);

const registerSchema = z.object({
  email,
  // bcrypt only uses the first 72 bytes, so longer passwords add no security
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long"),
});

const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

// Per-IP limits on the credential endpoints, on top of the global limit.
const strict = { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } };

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", strict, async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(body.password);

    // Create the user and their cart together or not at all.
    const user = await prisma.user.create({
      data: { email: body.email, passwordHash, cart: { create: {} } },
    });

    const token = signToken(user.id);
    return reply.code(201).send({ token, user: { id: user.id, email: user.email } });
  });

  app.post("/auth/login", strict, async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) {
      await burnPasswordCheck(body.password);
      return reply.code(401).send({ error: "Invalid credentials" });
    }
    if (!(await verifyPassword(body.password, user.passwordHash))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);
    return reply.send({ token, user: { id: user.id, email: user.email } });
  });
}
