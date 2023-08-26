/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Venue Admin: Event Report', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as Venue admin
    cy.venueAdminLogin(getConstants());
  });

  it('Searches for event, downloads report ', () => {
    cy.contains('EVENTS').click();
    cy.contains('SHOW FILTERS').click();
    cy.get('[id="NAME"]').type('45'); //CHANGE AS NEEDED
    cy.contains('Apply').click();
    cy.get('[class=" flex-container"]').click(); //Download Event Report button
    //End of file
  });
});
