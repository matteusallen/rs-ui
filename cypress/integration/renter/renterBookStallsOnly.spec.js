/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Renter - Book event with RV', () => {
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
  it('Book Stalls Only', () => {
    //Book Stalls
    cy.get('div')
      .contains('BOOK NOW')
      .click({ force: true });
    cy.url().should('include', '/stalls');
    cy.get('[name="stalls.quantity"]').type('1', { force: true });
    // ****************** SETS THE DATES ************************
    cy.get('[name="startDate"]').type(myCurrentDate, { force: true });
    cy.get('[name="endDate"]').type(myEndDate, { force: true });
    // ************************************************************

    //Click SELECT for stall rate
    cy.get('[data-testid="product-row-0-stalls-button"]').click();
    //Ad Ons
    //Mats
    cy.get('[autocomplete="numberOfmats"]')
      .focus()
      .type(1);
    //Shavings
    cy.get('[autocomplete="numberOfbags"]')
      .focus()
      .type(1);
    //Hay
    cy.get('[autocomplete="numberOfbales"]')
      .focus()
      .type(1);

    cy.contains('CONTINUE TO CHECKOUT').click();

    //CHECKOUT PAGE
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
  });

  //End of file
});
