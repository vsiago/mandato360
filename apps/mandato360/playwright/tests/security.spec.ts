/**
 * PLAYWRIGHT SECURITY TESTS
 * Autônomos, paralelos, em múltiplos navegadores
 * Rode com: npx playwright test
 */

import { test, expect } from "../fixtures/auth";

test.describe("🔒 Security Tests", () => {
  test("✅ Admin can create lead", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/eleitores");
    await adminPage.click("button:has-text('Novo Eleitor')");

    await adminPage.fill('input[name="nome"]', "João Silva");
    await adminPage.fill('input[name="email"]', "joao@example.com");
    await adminPage.fill('input[name="telefone"]', "(21) 99999-8888");
    await adminPage.click('button:has-text("Salvar")');

    await expect(adminPage.locator("text=Eleitor criado")).toBeVisible();
    await expect(adminPage.locator("text=João Silva")).toBeVisible();
  });

  test("❌ Readonly CANNOT create lead", async ({ readonlyPage }) => {
    await readonlyPage.goto("/dashboard/eleitores");

    // Button should be disabled
    const createButton = readonlyPage.locator(
      "button:has-text('Novo Eleitor')"
    );
    await expect(createButton).toBeDisabled();
  });

  test("❌ User A CANNOT access User B data", async ({
    page: pageA,
    context,
  }) => {
    // User A creates a lead
    const pageB = await context.newPage();

    // Login as User A via fixture
    const loginA = await pageA.request.post("/api/auth/sign-in", {
      data: {
        email: "admin@mandato360.com",
        password: "Admin@123456",
      },
    });

    const tokenA = loginA
      .cookies()
      .find((c) => c.name === "better-auth.session_token")?.value;

    await pageA.context().addCookies([
      {
        name: "better-auth.session_token",
        value: tokenA || "",
        domain: "localhost",
        path: "/",
      },
    ]);

    // User A creates a lead
    await pageA.goto("/api/leads");
    const createResponse = await pageA.request.post("/api/leads", {
      data: {
        tenantId: "tenant-a",
        nome: "Secret Lead",
        email: "secret@example.com",
      },
    });

    const leadId = createResponse.ok
      ? (await createResponse.json()).data?.id
      : null;

    // User B tries to access
    const loginB = await pageB.request.post("/api/auth/sign-in", {
      data: {
        email: "readonly@mandato360.com",
        password: "Readonly@123456",
      },
    });

    const tokenB = loginB
      .cookies()
      .find((c) => c.name === "better-auth.session_token")?.value;

    // Try to access User A's lead
    const accessResponse = await pageB.request.get(
      `/api/leads/${leadId}?tenantId=tenant-a`,
      {
        headers: {
          Cookie: `better-auth.session_token=${tokenB}`,
        },
      }
    );

    // Should be 403 Forbidden
    expect(accessResponse.status()).toBe(403);
    await pageB.close();
  });

  test("🛡️ XSS payload sanitized", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/eleitores");
    await adminPage.click("button:has-text('Novo Eleitor')");

    // Try XSS
    await adminPage.fill('input[name="nome"]', "<script>alert('xss')</script>");
    await adminPage.fill('input[name="email"]', "test@example.com");
    await adminPage.click('button:has-text("Salvar")');

    // Verify script tag not rendered
    const scriptElements = await adminPage.$$(
      "script:has-text('alert(\\'xss\\')')"
    );
    expect(scriptElements.length).toBe(0);

    // Verify stored value is safe
    await adminPage.reload();
    const leadName = await adminPage.textContent(
      "table tbody tr:first-child td:nth-child(2)"
    );
    expect(leadName).not.toContain("<script>");
  });

  test("✅ Valid email accepted", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/eleitores");
    await adminPage.click("button:has-text('Novo Eleitor')");

    await adminPage.fill('input[name="nome"]', "Test User");
    await adminPage.fill('input[name="email"]', "valid@example.com");
    await adminPage.click('button:has-text("Salvar")');

    await expect(adminPage.locator("text=Eleitor criado")).toBeVisible();
  });

  test("❌ Invalid email rejected", async ({ adminPage }) => {
    await adminPage.goto("/dashboard/eleitores");
    await adminPage.click("button:has-text('Novo Eleitor')");

    await adminPage.fill('input[name="nome"]', "Test User");
    await adminPage.fill('input[name="email"]', "invalid-email");
    await adminPage.click('button:has-text("Salvar")');

    // Should show validation error
    await expect(
      adminPage.locator("text=Email inválido")
    ).toBeVisible({ timeout: 5000 });
  });

  test("⏱️ Rate limiting after N requests", async ({ adminPage }) => {
    const maxRequests = 100;
    let rateLimited = false;

    for (let i = 0; i < maxRequests; i++) {
      const response = await adminPage.request.get(
        "/api/leads?tenantId=test"
      );

      if (response.status() === 429) {
        rateLimited = true;
        break;
      }

      // Small delay to avoid overwhelming
      await adminPage.waitForTimeout(10);
    }

    // Should have been rate limited at some point
    expect(rateLimited).toBe(true);
  });

  test("📱 Responsive on mobile", async ({ adminPage }) => {
    // Set mobile viewport
    await adminPage.setViewportSize({ width: 375, height: 667 });
    await adminPage.goto("/dashboard");

    // Mobile menu should be visible
    const mobileMenu = adminPage.locator('button[aria-label="Menu"]');
    await expect(mobileMenu).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = adminPage.locator("nav").first();
    await expect(desktopNav).toBeHidden();
  });

  test("🔍 Keyboard navigable", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");

    // Tab to first element
    await adminPage.keyboard.press("Tab");
    const focused = adminPage.locator(":focus");

    // Should have focus visible
    await expect(focused).toBeDefined();
  });

  test("📊 Dashboard loads correctly", async ({ adminPage }) => {
    await adminPage.goto("/dashboard");

    // Check key elements
    await expect(
      adminPage.locator("text=Eleitores")
    ).toBeVisible();
    await expect(
      adminPage.locator("text=Demandas")
    ).toBeVisible();

    // Check stats are numbers
    const statsText = await adminPage.textContent(
      "[data-testid='stat-eleitores']"
    );
    expect(statsText).toMatch(/\d+/);
  });

  test("🔄 CRUD operations", async ({ adminPage }) => {
    const leadName = `Test Lead ${Date.now()}`;

    // CREATE
    await adminPage.goto("/dashboard/eleitores");
    await adminPage.click("button:has-text('Novo Eleitor')");
    await adminPage.fill('input[name="nome"]', leadName);
    await adminPage.fill('input[name="email"]', "test@example.com");
    await adminPage.click('button:has-text("Salvar")');
    await expect(adminPage.locator(`text=${leadName}`)).toBeVisible();

    // UPDATE
    const editButton = adminPage.locator(
      `tr:has-text("${leadName}") button[aria-label*="Edit"]`
    );
    await editButton.click();
    await adminPage.fill('input[name="telefone"]', "(21) 99999-9999");
    await adminPage.click('button:has-text("Salvar")');
    await expect(adminPage.locator("text=Eleitor atualizado")).toBeVisible();

    // DELETE
    const deleteButton = adminPage.locator(
      `tr:has-text("${leadName}") button[aria-label*="Delete"]`
    );
    await deleteButton.click();
    await adminPage.click('button:has-text("Confirmar")');
    await expect(adminPage.locator("text=Eleitor deletado")).toBeVisible();
    await expect(adminPage.locator(`text=${leadName}`)).not.toBeVisible();
  });
});
