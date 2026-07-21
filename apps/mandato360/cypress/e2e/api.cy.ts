/**
 * API SECURITY TESTS
 *
 * Testa endpoints via HTTP:
 * - Authorization
 * - Rate limiting
 * - Input validation
 * - Status codes
 */

describe("🔒 API Security Tests", () => {
  const baseUrl = "http://localhost:3000";
  const apiUrl = `${baseUrl}/api`;

  let token1: string;
  let token2: string;
  let leadId: string;

  before(() => {
    // Setup: Login as user 1
    cy.request("POST", `${apiUrl}/auth/sign-in`, {
      email: "test1@example.com",
      password: "Test123456!",
    }).then((response) => {
      token1 = response.body.session?.token;
    });

    // Setup: Login as user 2
    cy.request("POST", `${apiUrl}/auth/sign-in`, {
      email: "test2@example.com",
      password: "Test123456!",
    }).then((response) => {
      token2 = response.body.session?.token;
    });
  });

  describe("✅ AUTHENTICATION", () => {
    it("Should return 401 without token", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/leads?tenantId=test`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it("Should return 401 with invalid token", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/leads?tenantId=test`,
        headers: { Authorization: "Bearer invalid" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
    });

    it("Should accept valid token", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/leads?tenantId=tenant1`,
        headers: { Authorization: `Bearer ${token1}` },
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe("🔴 AUTHORIZATION BYPASS - Should FAIL", () => {
    it("User 1 should NOT access User 2 data", () => {
      // User 2 creates a lead
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token2}` },
        body: {
          tenantId: "tenant2",
          nome: "Secret Lead",
          email: "secret@example.com",
        },
      }).then((response) => {
        leadId = response.body.data.id;
      });

      // User 1 tries to access
      cy.request({
        method: "GET",
        url: `${apiUrl}/leads/${leadId}?tenantId=tenant2`,
        headers: { Authorization: `Bearer ${token1}` },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403); // Forbidden
        expect(response.body.error).to.contain("access denied");
      });
    });

    it("User 1 should NOT update User 2 lead", () => {
      cy.request({
        method: "PATCH",
        url: `${apiUrl}/leads/${leadId}`,
        headers: { Authorization: `Bearer ${token1}` },
        body: { nome: "Hacked" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
      });
    });

    it("User 1 should NOT delete User 2 lead", () => {
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/leads/${leadId}`,
        headers: { Authorization: `Bearer ${token1}` },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(403);
      });
    });
  });

  describe("🛡️ INPUT VALIDATION", () => {
    it("Should reject invalid email", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          nome: "Test",
          email: "invalid-email",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.contain("inválido");
      });
    });

    it("Should reject missing required fields", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          // missing nome
          email: "test@example.com",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it("Should reject XSS payload", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          nome: "<script>alert('xss')</script>",
          email: "test@example.com",
        },
      }).then((response) => {
        // Should accept but sanitize
        expect(response.status).to.equal(201);
        expect(response.body.data.nome).to.not.include("<script>");
      });
    });

    it("Should validate phone number format", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          nome: "Test",
          email: "test@example.com",
          telefone: "invalid-phone",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });
  });

  describe("⏱️ RATE LIMITING", () => {
    it("Should rate limit after X requests", () => {
      const requests = Array(101)
        .fill(null)
        .map(() =>
          cy.request({
            method: "GET",
            url: `${apiUrl}/leads?tenantId=tenant1`,
            headers: { Authorization: `Bearer ${token1}` },
            failOnStatusCode: false,
          })
        );

      cy.wrap(requests).then((results: any[]) => {
        // Should have at least one 429 (Too Many Requests)
        const hasRateLimit = results.some((r) => r.status === 429);
        expect(hasRateLimit).to.be.true;
      });
    });
  });

  describe("✅ VALID OPERATIONS", () => {
    it("Should create lead with valid data", () => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          nome: "João Silva",
          email: "joao@example.com",
          telefone: "(21) 99999-8888",
          bairro: "Centro",
        },
      }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body.data.id).to.exist;
        expect(response.body.data.nome).to.equal("João Silva");
      });
    });

    it("Should list leads for tenant", () => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/leads?tenantId=tenant1`,
        headers: { Authorization: `Bearer ${token1}` },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
      });
    });

    it("Should update lead", () => {
      let id: string;

      // Create first
      cy.request({
        method: "POST",
        url: `${apiUrl}/leads`,
        headers: { Authorization: `Bearer ${token1}` },
        body: {
          tenantId: "tenant1",
          nome: "Original Name",
          email: "test@example.com",
        },
      }).then((response) => {
        id = response.body.data.id;

        // Update
        cy.request({
          method: "PATCH",
          url: `${apiUrl}/leads/${id}`,
          headers: { Authorization: `Bearer ${token1}` },
          body: { nome: "Updated Name", tenantId: "tenant1" },
        }).then((updateResponse) => {
          expect(updateResponse.status).to.equal(200);
          expect(updateResponse.body.data.nome).to.equal("Updated Name");
        });
      });
    });
  });

  describe("📊 STATUS CODES", () => {
    it("Should return correct status codes", () => {
      const requests = {
        GET_SUCCESS: cy.request("GET", `${apiUrl}/leads?tenantId=tenant1`, {
          headers: { Authorization: `Bearer ${token1}` },
        }),
        POST_SUCCESS: cy.request("POST", `${apiUrl}/leads`, {
          headers: { Authorization: `Bearer ${token1}` },
          body: {
            tenantId: "tenant1",
            nome: "Test",
            email: "test@example.com",
          },
        }),
        GET_UNAUTHORIZED: cy.request({
          method: "GET",
          url: `${apiUrl}/leads?tenantId=tenant1`,
          failOnStatusCode: false,
        }),
      };

      cy.wrap(requests.GET_SUCCESS).then((response) => {
        expect(response.status).to.equal(200);
      });

      cy.wrap(requests.POST_SUCCESS).then((response) => {
        expect(response.status).to.equal(201);
      });

      cy.wrap(requests.GET_UNAUTHORIZED).then((response) => {
        expect(response.status).to.equal(401);
      });
    });
  });
});
