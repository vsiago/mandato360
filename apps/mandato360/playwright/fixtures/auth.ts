/**
 * PLAYWRIGHT FIXTURES - AUTHENTICATION
 * Compartilhado entre todos os testes
 * Permite login autônomo sem UI
 */

import { test as baseTest, Page } from "@playwright/test";

type TestFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
  readonlyPage: Page;
};

const TEST_USERS = {
  admin: {
    email: "admin@mandato360.com",
    password: "Admin@123456",
    role: "admin",
  },
  assessor: {
    email: "assessor@mandato360.com",
    password: "Assessor@123456",
    role: "assessor",
  },
  readonly: {
    email: "readonly@mandato360.com",
    password: "Readonly@123456",
    role: "readonly",
  },
};

/**
 * Fixture: Página autenticada como Admin
 * Pode criar, editar, deletar
 */
export const test = baseTest.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login via API (mais rápido que UI)
    const loginResponse = await page.request.post("/api/auth/sign-in", {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });

    const sessionToken = loginResponse.cookies().find(
      (c) => c.name === "better-auth.session_token"
    )?.value;

    if (sessionToken) {
      await page.context().addCookies([
        {
          name: "better-auth.session_token",
          value: sessionToken,
          domain: "localhost",
          path: "/",
        },
      ]);
    }

    await page.goto("/dashboard");
    await use(page);
    await page.context().clearCookies();
  },

  adminPage: async ({ page }, use) => {
    const loginResponse = await page.request.post("/api/auth/sign-in", {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });

    const sessionToken = loginResponse.cookies().find(
      (c) => c.name === "better-auth.session_token"
    )?.value;

    if (sessionToken) {
      await page.context().addCookies([
        {
          name: "better-auth.session_token",
          value: sessionToken,
          domain: "localhost",
          path: "/",
        },
      ]);
    }

    await page.goto("/dashboard");
    await use(page);
  },

  readonlyPage: async ({ page }, use) => {
    const loginResponse = await page.request.post("/api/auth/sign-in", {
      data: {
        email: TEST_USERS.readonly.email,
        password: TEST_USERS.readonly.password,
      },
    });

    const sessionToken = loginResponse.cookies().find(
      (c) => c.name === "better-auth.session_token"
    )?.value;

    if (sessionToken) {
      await page.context().addCookies([
        {
          name: "better-auth.session_token",
          value: sessionToken,
          domain: "localhost",
          path: "/",
        },
      ]);
    }

    await page.goto("/dashboard");
    await use(page);
  },
});

export { expect } from "@playwright/test";
export const TEST_USERS_EXPORT = TEST_USERS;
