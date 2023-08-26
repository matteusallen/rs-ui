/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Admin - Refund event with RV', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  //Login
  it('Logs in as venue admin, refunds and cancels Stalls & RV reservation', () => {
    //Search for 'gerd' and '45' & click APPLY FILTERS
    cy.get('[name="user"]')
      .click({ force: true })
      .type('gerd');
    cy.get('[name="event"]')
      .click({ force: true })
      .type('WKRP'); //CHANGE EVENT SEARCH STRING THIS AS NEEDED
    cy.contains('Stall/Spot Assigned').click();
    cy.contains('apply filters').click({ force: true });
    //Click record and edit reservation
    cy.get('div')
      .contains('irma gerd')
      .click({ force: true });
    cy.contains('Edit Reservation').click({ force: true });
    cy.contains('Edit').click({ force: true });

    // Click Cancel Entire Reservation, then Keep
    cy.contains('CANCEL ENTIRE RESERVATION').click();
    cy.contains('KEEP RESERVATION').click();

    // Refund Reservation workflow
    cy.contains('REFUND RESERVATION').click();
    cy.get('[name="refundAmount"]').type('10.00'); //ADJUST AMOUNT AS NEEDED
    cy.get('[name="refundReason"]').type('Automation test');

    //click Cancel & repeat
    cy.get('[data-testid="refund-cancel"]').click();

    //Refund full amount
    cy.contains('REFUND RESERVATION').click();
    cy.get('[name="refundAmount"]').type('10.00'); //ADJUST AMOUNT AS NEEDED
    cy.get('[name="refundReason"]').type('Automation test');
    cy.get('[data-testid="refund-confirm"]').click();

    //Now camcel the reservation completely
    cy.contains('CANCEL ENTIRE RESERVATION').click(); //top-most CTA
    //cy.wait(500)  //Wait 1/2 second
    //cy.contains('CANCEL ENTIRE RESERVATION').last()
    //.click() //CTA on pop-up  <-- DOESN'T WORK!
    //cy.get('[class="MuiTouchRipple-root"]').click()
    //End of file
  });
});
