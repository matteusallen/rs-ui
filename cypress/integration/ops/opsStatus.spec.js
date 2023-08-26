/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Ops - Status tests', () => {
  beforeEach('Login', function() {
    cy.clearCookies();
    // Login as ops user
    cy.opsLogin(getConstants());
  });

  it('Change the status of an individual stall to DIRTY', () => {
    // Table head should exist
    cy.get('.MuiTableHead-root').should('exist');

    // Table body should exist (two diff ways of writing it - class or tag name)
    cy.get('.MuiTableBody-root').should('exist');
    cy.get('tbody').should('exist');

    // Get all the table rows
    const allTRs = cy.get('.MuiTableBody-root').children();

    // Get the first table row
    const firstTR = cy.get('tbody>tr').eq(0);
    firstTR.should('exist');
    // Or shorter version if you don't need to do anything wiht firstTR...
    cy.get('tbody>tr')
      .eq(0)
      .should('exist');

    // Get the fourth table row and verify it's there
    cy.get(':nth-child(3) > tbody > tr').should('exist');

    // Get the dropdown from the fourth row
    // Get fourth row
    const fourthRow = cy.get('tbody > tr').eq(3);
    // Go to the fourth colum with the status select
    const fourthDataColumn = fourthRow.get(':nth-child(4) > td');

    // Drill down inside the table data (TD) element to click the select
    const elementToSelect = fourthDataColumn.eq(3).then(element => {
      // Changing the cell backgroubd to yellow for debugging
      element.css('backgroundColor', 'yellow');
      return element;
    });

    // get the selectable element (hint: the nested input tag is not selectable)
    elementToSelect.click();

    // Now get the 2nd item in the dropdown list (DIRTY)
    cy.get('.MuiPopover-paper > ul > li')
      .eq(1)
      .should('exist');
    cy.get('.MuiPopover-paper > ul > li')
      .eq(1)
      .click();

    // The cell should now be set to DIRTY
    const cellText = elementToSelect
      .first()
      .first()
      .first()
      .then(element => {
        // This is just an example of displaying the contents of the element to the console
        console.log(element[0].innerHTML);
        return element;
      });

    // Assert
    cellText.should('contain', 'DIRTY');
  });

  //End of file
});
