import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadPostImages } from "./uploadPostImages.js";

const {
  delMock,
  getMock,
  createManyMock,
  getKeysFromRedis,
  redisClientInstance,
  logErrorMock,
} = vi.hoisted(() => ({
  createManyMock: vi.fn().mockResolvedValue({}),
  delMock: vi.fn().mockResolvedValue({}),
  getMock: vi.fn().mockResolvedValue({}),
  getKeysFromRedis: vi.fn().mockResolvedValue([]),
  redisClientInstance: vi.fn().mockReturnValue({
    del: undefined!,
    get: undefined!,
  }),
  logErrorMock: vi.fn(),
}));

redisClientInstance.mockReturnValue({
  del: delMock,
  get: getMock,
});

vi.mock("../../../services/redisClient.js", () => ({
  redisClientInstance,
}));

vi.mock("../../../utils/helperMethods/getKeysFromRedis.js", () => ({
  getKeysFromRedis: getKeysFromRedis,
}));

vi.mock("../../../services/prismaClient.js", () => ({
  prisma: {
    post_images: {
      createMany: createManyMock,
    },
  },
}));

vi.stubGlobal("console", {
  error: logErrorMock,
  log: vi.fn(),
});

const draftId = "1234";

describe("uploadPostImages()", () => {
  beforeEach(() => {
    vi.resetModules(); //* Reset all modules mocked inside tests
    vi.clearAllMocks(); //* Reset mock calls
  });

  it("should call getKeysFromRedis() one time", async () => {
    await uploadPostImages(draftId);
    expect(getKeysFromRedis).toHaveBeenCalledTimes(1);
  });

  it("should call getKeysFromRedis() with the correct redis pattern and redis instance", async () => {
    const redisPattern = `${process.env.TEMP_IMG_UPLOADS_PREFIX}:${draftId}:*`;
    await uploadPostImages(draftId);
    expect(getKeysFromRedis).toHaveBeenCalledWith(
      redisClientInstance(),
      redisPattern
    );
    expect(delMock).not.toHaveBeenCalled();
    expect(createManyMock).not.toHaveBeenCalled();
  });

  it("should return if no redis keys available", async () => {
    await expect(uploadPostImages(draftId)).resolves.toBeUndefined();
    expect(delMock).not.toHaveBeenCalled();
    expect(createManyMock).not.toHaveBeenCalled();
  });

  it("should throw error if getting key method threw an error", async () => {
    const error = "failed to get keys";
    getKeysFromRedis.mockRejectedValue(error);
    await expect(uploadPostImages(draftId)).rejects.toEqual(error);

    expect(delMock).not.toHaveBeenCalled();
    expect(createManyMock).not.toHaveBeenCalled();
  });

  it("should throw error if there is a key without img object", async () => {
    getKeysFromRedis.mockResolvedValueOnce(["1"]);
    getMock.mockResolvedValueOnce(undefined);
    await uploadPostImages(draftId);
    expect(getKeysFromRedis).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalledWith("1");
    expect(createManyMock).not.toHaveBeenCalled();
    expect(delMock).toHaveBeenCalledWith(["1"]);
    expect(logErrorMock).toHaveBeenCalled();
  });

  it("should throw an error if creating new records in model failed or threw an error", async () => {
    getKeysFromRedis.mockResolvedValueOnce(["1"]);
    getMock.mockResolvedValueOnce(JSON.stringify({ title: "anything" }));
    createManyMock.mockRejectedValueOnce("Failed to create records !!");
    // await uploadPostImages(draftId);

    // expect(createManyMock).toHaveBeenCalledTimes(1);
    await expect(uploadPostImages(draftId)).rejects.toEqual(
      "Failed to create records !!"
    );
    expect(logErrorMock).toHaveBeenCalledTimes(1);
    expect(logErrorMock).toHaveBeenCalledWith(
      "uploadPostImages error : ",
      "Failed to create records !!"
    );
  });

  it("should call create many method if there are resolved keys", async () => {
    getKeysFromRedis.mockResolvedValueOnce(["1"]);
    getMock.mockResolvedValueOnce(JSON.stringify({ title: "anything" }));
    await uploadPostImages(draftId);
    expect(createManyMock).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if deleting keys failed or threw an error", async () => {
    getKeysFromRedis.mockResolvedValueOnce(["1"]);
    delMock.mockRejectedValueOnce("Failed to delete keys !!");
    await expect(uploadPostImages(draftId)).rejects.toEqual(
      "Failed to delete keys !!"
    );
  });
});
