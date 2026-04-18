describe('Login Administrativo Master', () => {
  const loginUrl = '/login';

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it('deve realizar login como Admin Master e ser redirecionado para a Gestão de Mandatos', () => {
    const email = 'admin@mandato360.com.br';
    const password = 'Ia81510156!';

    cy.get('#email').type(email);
    cy.get('#password').type(password);
    
    cy.intercept('POST', '**/api/auth/sign-in/email').as('loginRequest');
    
    cy.get('button[type="submit"]').click();

    // Espera a requisição e valida sucesso
    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 310, 302]);

    // O Admin Master é redirecionado para a área de gestão de tenants
    cy.url().should('include', '/master/tenants');
    cy.contains(/Gestão de Mandatos|Mandatos/i).should('be.visible');
  });

  it('deve validar mensagens de erro no login master', () => {
    cy.get('#email').type('errado@mandato360.com.br');
    cy.get('#password').type('senhaerrada');
    
    cy.intercept('POST', '**/api/auth/sign-in/email').as('loginError');
    cy.get('button[type="submit"]').click();

    // Valida que a API retornou erro 401 (Não autorizado)
    cy.wait('@loginError').its('response.statusCode').should('eq', 401);

    // Verifica se o toast de erro aparece (aumentando o timeout para garantir captura)
    cy.get('li', { timeout: 10000 }).should('exist');
    cy.contains(/invalid|inválido|erro/i).should('be.visible');
  });
});
