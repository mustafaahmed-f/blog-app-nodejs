// import { prismaMock } from "../../../tests/mocks/prisma.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prismaMock } from "../../tests/mocks/prisma.js";

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
    vi.doMock("../../services/prismaClient.js", () =>
      prismaMock.userMock(null)
    );

    const { checkIdAndUser } = await import("./checkIdAndUser.js");
    await expect(checkIdAndUser({} as any)).rejects.toThrow("User not found");
  });

  it("should return user if it is found", async () => {
    const user = { id: 1 };
    vi.doMock("@clerk/express", () => ({ getAuth: () => ({ userId: 1 }) }));
    vi.doMock("../../services/prismaClient.js", () =>
      prismaMock.userMock(user)
    );
    const { checkIdAndUser } = await import("./checkIdAndUser.js");
    await expect(checkIdAndUser({} as any)).resolves.toEqual(user);
  });
});
