import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    browser: {
      name: "test",
      provider: "playwright",
      enabled: true,
    },
  },
});
