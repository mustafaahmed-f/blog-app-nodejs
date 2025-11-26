import { beforeEach, describe, expect, it, vi } from "vitest";

const { destroyMock, consoleLogMock } = vi.hoisted(() => ({
  destroyMock: vi.fn().mockResolvedValue({}),
  consoleLogMock: vi.fn(),
}));

vi.mock("../../../services/cloudinary.js", () => ({
  default: {
    uploader: {
      destroy: destroyMock,
    },
  },
}));

vi.stubGlobal("console", {
  log: consoleLogMock,
});

import { removeUploadedImages } from "./removeUploadedImages.js";

describe("removeUploadedImages()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("shouldn't call destroy method if there are not public ids", async () => {
    let publicIds: string[] = [];
    await removeUploadedImages(publicIds);
    expect(destroyMock).not.toHaveBeenCalled();
  });

  it("should call destroy two times", async () => {
    let publicIds = ["1", "2"];
    await removeUploadedImages(publicIds);
    expect(destroyMock).toHaveBeenCalledTimes(2);
  });

  it("should call destroy with the public ids passed", async () => {
    let publicIds = ["1", "2"];
    await removeUploadedImages(publicIds);
    expect(destroyMock.mock.calls).toEqual([["1"], ["2"]]);
  });

  it("should show error message when destroy method rejects", async () => {
    let publicIds = ["1"];
    vi.doMock("../../../services/cloudinary.js", () => ({
      default: {
        uploader: {
          destroy: vi.fn().mockRejectedValue("Auth failed"),
        },
      },
    }));
    const { removeUploadedImages } = await import("./removeUploadedImages.js");
    await removeUploadedImages(publicIds);
    expect(consoleLogMock).toHaveBeenCalledWith(
      "Failed to delete image : ",
      "Auth failed"
    );
  });

  it("should handle partial failures correctly", async () => {
    let publicIds = ["1", "2"];

    // First call resolves, second call rejects
    destroyMock.mockResolvedValueOnce({}).mockRejectedValueOnce("Auth failed");

    await removeUploadedImages(publicIds);

    // destroy should be called twice
    expect(destroyMock).toHaveBeenCalledTimes(2);

    // Should log the rejection reason from the second call
    expect(consoleLogMock).toHaveBeenCalledWith(
      "Failed to delete image : ",
      "Auth failed"
    );
  });
});
