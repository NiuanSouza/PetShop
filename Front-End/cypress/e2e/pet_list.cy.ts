describe('PetShop – Catálogo de Animais', () => {
  beforeEach(() => {
    cy.visit('/#/animais');
    cy.wait(1000);
  });

  it('exibe a lista de animais', () => {
    cy.get('.card').should('have.length.at.least', 1);
  });

  it('filtra por espécie', () => {
    cy.get('[data-species="cachorro"]').click();
    cy.get('.card').each(($card) => {
      cy.wrap($card).find('.card-badge').should('contain', 'Cachorro');
    });
  });

  it('navega para detalhes do animal', () => {
    cy.get('.card[data-href]').first().click();
    cy.get('.detail-page').should('exist');
    cy.get('.detail-info h1').should('not.be.empty');
  });
});
