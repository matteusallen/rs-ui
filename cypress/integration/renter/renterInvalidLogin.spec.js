/// <reference types="cypress" />
//import { getConstants } from '../../fixtures/getConstants'

describe('Pre-login tests', () => {
  it('No email, no password', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
      .eq(0)
      .should('contain', 'PLEASE ENTER AN EMAIL ADDRESS TO SIGN IN');
    cy.get('[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
      .eq(1)
      .should('contain', 'PLEASE ENTER A PASSWORD TO SIGN IN');
  });
  it('Invalid email, no password', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');

    cy.get('[name="email"]')
      .click({ force: true })
      .type('invalid@anywhere');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]').should('contain', 'PLEASE ENTER A PASSWORD TO SIGN IN');
  });
  it('No email, invalid password', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('invalid@anywhere');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiFormHelperText-root MuiFormHelperText-contained Mui-error"]')
      .eq(0)
      .should('contain', 'PLEASE ENTER AN EMAIL ADDRESS TO SIGN IN');
  });
  it('Bad email, bad password', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');
    cy.get('[name="email"]')
      .click({ force: true })
      .type('123@123.com');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('123');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="sc-chPdSV fyOqKk__error-banner e2e-auth-error"]').contains('Incorrect email or password.');
  });
  it('Good email, bad password', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');
    cy.get('[name="email"]')
      .click({ force: true })
      .type('qa-renter@mail.com');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('111');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="sc-chPdSV fyOqKk__error-banner e2e-auth-error"]').contains('Incorrect email or password.');
  });
  it('Good email, good password. Then Logs Out', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/login');
    cy.get('[name="email"]')
      .click({ force: true })
      .type('qa-renter@mail.com');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('123');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiSvgIcon-root"]').click(); // LOG OUT
  });
  it('Logs in via 1st BOOK NOW link. Then Logs Out', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/');
    cy.contains('BOOK NOW')
      .eq(0)
      .click();
    cy.get('[name="email"]')
      .click({ force: true })
      .type('qa-renter@mail.com');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('123');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiSvgIcon-root"]').click(); // LOG OUT
  });
  it('Logs in via 1st BOOK RV SPOT ONLY link. Then Logs Out', () => {
    cy.visit('http://open-stalls-app-dev.herokuapp.com/');
    cy.contains('Book RV spot only')
      //.eq(0)
      .click();
    cy.get('[name="email"]')
      .click({ force: true })
      .type('qa-renter@mail.com');
    cy.get('[name="password"]')
      .click({ force: true })
      .type('123');
    cy.get('[data-testid="auth-form-submit-button"]').click({ force: true });
    cy.get('[class="MuiSvgIcon-root"]').click(); // LOG OUT
  });
  //End of file
});
