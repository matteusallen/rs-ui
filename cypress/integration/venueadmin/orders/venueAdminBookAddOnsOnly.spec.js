/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Venue Admin - Add Ons Only', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });
  // **** THIS SECTION SETS THE DATES FROM CURRENT TO +x IN THE FUTURE ************
  var myCurrentDate = new Date().toLocaleDateString({ day: 'numeric' });
  var myEndDateCalc = new Date(myCurrentDate);
  // ****************** CHANGE # OF DAYS IN THE FUTURE VALUE BELOW ****************
  myEndDateCalc.setDate(myEndDateCalc.getDate() + 3); //CHANGE THIS NUMBER VALUE
  // ******************************************************************************
  var myEndDate = myEndDateCalc.toLocaleDateString({ day: 'numeric' });
  // ******************* END OF DATE SET & CALC CODE ******************************
  //Login
  it('Logs in as admin, edits and assigns Stall & RV spot', () => {
    cy.contains('CREATE NEW').click({ force: true });
    cy.get('[name="renterInformation.email"]')
      .click({ force: true })
      .type('irmagerd@mailinator.com');
    cy.contains('irmagerd@mailinator.com').click();
    cy.get('[id="mui-component-select-EVENT"]').click();
    //.type('45')
    cy.contains('Last test').click(); // CHANGE ME

    //cy.get('[data-testid="collapsed-section-addOnProduct"]').click()
    //cy.get('[class="MuiSwitch-thumb"]').eq(2).click()
    cy.get('[class="MuiIconButton-label"]')
      .eq(4)
      .click(); //ADD ONS TOGGLE
    cy.get('[autocomplete="numberOfbags"]').type(3);
    // SPECIAL REQUESTS
    cy.get('[name="renterNotes"]')
      .focus()
      .type('This is a test');
    //Payment details
    cy.get('[class="MuiInputBase-input MuiFilledInput-input MuiInputBase-inputAdornedEnd MuiFilledInput-inputAdornedEnd"]').click();
    cy.contains('**** **** **** 4242').click({ force: true });

    cy.contains('REVIEW & SAVE').click();
    cy.get('[class="MuiButton-label"]')
      .eq(3)
      .click();
  });
  //End of file
});
