import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["./tests/integration/setup.ts"],
    // Server actions batem no mesmo banco: sem paralelismo para evitar
    // interferencia entre suites.
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
    reporters: ["verbose"],
  },
});
