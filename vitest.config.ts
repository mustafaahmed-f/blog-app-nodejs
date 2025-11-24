/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // use describe/test/expect globally
    environment: "node", // since this is backend (not jsdom)
    setupFiles: ["./src/tests/setup.ts"], // optional global setup
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"], // test file patterns
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
