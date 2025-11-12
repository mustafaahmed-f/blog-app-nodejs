import { it, describe, vi, expect } from "vitest";
import { getJsonResponse } from "./getJsonResponse.js";

describe("getJsonResponse()", () => {
  it("should get the right json response when we send message and data", () => {
    let message = "Got data successfully !!";
    let data = { success: true };
    let response = {
      message,
      data,
    };

    expect(getJsonResponse({ message, data })).toEqual(response);
  });

  it("should give json response with error message when we send error parameter", () => {
    let error = "Failed to fetch";
    let response = {
      error,
    };

    expect(getJsonResponse({ error })).toEqual(response);
  });

  it("should give json response with additional info in case we send additional info", () => {
    let additionalInfo = {
      hasNextPage: true,
    };
    let response = {
      additionalInfo,
    };

    expect(getJsonResponse({ additionalInfo })).toEqual(response);
  });
});
