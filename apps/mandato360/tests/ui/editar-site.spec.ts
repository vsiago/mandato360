/**
 * Reproduz o crash relatado: abrir "Editar Site" de um mandato criado pela
 * tela /master/tenants derrubava a pagina com
 *   "Cannot read properties of undefined (reading 'gradient')"
 * em device-preview.tsx.
 *
 * Causa: a criacao de mandato grava um __editorConfig PARCIAL (so
 * theme.colors e hero.images/gradient, sem `header`). extractEditorConfig
 * devolvia esse objeto parcial direto, sem preencher os campos que faltavam.
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3003";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;
const TENANT_SLUG = process.env.E2E_TENANT_SLUG || "vereador-exemplo";

test.describe("Editar Site", () => {
  test.skip(!ADMIN_PASSWORD, "defina E2E_ADMIN_PASSWORD para rodar este teste");

  test("abre sem crashar e sem erro de runtime", async ({ page }) => {
    // O crash e um erro de RUNTIME apos a hidratacao (client-side), nao um
    // erro de servidor: checar o texto so uma vez, num instante fixo, corre
    // o risco de amostrar ANTES do crash acontecer e passar por sorte.
    // Escutar pageerror pega o erro no momento exato em que ele ocorre.
    const errosDeRuntime: string[] = [];
    page.on("pageerror", (e) => errosDeRuntime.push(e.message));

    await page.goto(`${BASE}/login`);
    await page.getByLabel("E-mail").fill("admin@mandato360.com");
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /entrar no painel/i }).click();
    await page.waitForURL(/\/master/, { timeout: 20000 });

    await page.goto(`${BASE}/${TENANT_SLUG}/dashboard/editar-site`, { waitUntil: "networkidle" });

    // Sinal positivo de que o editor terminou de carregar (bom ou ruim).
    await expect(page.getByText(/preparando editor visual/i)).toHaveCount(0, { timeout: 20000 });
    await page.waitForTimeout(1500); // hidratacao/crash acontece logo depois do loading sumir

    expect(errosDeRuntime, `erro de runtime no editor: ${errosDeRuntime.join(" | ")}`).toEqual([]);
    await expect(page.getByText(/application error/i)).toHaveCount(0);
  });
});
