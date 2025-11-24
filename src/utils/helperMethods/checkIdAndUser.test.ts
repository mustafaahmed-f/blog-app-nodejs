import { afterEach, describe, expect, it, vi } from "vitest";

describe("checkIdAndUser()", () => {
  afterEach(() => {
    vi.resetModules();
  });
  it("should throw if userId is null or undefined", async () => {
    vi.doMock("@clerk/express", () => ({ getAuth: () => ({ userId: null }) }));
    const { checkIdAndUser } = await import("./checkIdAndUser.js");
    await expect(checkIdAndUser({} as any)).rejects.toThrowError(
      "UserId from clerk is not found!!"
    );
  });

  it("should throw if user is not found", async () => {
    vi.doMock("@clerk/express", () => ({ getAuth: () => ({ userId: 1 }) }));
    vi.doMock("../../services/prismaClient.js", () => ({
      prisma: { user: { findUnique: () => Promise.resolve(null) } },
    }));

    const { checkIdAndUser } = await import("./checkIdAndUser.js");
    await expect(checkIdAndUser({} as any)).rejects.toThrow("User not found");
  });

  it("should return user if it is found", async () => {
    vi.doMock("@clerk/express", () => ({ getAuth: () => ({ userId: 1 }) }));
    vi.doMock("../../services/prismaClient.js", () => ({
      prisma: { user: { findUnique: () => Promise.resolve({ id: 1 }) } },
    }));
    const { checkIdAndUser } = await import("./checkIdAndUser.js");
    await expect(checkIdAndUser({} as any)).resolves.toEqual({ id: 1 });
  });
});
