/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Venue Admin - Book RV Spots only', () => {
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
  it('Logs in as venue admin, books RV spots only', () => {
    cy.contains('CREATE NEW').click();
    cy.get('[name="renterInformation.email"]')
      .click()
      .type('irmagerd');
    cy.contains('irmagerd@mailinator.com').click();
    //Search for and select event
    cy.get('[id="mui-component-select-EVENT"]').click();
    //  .type('OS-200')
    cy.contains('OS-200').click();

    //Enable Stalls Toggle
    const stallsToggle = cy.get('[class="MuiSwitch-root"]');
    stallsToggle.eq(0).click();

    //Stalls Section
    cy.get('[name="stalls.quantity"]').type(2);
    // ****************** SETS THE DATES ************************
    cy.get('[name="startDate"]').type(myCurrentDate, { force: true });
    cy.get('[name="endDate"]').type(myEndDate, { force: true });
    // ************************************************************
    //Click SELECT for stall rate
    cy.get('[data-testid="product-row-0-stalls-button"]').click();
    // SELECT STALL # 4 & 5
    cy.get('[id="stall-button-4"]').click();
    cy.get('[id="stall-button-5"]').click();
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
