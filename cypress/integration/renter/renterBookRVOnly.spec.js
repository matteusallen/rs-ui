/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Renter - Book RV only', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as renter
    cy.renterLogin(getConstants());
  });

  // **** THIS SECTION SETS THE DATES FROM CURRENT TO +x IN THE FUTURE ************
  var myCurrentDate = new Date().toLocaleDateString({ day: 'numeric' });
  var myEndDateCalc = new Date(myCurrentDate);
  // ****************** CHANGE # OF DAYS IN THE FUTURE VALUE BELOW ****************
  myEndDateCalc.setDate(myEndDateCalc.getDate() + 3);
  // ******************************************************************************
  var myEndDate = myEndDateCalc.toLocaleDateString({ day: 'numeric' });
  // ******************* END OF DATE SET & CALC CODE ******************************

  //Login Test and go to EVENTS
  it('Opens website, signs in, lands on EVENTS and clicks Book RV spot only', () => {
    //Click SIGN IN button & land on EVENTS, then click Book RV spot only
    cy.url().should('include', '/events');
    cy.get('div')
      .contains('Book RV spot only')
      .click({ force: true });
    cy.url().should('include', '/rvs');
    cy.get('[name="rv_spot.quantity"]').type('1');
    // ****************** SETS THE DATES ************************
    cy.get('[name="startDate"]').type(myCurrentDate, { force: true });
    cy.get('[name="endDate"]').type(myEndDate, { force: true });
    // ************************************************************
    cy.get('[data-testid="product-row-0-rvs-button"]').click();
    cy.get('[data-testid="reservation-summary-contiune-btn"]').click(); //CONTINUE TO CHECKOUT
    cy.url().should('include', '/checkout');

    //Payment details
    cy.get('[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedEnd MuiFilledInput-inputAdornedEnd"]').click();
    cy.contains('**** **** **** 4242').click({ force: true });

    //Special requests
    cy.get('[name="renterNotes"]')
      .click({ force: true })
      .type('This is a test');

    //Checkbox for venue agreement & submit
    cy.get('[name="venueAgreement"]').click();
    //cy.contains('SUBMIT').click()
    //cy.url().should('include', '/confirmation')
    //cy.contains('RETURN TO EVENTS').click({ force: true })
    //Select Lot
    //End of file
  });
});
