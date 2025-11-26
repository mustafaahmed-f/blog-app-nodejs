import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeImgKeysFromRedis } from "./removeImgKeysFromRedis.js";

const draftId = "123456";

vi.mock("../../../services/redisClient.js", () => ({
  redisClientInstance: () => ({
    del: async (keys: string[]) => keys.length,
  }),
}));

describe("removeImgKeysFromRedis()", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return zero if public ids string is empty", () => {
    const publicIds: string[] = [];
    return expect(removeImgKeysFromRedis(publicIds, draftId)).resolves.toEqual(
      0
    );
  });

  it("should return number of keys equal to public ids", () => {
    const publicIds = ["1", "2"];
    const keys = Array.from({ length: 2 }, (_, i) => i);

    return expect(removeImgKeysFromRedis(publicIds, draftId)).resolves.toEqual(
      keys.length
    );
  });

  it("should call redisInstance method one time", async () => {
    const delMock = vi.fn().mockResolvedValue(3);
    vi.doMock("../../../services/redisClient.js", () => ({
      redisClientInstance: () => ({
        del: delMock,
      }),
    }));
    const { removeImgKeysFromRedis } = await import(
      "./removeImgKeysFromRedis.js"
    );
    await removeImgKeysFromRedis(["1", "2"], draftId);
    expect(delMock).toHaveBeenCalledTimes(1);
  });

  it("should call del method with the correct keys format", async () => {
    const publicIds = ["1", "2"];

    const delMock = vi.fn();
    vi.doMock("../../../services/redisClient.js", () => ({
      redisClientInstance: () => ({
        del: delMock,
      }),
    }));
    const { removeImgKeysFromRedis } = await import(
      "./removeImgKeysFromRedis.js"
    );

    await removeImgKeysFromRedis(publicIds, draftId);

    const key1 = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:1`;
    const key2 = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:2`;

    expect(delMock).toHaveBeenCalledWith([key1, key2]);
  });
});
