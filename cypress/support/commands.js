Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('[data-cy="firstName"]').type('Pedro');
    cy.get('[data-cy="lastName"]').type('Esteves');
    cy.get('[data-cy="email"]').type('pedro@hotmail.com');
    cy.get('[data-cy="comoPodemosAjudar"]').type('teste teste teste teste teste teste teste teste', {delay: 0});
    cy.get('[data-cy="enviar"]').click();
});