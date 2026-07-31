import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ui",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3003",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Usa o Chrome ja instalado na maquina em vez de baixar o build proprio do
  // Playwright — o download do chromium esta bloqueado nesta rede.
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
});
