/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Admin - Refund event with RV', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  //Login
  it('Logs in as venue admin, refunds and cancels RV Only reservation', () => {
    //Search for 'gerd' and '45' & click APPLY FILTERS
    cy.get('[name="user"]')
      .click({ force: true })
      .type('gerd');
    cy.get('[name="event"]')
      .click({ force: true })
      .type('WKRP'); //CHANGE EVENT SEARCH STRING THIS AS NEEDED
    cy.contains('Stall/Spot Assigned').click();

    //ADD MORE
  });
  //End of file
});
