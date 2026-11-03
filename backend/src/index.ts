import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import orderRoutes from "./routes/orders.js";

const app = Fastify({
  logger: { redact: ["req.headers.authorization", "req.headers.cookie"] },
  trustProxy: true, // behind Vercel's proxy: use the real client IP (needed for rate limiting)
  bodyLimit: 100 * 1024, // 100 KB is plenty for this API
});

await app.register(helmet);

// FRONTEND_ORIGIN may be a comma-separated list (e.g. production + preview URLs).
await app.register(cors, {
  origin: (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173").split(",").map((o) => o.trim()),
  methods: ["GET", "POST", "PUT", "OPTIONS"],
});

// Global limit; the login and register routes set a stricter one.
// Note: counters live in memory per serverless instance, so this is a best-effort brake.
// Add Vercel Firewall rate limits (or a Redis store) for hard guarantees.
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });

app.setErrorHandler((err, _req, reply) => {
  if (err instanceof ZodError) {
    return reply.code(400).send({ error: err.issues[0]?.message ?? "Invalid input" });
  }
  const code = (err as { code?: string }).code;
  // Prisma: unique violation (email already registered), bad reference, missing record
  if (code === "P2002") return reply.code(409).send({ error: "That email is already registered" });
  if (code === "P2003") return reply.code(400).send({ error: "Invalid reference" });
  if (code === "P2025") return reply.code(404).send({ error: "Not found" });

  const status = (err as { statusCode?: number }).statusCode ?? 500;
  if (status >= 500) app.log.error(err);
  // Never leak internals on 5xx
  return reply.code(status).send({ error: status >= 500 ? "Something went wrong" : err.message });
});

await app.register(authRoutes);
await app.register(productRoutes);
await app.register(cartRoutes);
await app.register(checkoutRoutes);
await app.register(orderRoutes);

app.get("/health", async () => ({ status: "ok" }));

const PORT = Number(process.env.PORT ?? 4000);

app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  app.log.info(`Brian E-commerce API listening on :${PORT}`);
});
