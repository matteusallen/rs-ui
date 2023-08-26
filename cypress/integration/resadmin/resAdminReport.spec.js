/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Reservation Admin: Accounting Report', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as reservation admin
    cy.reservationAdminLogin(getConstants());
  });

  it('Downloading Reports', () => {
    cy.contains('EXPORT REPORT').click();
    cy.get('[class="MuiFormControl-root sc-exAgwC cKJCYi sc-cLQEGU koChLT"]').click();
    //cy.contains('TIME PERIOD').click()
    cy.get('[data-value="last_week"]').click();
    cy.contains('CANCEL').click();
    cy.contains('EXPORT REPORT').click();
    cy.get('[class="MuiFormControl-root sc-exAgwC cKJCYi sc-cLQEGU koChLT"]').click();
    //cy.contains('TIME PERIOD').click()
    cy.get('[data-value="last_week"]').click();
    cy.get('[class="MuiButton-label"]')
      .eq(10)
      .click();

    //End of file
  });
});
