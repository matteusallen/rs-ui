/// <reference types="cypress" />
import { getConstants } from '../../fixtures/getConstants';

describe('Ops - Filter tests', () => {
  beforeEach('Login', function() {
    cy.clearCookies();
    // Login as ops user
    cy.opsLogin(getConstants());
  });

  it('Use CLEAN status filter on operation landing page. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="mui-component-select-STATUS"]').click();
    // Get the CLEAN filter
    cy.get('[data-value="clean"]').click();

    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // TODO - Do some check here for expected results with CLEAN filter applied

    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
    // TODO - Do some check here for expected results with CLEAN filter cleared
  });

  it('Use DIRTY status filter on operation landing page. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="mui-component-select-STATUS"]').click();
    // Get the DIRTY filter
    cy.get('[data-value="dirty"]').click();

    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // TODO - Do some check here for expected results with DIRTY filter applied

    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
    // TODO - Do some check here for expected results with DIRTY filter cleared
  });

  it('Use OCCUPIED status filter on operation landing page. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="mui-component-select-STATUS"]').click();
    // Get the OCCUPIED filter
    cy.get('[data-value="occupied"]').click();

    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // TODO - Do some check here for expected results with OCCUPIED filter applied

    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
    // TODO - Do some check here for expected results with OCCUPIED filter cleared
  });

  it('Filter on Barn 11. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="mui-component-select-STALL LOCATION"]').click();
    // Get the Barn 11 filter
    //cy.get('[data-value="Barn 11"]').click()
    cy.contains('Barn 11').click();

    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // TODO - Do some check here for expected results with CLEAN filter applied

    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
    // TODO - Do some check here for expected results with CLEAN filter cleared
  });
  it('Filter on Stall #. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="STALL NUMBER"]')
      .click()
      // Get the Barn 11 filter
      //cy.get('[data-value="Barn 11"]').click()
      //cy.contains('4').click()
      .type('4');
    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
  });
  it('Filter on Check In. Downloads report, then clears filter', () => {
    // Open filter
    cy.get('[data-testid="filters-toggle"]').click();
    cy.get('[id="date_input"]').click();
    // Get the Barn 11 filter
    //cy.get('[data-value="Barn 11"]').click()
    //cy.contains('4').click()
    cy.get('[aria-label="Friday, December 25, 2020"]').click(); //CHANGE ME
    // Apply filter
    cy.get('[data-testid="filters-apply-btn"]').click();
    cy.contains('EXPORT REPORT').click();
    cy.wait(1000); //wait 1 second
    // Clear filter
    const statusChip = cy.get('.MuiChip-deletable');
    const deleteStatusChipIcon = statusChip.children('.MuiChip-deleteIcon');
    deleteStatusChipIcon.click();
    cy.wait(1000); //wait 1 second
    cy.get('[data-testid="admin-logout-btn"]').click(); //LOG OUT
  });
  //End of file
});
