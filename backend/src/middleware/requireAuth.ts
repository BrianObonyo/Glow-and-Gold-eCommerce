import type { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../lib/auth.js";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const identity = token ? verifyToken(token) : null;

  if (!identity) {
    reply.code(401).send({ error: "Unauthorized" });
    return;
  }

  req.userId = identity.userId;
}

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}
