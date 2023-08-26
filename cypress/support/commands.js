// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (baseUrl, email, password) => {
  cy.visit(baseUrl);
  cy.contains('SIGN IN').click();
  cy.url().should('include', '/login');

  cy.get('form').within(() => {
    cy.get('[name="email"]').type(email, { force: true }); //dev & staging
    cy.get('[name="password"]').type(password, { force: true });
  });
  cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
});

Cypress.Commands.add('adminLogin', constants => {
  cy.login(constants.baseURL, constants.users.admin.email, constants.users.admin.password);
  cy.url().should('include', '/admin/orders');
});

Cypress.Commands.add('reservationAdminLogin', constants => {
  cy.login(constants.baseURL, constants.users.reservationAdmin.email, constants.users.reservationAdmin.password);
  cy.url().should('include', '/admin/orders');
});

Cypress.Commands.add('venueAdminLogin', constants => {
  cy.login(constants.baseURL, constants.users.venueAdmin.email, constants.users.venueAdmin.password);
  cy.url().should('include', '/admin/orders');
});

Cypress.Commands.add('renterLogin', constants => {
  cy.login(constants.baseURL, constants.users.renter.email, constants.users.renter.password);
  cy.url().should('include', '/events');
});

Cypress.Commands.add('opsLogin', constants => {
  cy.login(constants.baseURL, constants.users.ops.email, constants.users.ops.password);
  cy.url().should('include', '/ops');
});

Cypress.Commands.add('badLogin', constants => {
  cy.login(constants.baseURL, constants.users.bad.email, constants.users.bad.password);
});
