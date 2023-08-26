/// <reference types="cypress" />
import { getTestEmailString } from '../../utils/fakerUtil';

describe('Sign-up tests', () => {
  it('Sign Up blocked - Policies not accepted', () => {
    cy.viewport(1960, 1280);
    cy.visit('http://open-stalls-app-dev.herokuapp.com/');
    cy.contains('SIGN UP NOW').click();
    cy.url().should('include', '/create-account');
    cy.get('[name="email"]')
      .focus()
      .type('automation-test-12072020@mailinator.com');
    cy.get('[name="password"]')
      .focus()
      .type('Openstalls01');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });

    // Error message
    cy.get('[data-testid="e2e-auth-error"]').contains(
      'You must please read and accept the "Terms of Use", "Privacy Policy" and "End User Agreement" before proceeding'
    );
  });
  it('Sign Up fails if email already used', () => {
    cy.viewport(1960, 1280);
    cy.visit('http://open-stalls-app-dev.herokuapp.com/');
    cy.contains('SIGN UP NOW').click();
    cy.url().should('include', '/create-account');
    cy.get('[name="email"]')
      .focus()
      .type('automation-test-12072020@mailinator.com');
    cy.get('[name="password"]')
      .focus()
      .type('Openstalls01');

    // PRIVACY CHECKBOX
    cy.get('[data-testid="privacy-checkbox"]')
      .find('input')
      .should('exist')
      .check({ force: true });

    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });

    // Error message if email already entered
    cy.get('[data-testid="e2e-auth-error"]').contains('There is already an account associated with this email');
  });
  it('Sign Up successful', () => {
    cy.viewport(1960, 1280);
    cy.visit('http://open-stalls-app-dev.herokuapp.com/');
    cy.contains('SIGN UP NOW').click();
    cy.url().should('include', '/create-account');
    cy.get('[name="email"]')
      .focus()
      .type(getTestEmailString());
    cy.get('[name="password"]')
      .focus()
      .type('Openstalls01');

    // PRIVACY CHECKBOX
    cy.get('[data-testid="privacy-checkbox"]')
      .find('input')
      .should('exist')
      .check({ force: true });

    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });

    // User should be logged in and looking at events sign-up page
    cy.url().should('include', '/events');
  });
  //End of file
});
