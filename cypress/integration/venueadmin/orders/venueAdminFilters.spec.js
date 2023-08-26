/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';

describe('Reservation Admin tests', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as reservation admin
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
  it('Venue admin - interacting with filters', () => {
    //User
    cy.get('[name="user"]').type('gerd'); //WORKS! :)

    // Can only filter EITHER or Stall OR Spot - NOT BOTH
    //Stall
    //cy.get('[name="stallName"]').type('2')  //WORKS! :)

    //Spot
    //cy.get('[name="rvSpotName"]').type('102') //WORKS! :)

    //Event
    //cy.get('[name="event"]').type('OS-200') //WORKS! :)

    //Check in/out date
    cy.get('[id="demo-simple-select-outlined"]')
      .eq(0)
      .click();
    //cy.wait(500)
    //cy.get('[name="checkInOutDate"]').click()
    //cy.get('[data-value="today"]').click() //Today
    //cy.get('[data-value="next-seven"]').click() //Next 7 Days
    //cy.get('[data-value="this-month"]').click() //This Month
    cy.get('[data-value="custom"]').click(); //Custom
    cy.wait(500); //wait 1/2 second
    cy.get('[name="filter_startDate"]')
      .focus()
      .type('11/30/2020'); //CHANGE START DATE AS NEEDED
    cy.get('[name="filter_endDate')
      .focus()
      .type(myCurrentDate, { force: true }); //today. CHANGE TO HARD-CODED DATE IF NEEDED

    //Status
    cy.get('[id="demo-simple-select-outlined"]')
      .eq(1)
      .click();
    //cy.get('[id="MuiSelect-nativeInput"]')
    //  .eq(1)
    //  .click()
    cy.contains('Reserved').click();
    //cy.contains('Checked In').click()
    //cy.contains('Departed').click()
    //cy.contains('Canceled').click()

    //Included in Reservation checkboxes  //WORKS! :)
    cy.contains('Stalls').click();
    cy.contains('RVs').click();
    cy.contains('Add Ons').click();

    //Stall/RV Spot Assignment checkboxes  //WORKS! :)
    //cy.contains('Needs Assignment').click()
    cy.contains('Stall/Spot Assigned').click();

    //Apply Filters button  //WORKS! :)
    cy.contains('apply filters').click();

    //BULK ACTIONS
    //Stall Assignment
    cy.get('[id="row-selection-info"]').click();
    cy.contains('Bulk Actions').click();
    cy.contains('Send Stall Assignments').click(); //WORKS
    cy.contains('CANCEL').click();
    //cy.contains('SEND').click()

    //RV Spot Assignment
    cy.contains('Bulk Actions').click();
    cy.contains('Send RV Spot Assignments').click(); //WORKS
    cy.contains('CANCEL').click();
    //cy.contains('SEND').click()

    //Custom Message
    cy.contains('Bulk Actions').click();
    cy.contains('Send Custom Message').click();
    cy.get('[name="customMessage"]').type('This is a test');
    cy.contains('CANCEL').click();
    //cy.contains('SEND').click()

    //Clear Filters button  //WORKS! :)
    cy.contains('clear filters').click();
  });
  //End of file
});
