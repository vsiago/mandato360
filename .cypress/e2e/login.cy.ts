describe('Fluxo de Login', () => {
  const tenantSlug = 'vereador'; // Baseado no seed existente
  const loginUrl = `/${tenantSlug}/login`;

  beforeEach(() => {
    cy.visit(loginUrl);
  });

  it('deve exibir erro com credenciais inválidas', () => {
    cy.get('#email').type('usuario@invalido.com');
    cy.get('#password').type('senha123');
    cy.get('button[type="submit"]').click();

    // Verifica se o toast de erro aparece ou a mensagem de validação
    // Como usamos Sonner, o toast deve aparecer. 
    // No cypress, podemos verificar o texto
    cy.contains('Erro ao entrar').should('be.visible');
  });

  it('deve realizar login com sucesso e redirecionar para o dashboard', () => {
    // Usando as credenciais do Admin Master encontradas nos scripts de seed
    const email = 'admin@mandato360.com.br';
    const password = 'Ia81510156!';

    cy.get('#email').type(email);
    cy.get('#password').type(password);
    
    // Interceptar a chamada de login para garantir que esperamos a resposta
    cy.intercept('POST', '**/api/auth/sign-in/email').as('loginRequest');
    
    cy.get('button[type="submit"]').click();

    // Esperar a requisição de login
    cy.wait('@loginRequest').then((interception) => {
       // Se o usuário existir no banco, deve retornar 200
       // Se não, o teste vai falhar aqui de propósito para que eu corrija o seed se necessário
       expect(interception.response?.statusCode).to.be.oneOf([200, 302]);
    });

    // Validar redirecionamento para o dashboard do tenant
    cy.url().should('include', `/${tenantSlug}/dashboard`);
    cy.contains('Dashboard').should('be.visible');
  });

  it('deve validar campos obrigatórios no formulário', () => {
    cy.get('button[type="submit"]').click();
    
    // Verifica mensagens de erro do Zod
    cy.contains('E-mail inválido').should('be.visible');
    cy.contains('A senha é obrigatória').should('be.visible');
  });
});
