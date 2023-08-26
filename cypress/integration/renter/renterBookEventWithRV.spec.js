/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

// **** THIS SECTION SETS THE DATES FROM CURRENT TO +x IN THE FUTURE ************
var myCurrentDate = new Date().toLocaleDateString({ day: 'numeric' });
var myEndDateCalc = new Date(myCurrentDate);
// ****************** CHANGE # OF DAYS IN THE FUTURE VALUE BELOW ****************
myEndDateCalc.setDate(myEndDateCalc.getDate() + 3);
// ******************************************************************************
var myEndDate = myEndDateCalc.toLocaleDateString({ day: 'numeric' });
// ******************* END OF DATE SET & CALC CODE ******************************

describe('Renter - Book event with RV', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as renter
    cy.renterLogin(getConstants());
  });

  //Login Test and go to EVENTS
  it('Opens website, signs in and lands on EVENTS', () => {
    //Book Stalls
    cy.get('div')
      .contains('BOOK NOW') //.eq(1)
      .click({ force: true });
    cy.url().should('include', '/stalls');
    cy.get('[name="stalls.quantity"]').type('51');
    cy.contains('Maximum exceeded');
    cy.wait(500);
    cy.get('[name="stalls.quantity"]').clear();
    cy.get('[name="stalls.quantity"]').type('50');
    cy.wait(500);
    cy.get('[name="stalls.quantity"]').clear();
    cy.get('[name="stalls.quantity"]').type('1');

    // ****************** SETS THE DATES ************************
    //cy.get('[name="startDate"]').type(myCurrentDate, { force: true })
    //cy.get('[name="endDate"]').type(myEndDate, { force: true })
    // ************************************************************

    //Click SELECT for stall rate
    //cy.get('[data-testid="product-row-0-stalls-button"]').click()
    //Ad Ons
    //Mats
    cy.get('[autocomplete="numberOfmats"]')
      .focus()
      .type(151);
    cy.contains('Maximum exceeded');
    cy.wait(500);
    cy.get('[autocomplete="numberOfmats"]').clear();
    cy.get('[autocomplete="numberOfmats"]')
      .focus()
      .type(150);
    cy.wait(500);
    cy.get('[autocomplete="numberOfmats"]')
      .clear()
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

    //Add RV Spots
    cy.contains('ADD RV SPOT(S)').click();
    cy.url().should('include', '/rvs');
    cy.get('[name="rv_spot.quantity"]').type('1', { force: true });
    cy.get('[name="useResDates"]').click({ force: true });
    //Click SELECT for Second RV lot
    cy.get('[data-testid="product-row-0-rvs-button"]').click();
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

    //Validate Renter Information on Checkout Page

    //cy.contains('RETURN TO EVENTS').click({ force: true })
  });

  //End of file
});
