import { beforeEach, describe, expect, it, vi } from "vitest";
import { getKeysFromRedis } from "./getKeysFromRedis.js";

let cursorState = "4";
const mockRedis = {
  scan: vi.fn(async function (
    cursorArg: string,
    options: { COUNT: number; MATCH: string; TYPE: string }
  ) {
    const next = String(Number(cursorState) - 1);
    cursorState = next;

    return {
      keys: next === "0" ? ["k1", "k2"] : [],
      cursor: next,
    };
  }),
};

describe("getKeysFromRedis()", () => {
  beforeEach(() => {
    mockRedis.scan.mockClear();
    cursorState = "4";
  });

  // const scanMock = vi.spyOn(mockRedis, "scan");
  it("should call scan while cursor is not zero", async () => {
    await getKeysFromRedis(mockRedis as any, "");
    expect(mockRedis.scan).toBeCalledTimes(4);
  });

  it("should call scan with three arguments", async () => {
    await getKeysFromRedis(mockRedis as any, "");

    expect(mockRedis.scan.mock.calls[0].length).toBe(2);
  });
});
