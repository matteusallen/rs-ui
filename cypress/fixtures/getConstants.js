export const getConstants = () => {
  const constants = require('./constants.json');
  cy.log(constants);
  return constants[Cypress.env('environment')];
};
