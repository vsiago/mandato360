import { chromium } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3003";
const SLUG = process.env.E2E_TENANT_SLUG || "fabinho-da-prime";
const SENHA = process.env.E2E_ADMIN_PASSWORD;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();

const erros = [];
page.on("pageerror", (e) => erros.push(`[pageerror] ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") erros.push(`[console.error] ${m.text()}`);
});

await page.goto(`${BASE}/login`);
await page.getByLabel("E-mail").fill("admin@mandato360.com");
await page.getByLabel("Senha").fill(SENHA);
await page.getByRole("button", { name: /entrar no painel/i }).click();
await page.waitForURL(/\/master/, { timeout: 20000 });

console.log(`Indo para /${SLUG}/dashboard/editar-site ...`);
await page.goto(`${BASE}/${SLUG}/dashboard/editar-site`, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);

await page.screenshot({ path: `scripts/_debug-${SLUG}.png`, fullPage: true });
console.log(`Screenshot: scripts/_debug-${SLUG}.png`);

console.log(`\nErros JS capturados: ${erros.length}`);
for (const e of erros) console.log("  " + e.slice(0, 300));

console.log("\nTexto visivel na pagina (primeiros 500 chars):");
console.log((await page.locator("body").innerText()).slice(0, 500));

await browser.close();
