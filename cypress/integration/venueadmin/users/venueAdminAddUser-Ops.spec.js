/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';
import { getTestEmailString } from '../../../utils/fakerUtil';
const faker = require('faker');

let userData = {
  randomFName: faker.name.firstName(),
  randomLName: faker.name.lastName(),
  randomNumber: faker.random.number()
};
describe('Admin - Add user: Renter', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  //Start
  it('Logs in as admin, clicks to create new OPS, then cancels, repeats and saves', () => {
    //Add user but cancel
    cy.contains('USERS').click();
    cy.contains('ADD USER').click();
    cy.get('[name="firstName"]')
      .focus()
      .type(userData.randomFName);
    cy.get('[name="lastName"]')
      .focus()
      .type(userData.randomLName);

    cy.get('[name="email"]')
      .focus()
      .type(getTestEmailString());
    cy.get('[name="phone"]').type('5125551212');
    //cy.contains('OPERATIONS').click()
    cy.contains('CANCEL').click();

    //Add user and save
    cy.contains('USERS').click();
    cy.contains('ADD USER').click();
    cy.get('[name="firstName"]')
      .focus()
      .type(userData.randomFName);
    cy.get('[name="lastName"]')
      .focus()
      .type(userData.randomLName);

    cy.get('[name="email"]')
      .focus()
      .type(getTestEmailString());
    cy.get('[name="phone"]').type('5125551212');
    //cy.contains('OPERATIONS').click()
    cy.get('[type="submit"]').click();

    //Search for new user
    cy.contains('USERS').click();
    cy.contains('SHOW FILTERS').click();
    cy.get('[id="FIRST NAME"]')
      .focus()
      .type(userData.randomFName);
    cy.get('[id="LAST NAME"]')
      .focus()
      .type(userData.randomLName);
    cy.get('[data-testid="filters-apply-btn"]').click();
  });

  //End of file
});
