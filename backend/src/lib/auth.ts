import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET ?? (isProd ? "" : "dev-secret-change-me");

// Fail fast: never run in production with a missing or weak signing secret.
if (isProd && JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set to a random string of at least 32 characters in production");
}

const SALT_ROUNDS = 12;
const ISSUER = "brian-ecommerce";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Used when the email does not exist, so a failed login takes as long as a real one
// and response timing does not reveal which emails are registered.
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(plain: string): Promise<void> {
  dummyHash ??= bcrypt.hash("timing-equaliser", SALT_ROUNDS);
  await bcrypt.compare(plain, await dummyHash);
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "24h", algorithm: "HS256", issuer: ISSUER });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"], issuer: ISSUER }) as { sub: string };
    return { userId: payload.sub };
  } catch {
    return null;
  }
}
