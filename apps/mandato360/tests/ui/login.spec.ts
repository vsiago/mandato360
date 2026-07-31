/**
 * Testes de UI do login, em navegador real.
 *
 * Existem por causa de um bug concreto: o <Toaster /> do sonner nunca foi
 * montado no layout, entao TODA chamada toast.* do app era silenciosa. Quem
 * errava a senha via o botao parar de girar e mais nada.
 */
import { test, expect } from "@playwright/test";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3003";

test.describe("Login", () => {
  test("senha errada mostra mensagem de erro visivel", async ({ page }) => {
    await page.goto(`${BASE}/login`);

    await page.getByLabel("E-mail").fill("admin@mandato360.com");
    await page.getByLabel("Senha").fill("senha-errada-de-proposito");
    await page.getByRole("button", { name: /entrar no painel/i }).click();

    // O toast precisa aparecer para o usuario — nao basta a API responder 401.
    const toast = page.locator("[data-sonner-toast]");
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toContainText(/invalid|senha|password|erro/i);

    // E continua na tela de login.
    await expect(page).toHaveURL(/\/login/);
  });

  test("e-mail invalido nao envia o formulario", async ({ page }) => {
    await page.goto(`${BASE}/login`);

    const email = page.getByLabel("E-mail");
    await email.fill("nao-e-email");
    await page.getByLabel("Senha").fill("qualquer");
    await page.getByRole("button", { name: /entrar no painel/i }).click();

    // O input e type="email": o proprio navegador barra o envio e sinaliza o
    // campo. O schema Zod nem chega a rodar — e esta correto, o usuario
    // recebe o aviso nativo.
    const valido = await email.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(valido, "o navegador deveria marcar o campo como invalido").toBe(false);

    await expect(page).toHaveURL(/\/login/);
  });

  test("superadmin cai no painel da plataforma, nao no de um vereador", async ({ page }) => {
    const senha = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!senha, "defina E2E_ADMIN_PASSWORD para rodar este teste");

    await page.goto(`${BASE}/login`);
    await page.getByLabel("E-mail").fill("admin@mandato360.com");
    await page.getByLabel("Senha").fill(senha!);
    await page.getByRole("button", { name: /entrar no painel/i }).click();

    await page.waitForURL(/\/master|\/dashboard/, { timeout: 20000 });
    expect(page.url(), "superadmin foi parar no dashboard de um mandato").toContain("/master");
  });
});
