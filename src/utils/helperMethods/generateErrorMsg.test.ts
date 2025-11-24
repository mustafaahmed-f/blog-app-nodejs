import { describe, expect, it } from "vitest";
import { getErrorMsg } from "./generateErrorMsg.js";

describe("generateErrorMsg()", () => {
  it("should return single module when verb is 'was'", () => {
    expect(getErrorMsg("Post", "was", "notCreated")).toEqual(
      "Post was not created"
    );
  });

  it("should return plural module when verb is 'were'", () => {
    expect(getErrorMsg("Post", "were", "notCreated")).toEqual(
      "Posts were not created"
    );
  });
});
