/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Reservation Admin tests', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as reservation admin
    cy.reservationAdminLogin(getConstants());
  });

  it('Interacting with filters', () => {
    //User
    cy.get('[name="user"]').type('gerd'); //WORKS! :)

    //Stall
    //cy.get('[name="stallName"]').type('2')  //WORKS! :)

    //Spot (to be added once this is built out)

    //Event
    cy.get('[name="event"]').type('WKRP'); //WORKS! :)

    //Check in/out date
    //cy.get('[name="checkInOutDate"]').click()    //<-CAN'T INTERACT WITH THIS
    //cy.get('[data-value="today"]').click() //Today
    //cy.get('[data-value="next-seven"]').click() //Next 7 Days
    //cy.get('[data-value="this-month"]').click() //This Month
    //cy.get('[data-value="custom"]').click() //Custom  <- NEED A WAY TO INTERACT WITH CALENDAR THAT APPEARS

    //Status
    //cy.get('[name="reservationStatus"]').click()   //<-CAN'T INTERACT WITH THIS
    //cy.contains('Reserved').click()
    //cy.contains('Checked In').click()
    //cy.contains('Departed').click()
    //cy.contains('Canceled').click()

    //Included in Reservation checkboxes  //WORKS! :)
    cy.contains('Stalls').click();
    cy.contains('RVs').click();
    cy.contains('Add Ons').click();

    //Stall/RV Spot Assignment checkboxes  //WORKS! :)
    cy.contains('Needs Assignment').click();
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
    //cy.contains('clear filters').click()
  });
  //End of file
});
