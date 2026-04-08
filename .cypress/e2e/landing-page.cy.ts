describe('Professional Landing Page - Dr. Adriano Lima', () => {
  beforeEach(() => {
    // Visit the model councillor landing page (mock slug 'vereador')
    cy.visit('/vereador')
  })

  it('should load the page correctly with premium styling', () => {
    // Check Hero Section
    cy.get('h1').contains('Dr. Adriano').should('be.visible')
    cy.get('h1').contains('Lima').should('be.visible')
    cy.get('span').contains('Mandato Participativo Itaguaí').should('be.visible')
    
    // Check Portrait
    cy.get('img[alt="Dr. Adriano Lima"]').should('be.visible').and(($img) => {
      // @ts-ignore
      expect($img[0].naturalWidth).to.be.greaterThan(0)
    })
  })

  it('should navigate between sections using the header', () => {
    // Click on "Projetos" in the header
    cy.get('nav').contains('Projetos').click()
    cy.url().should('include', '#projetos')
    cy.get('#projetos').should('be.visible')
    
    // Click on "Gabinete"
    cy.get('nav').contains('Gabinete').click()
    cy.url().should('include', '#gabinete')
    cy.get('#gabinete').should('be.visible')
  })

  it('should show legislative statistics', () => {
    cy.get('section').contains('Projetos de Lei').should('be.visible')
    cy.get('section').contains('Leis Aprovadas').should('be.visible')
  })

  it('should open the service request form', () => {
    // Click on "Solicitar Demanda" button in Hero
    cy.get('section#inicio').contains('Solicitar Demanda').click()
    
    // Dialog should be visible
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('[role="dialog"]').contains('SOLICITAR ATENDIMENTO').should('be.visible')
    
    // Check inputs
    cy.get('input[placeholder="Seu Nome"]').should('exist')
    cy.get('textarea[placeholder="Descrição da demanda..."]').should('exist')
  })

  it('should open the supporter registration form', () => {
    // Click on "Apoiar Mandato" in Header
    cy.get('header').contains('Apoiar Mandato').click()
    
    // Dialog should be visible
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('[role="dialog"]').contains('SER APOIADOR').should('be.visible')
  })
})
