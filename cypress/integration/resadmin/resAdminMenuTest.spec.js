/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Admin - Create new event', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  //Login
  it('Logs in as admin, checks the menu options', async () => {
    cy.contains('EVENTS').click();
    cy.wait(3000); //wait to see the page load
    cy.contains('USERS').click();
    cy.wait(3000); //wait to see the page load
    cy.contains('ORDERS').click();
    cy.wait(3000); //wait to see the page load

    // cy.contains('EVENTS').click()
    //  cy.contains('SHOW FILTERS').click()
    //  cy.get('[id="NAME"]').type('Automation')
    //  cy.get('[data-testid="filters-apply-btn"]').click()
  });
  //End of file
});
