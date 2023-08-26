/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Admin - Assign Stall & RV', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  //Login
  it('Logs in as venue admin, edits and assigns Stall & RV spot', () => {
    //Search for 'gerd' and '45' & click APPLY FILTERS
    cy.get('[name="user"]')
      .click({ force: true })
      .type('gerd');
    cy.get('[name="event"]')
      .click({ force: true })
      .type('45');
    cy.contains('Needs Assignment').click();
    cy.contains('apply filters').click({ force: true });

    //Click record and edit reservation
    cy.get('div')
      .contains('irma gerd')
      .click({ force: true });
    cy.contains('Edit Reservation').click({ force: true });
    cy.contains('Edit').click({ force: true });
    //Click on Stall 10
    cy.get('[id="stall-button-9"]').click();
    //Click Edit for RV section & select RV spot #10
    cy.contains('Edit').click({ force: true });
    cy.get('[id="rv-button-9"]').click();
    //Discard changes and start over
    cy.contains('DISCARD CHANGES').click();
    cy.contains('clear filters').click();

    cy.get('[name="user"]')
      .click({ force: true })
      .type('gerd');
    cy.get('[name="event"]')
      .click({ force: true })
      .type('45');
    cy.contains('apply filters').click({ force: true });

    //Click record and edit reservation
    cy.get('div')
      .contains('irma gerd')
      .click({ force: true });
    cy.contains('Edit Reservation').click({ force: true });
    cy.contains('Edit').click({ force: true });
    //Click on Stall 10
    cy.get('[id="stall-button-9"]').click();
    //Click Edit for RV section & select RV spot #10
    cy.contains('Edit').click({ force: true });
    cy.get('[id="rv-button-9"]').click();
    cy.contains('REVIEW & SAVE CHANGES').click();
    cy.contains('SAVE CHANGES').click(); //Save
  });
  //End of file
});
