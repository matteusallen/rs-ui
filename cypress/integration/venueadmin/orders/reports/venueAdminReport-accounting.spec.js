/// <reference types="cypress" />
import { getConstants } from '../../../../fixtures/getConstants';

describe('Venue Admin: Reports - Accounting', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as Venue admin
    cy.venueAdminLogin(getConstants());
  });

  it('Downloading Reports', () => {
    cy.contains('EXPORT REPORT').click();
    //cy.get('[id="undefined-TIME PERIOD*"]').click() //DOESN'T WORK
    cy.contains('REPORT TYPE*').click();
    //cy.contains('ACCOUNTING REPORT').click()
    //cy.contains('ADMIN NAME*').click()
    //cy.contains('ALL ADMINS').click()
    //cy.contains('TIME PERIOD*').click()
    //cy.contains('LAST 7 DAYS').click()

    //End of file
  });
});
