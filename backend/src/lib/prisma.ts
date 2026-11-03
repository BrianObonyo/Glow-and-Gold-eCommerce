import { PrismaClient } from "@prisma/client";

// One client per server instance. On Vercel each function instance reuses it across
// requests, which keeps the number of database connections low.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
