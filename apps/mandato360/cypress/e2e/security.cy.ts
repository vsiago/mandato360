/**
 * SECURITY E2E TESTS
 *
 * Testa:
 * - Authorization (User A ≠ User B data)
 * - Login/Logout
 * - CRUD operations com validação
 * - Rate limiting
 * - Role-based access control
 */

describe("🔒 Security E2E Tests", () => {
  const baseUrl = "http://localhost:3000";
  const testUser1 = { email: "test1@example.com", password: "Test123456!" };
  const testUser2 = { email: "test2@example.com", password: "Test123456!" };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe("✅ LOGIN & AUTHENTICATION", () => {
    it("Should login with valid credentials", () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('input[type="email"]').type(testUser1.email);
      cy.get('input[type="password"]').type(testUser1.password);
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard
      cy.url().should("include", "/dashboard");
      cy.get("h1").should("be.visible");
    });

    it("Should show error with invalid credentials", () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('input[type="email"]').type("wrong@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      cy.get('[role="alert"]').should("contain", "inválid");
    });

    it("Should logout successfully", () => {
      // Após login
      cy.visit(`${baseUrl}/dashboard`);
      cy.get('button[aria-label="Menu"]').click();
      cy.get('button').contains("Sair").click();

      // Should redirect to login
      cy.url().should("include", "/login");
    });
  });

  describe("🔴 AUTHORIZATION BYPASS - Should FAIL", () => {
    it("User A should NOT access User B leads", () => {
      // User A cria um lead
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();
      cy.get('input[name="nome"]').type("Eleitor Secreto");
      cy.get('input[name="email"]').type("secreto@example.com");
      cy.get("button").contains("Salvar").click();
      cy.contains("Eleitor Secreto").should("be.visible");

      // Get the ID from URL or DOM
      cy.url().then((url) => {
        const leadId = url.split("/").pop();

        // User A faz logout
        cy.get('button[aria-label="Menu"]').click();
        cy.get('button').contains("Sair").click();

        // User B tenta acessar via URL direto
        cy.login(testUser2.email, testUser2.password);
        cy.visit(`${baseUrl}/dashboard/eleitores/${leadId}`, {
          failOnStatusCode: false,
        });

        // Should show error or 403
        cy.get('[role="alert"]').should("contain", "acesso");
      });
    });

    it("Readonly user should NOT create leads", () => {
      cy.login(testUser1.email, testUser1.password, "readonly"); // readonly role
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").should("be.disabled");
    });

    it("Non-admin should NOT delete leads", () => {
      cy.login(testUser1.email, testUser1.password, "assessor"); // assessor role
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button[aria-label*='Deletar']").should("be.disabled");
    });
  });

  describe("✅ VALID OPERATIONS - Should PASS", () => {
    it("Should create a new lead with validation", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();

      // Fill form
      cy.get('input[name="nome"]').type("João Silva");
      cy.get('input[name="email"]').type("joao@example.com");
      cy.get('input[name="telefone"]').type("(21) 99999-8888");
      cy.get("select[name='bairro']").select("Centro");
      cy.get("button").contains("Salvar").click();

      // Should show success message
      cy.contains("Eleitor criado").should("be.visible");
      cy.contains("João Silva").should("be.visible");
    });

    it("Should reject invalid email", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();

      cy.get('input[name="nome"]').type("Test");
      cy.get('input[name="email"]').type("invalid-email"); // Invalid
      cy.get("button").contains("Salvar").click();

      // Should show validation error
      cy.get('[role="alert"]').should("contain", "email");
    });

    it("Should update lead successfully", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);

      // Find first lead and click edit
      cy.get("table tbody tr").first().within(() => {
        cy.get("button[aria-label*='Edit']").click();
      });

      // Update field
      cy.get('input[name="telefone"]').clear().type("(21) 99999-9999");
      cy.get("button").contains("Salvar").click();

      cy.contains("Eleitor atualizado").should("be.visible");
    });

    it("Should delete lead with confirmation", () => {
      cy.login(testUser1.email, testUser1.password, "admin"); // Need admin
      cy.visit(`${baseUrl}/dashboard/eleitores`);

      cy.get("table tbody tr").first().within(() => {
        cy.get("button[aria-label*='Delete']").click();
      });

      // Confirm deletion
      cy.get('[role="alertdialog"]').within(() => {
        cy.get("button").contains("Confirmar").click();
      });

      cy.contains("Eleitor deletado").should("be.visible");
    });
  });

  describe("🛡️ INPUT VALIDATION - Should REJECT", () => {
    it("Should reject XSS payload", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();

      // Try XSS
      cy.get('input[name="nome"]').type("<script>alert('xss')</script>");
      cy.get('input[name="email"]').type("test@example.com");
      cy.get("button").contains("Salvar").click();

      // Should either reject or sanitize
      // Check if script tag is NOT in the stored value
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.contains("<script>").should("not.exist");
    });

    it("Should reject SQL injection attempt", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();

      // Try SQL injection
      cy.get('input[name="nome"]').type("'; DROP TABLE leads; --");
      cy.get('input[name="email"]').type("test@example.com");
      cy.get("button").contains("Salvar").click();

      // Should still have data (table not dropped)
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("table").should("exist");
    });

    it("Should validate required fields", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);
      cy.get("button").contains("Novo Eleitor").click();

      // Try to submit empty form
      cy.get("button").contains("Salvar").click();

      // Should show validation errors
      cy.get('[role="alert"]').should("be.visible");
    });
  });

  describe("⏱️ RATE LIMITING - Should THROTTLE", () => {
    it("Should rate limit rapid requests", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard/eleitores`);

      // Make multiple rapid requests
      for (let i = 0; i < 50; i++) {
        cy.get("button").contains("Novo Eleitor").click();
        cy.get('input[name="nome"]').type(`User ${i}`);
        cy.get('input[name="email"]').type(`user${i}@example.com`);
        cy.get("button").contains("Salvar").click();
      }

      // Should eventually get rate limit error
      cy.get('[role="alert"]').should("contain", "rate limit");
    });
  });

  describe("🔍 RESPONSIVE & ACCESSIBILITY", () => {
    it("Should be responsive on mobile", () => {
      cy.viewport("iphone-x");
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard`);

      // Should show mobile menu
      cy.get('button[aria-label="Menu"]').should("be.visible");
      cy.get('nav').should("not.be.visible"); // Desktop nav hidden

      // Click menu
      cy.get('button[aria-label="Menu"]').click();
      cy.get('nav').should("be.visible");
    });

    it("Should have proper ARIA labels", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard`);

      // Check ARIA attributes
      cy.get("button").should("have.attr", "aria-label");
      cy.get("input").should("have.attr", "aria-label");
      cy.get('[role="alert"]').should("exist");
    });

    it("Should be keyboard navigable", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard`);

      // Tab through elements
      cy.get("body").tab();
      cy.focused().should("have.attr", "href"); // First focusable
      cy.focused().tab();
      cy.focused().should("have.attr", "href"); // Second focusable
    });
  });

  describe("📊 DASHBOARD", () => {
    it("Should display correct stats", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard`);

      // Check stats are visible
      cy.contains("Eleitores").should("be.visible");
      cy.contains("Demandas").should("be.visible");
      cy.contains("Agenda").should("be.visible");

      // Stats should be numbers
      cy.get("[data-testid='stat-eleitores']").should("contain", /\d+/);
    });

    it("Should show charts", () => {
      cy.login(testUser1.email, testUser1.password);
      cy.visit(`${baseUrl}/dashboard`);

      // Check charts exist
      cy.get("canvas").should("be.visible"); // Charts use canvas
      cy.get("[data-testid='chart-funnel']").should("be.visible");
    });
  });
});

// Custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string, role?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string, role = "assessor") => {
  cy.visit("http://localhost:3000/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("include", "/dashboard");
});
