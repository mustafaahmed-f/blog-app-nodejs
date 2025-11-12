import { vi } from "vitest";

export const getJsonResponse = vi.fn((message, data, additionalInfo, error) => {
  return { mock: true, message, data };
});
