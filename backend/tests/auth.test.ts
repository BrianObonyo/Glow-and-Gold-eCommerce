import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../src/lib/auth.js";

describe("auth helpers", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    expect(await verifyPassword("correct-horse-battery-staple", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("signs and verifies a JWT", () => {
    const token = signToken("user-123");
    expect(verifyToken(token)?.userId).toBe("user-123");
  });

  it("rejects an invalid token", () => {
    expect(verifyToken("not-a-real-token")).toBeNull();
  });
});
