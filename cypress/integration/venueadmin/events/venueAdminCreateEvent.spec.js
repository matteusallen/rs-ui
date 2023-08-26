/// <reference types="cypress" />
import { getConstants } from '../../../fixtures/getConstants';
const faker = require('faker');

let userData = {
  randomNumber: faker.random.number()
};

describe('Admin - Create new event', () => {
  before('Login', function() {
    cy.clearCookies();
    // Login as venue admin
    cy.venueAdminLogin(getConstants());
  });

  // **** THIS SECTION SETS THE DATES FROM CURRENT TO +x IN THE FUTURE ************
  var myCurrentDate = new Date().toLocaleDateString({ day: 'numeric' });
  var myEndDateCalc = new Date(myCurrentDate);
  // ****************** CHANGE # OF DAYS IN THE FUTURE VALUE BELOW ****************
  myEndDateCalc.setDate(myEndDateCalc.getDate() + 7); //CHANGE THIS NUMBER VALUE
  // ******************************************************************************
  var myEndDate = myEndDateCalc.toLocaleDateString({ day: 'numeric' });
  // ******************* END OF DATE SET & CALC CODE ******************************

  //Login
  it('Logs in as admin, creates new event', async () => {
    cy.contains('EVENTS').click();
    //cy.wait(500) //wait 1/2 second
    cy.contains('CREATE EVENT').click();
    //BASIC INFORMATION
    cy.get('[name="eventName"]')
      .type('Automation Test Event ')
      .type(userData.randomNumber);
    cy.get('[name="eventDescription"]').type('This is a test');

    // ********** SETS THE DATES **************
    const startDate = cy.get('[placeholder="Start Date"]');
    startDate.focus();
    startDate.type(myCurrentDate, { force: true });

    const endDate = cy.get('[placeholder="End Date"]');
    endDate.focus();
    startDate.type(myEndDate, { force: true });

    const openDate = cy.get('[placeholder="Open Date"]');
    openDate.focus();
    startDate.type(myCurrentDate, { force: true });

    const closeDate = cy.get('[placeholder="Close Date"]');
    closeDate.focus();
    closeDate.type(myEndDate, { force: true });

    // Get a hold of the Venue agreement drop-down and click to open
    const venueAgreementDiv = cy.get('[id="mui-component-select-venueAgreement"]');
    venueAgreementDiv.should('exist');
    venueAgreementDiv.click();

    // The list of agreements should appear
    const venueAgreementMenuPopoverRoot = cy.get('[id="menu-venueAgreement"]');
    venueAgreementMenuPopoverRoot
      .should('exist')
      .get('.MuiPopover-paper > ul > li')
      .eq(1)
      .should('exist');
    // Click the 1st item (index #0)
    const selectedDocument = cy
      .get('.MuiPopover-paper > ul > li')
      .eq(0)
      .click();

    selectedDocument.should('exist');

    // ************************
    // Create some addOns
    const addAddOnButton = cy.contains('+ ADD ON');
    addAddOnButton.should('exist');
    addAddOnButton.click();

    const addOnCard = cy.get('[class="card-row addOn"]');
    const addOnSelect = addOnCard.find('[class="card-select"]');
    addOnSelect.click();

    // Select the first add on in the list
    cy.get('.MuiPopover-paper > ul > li')
      .eq(0)
      .click();

    // Add a quantity
    const qtyInput = cy.get('[name="addOns[0].price"]');
    qtyInput.should('exist');
    qtyInput.type('2');

    // Remove the add on
    const deleteBtn = cy.get('[class="remove-addOn"]');
    deleteBtn.click();
    qtyInput.should('not.exist');

    // Re-enter the addOn info
    cy.contains('+ ADD ON')
      .should('exist')
      .click();

    cy.get('[class="card-row addOn"]')
      .find('[class="card-select"]')
      .click();
    // Select the second add on in the list
    cy.get('.MuiPopover-paper > ul > li')
      .eq(1)
      .click();

    const qtyInputRedo = cy.get('[name="addOns[0].price"]');
    qtyInputRedo.should('exist');
    qtyInputRedo.type('3');
    //ADD ON: MATS
    const addAddOnButton1 = cy.contains('+ ADD ON');
    addAddOnButton1.should('exist');
    addAddOnButton1.click();

    const addOnCard1 = cy.get('[class="card-row addOn"]');
    const addOnSelect1 = addOnCard1.find('[id="mui-component-select-addOns[1].id"]');
    addOnSelect1.click();
    // Select the first add on in the list
    cy.get('.MuiPopover-paper > ul > li') //MATS
      .eq(0)
      .click();

    // Add a quantity
    const qtyInput1 = cy.get('[name="addOns[1].price"]');
    qtyInput1.should('exist');
    qtyInput1.type('5');

    //ADD ON: HAY
    const addAddOnButton2 = cy.contains('+ ADD ON');
    addAddOnButton2.should('exist');
    addAddOnButton2.click();

    const addOnCard2 = cy.get('[class="card-row addOn"]');
    const addOnSelect2 = addOnCard1.find('[id="mui-component-select-addOns[2].id"]');
    addOnSelect2.click();
    // Select the first add on in the list
    cy.get('.MuiPopover-paper > ul > li') //MATS
      .eq(0)
      .click();

    // Add a quantity
    const qtyInput2 = cy.get('[name="addOns[2].price"]');
    qtyInput2.should('exist');
    qtyInput2.type('7');

    cy.contains('NEXT: ADD STALLS').click();
    // ****************************************
    //                STALLS
    // ****************************************
    //Enable Stalls Toggle
    const stallsToggle = cy.get('[class="MuiSwitch-root"]');
    stallsToggle.click();

    cy.get('[name="stalls[0].name"]').type('Barn 10');
    cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-text active-button"]').click();
    cy.contains('DESELECT ALL').click();
    cy.contains('BARN 10 (0/30)').click();
    //Expand to de-select spots
    cy.get('[id="building-1"]').click(); //Expands barn listing
    //Remove stalls from the listing
    cy.get('[class="stall-listing selected"]')
      .contains('1')
      .click();
    cy.get('[class="stall-listing selected"]')
      .contains('3')
      .click();
    cy.get('[name="stalls[0].entireEvent"]').click(); //Entire Event
    cy.get('[value="flat"]').click(); //Flat Rate
    cy.get('[name="stalls[0].price"]').type('100');

    //ADD ANOTHER BARN
    cy.contains('ADD ANOTHER RATE').click();
    cy.get('[name="stalls[1].name"]').type('Barn 11');

    cy.get('[type="checkbox"]')
      .eq(6)
      .click();
    cy.get('[id="building-2"]')
      .eq(1)
      .click(); //Expands barn listing
    //Remove stalls from the listing
    cy.get('[class="stall-listing selected"]')
      .contains('101')
      .click();
    cy.get('[class="stall-listing selected"]')
      .contains('103')
      .click();
    cy.get('[class="stall-listing selected"]')
      .contains('TEST')
      .click();

    //Add Dates
    cy.get('[class="DateInput DateInput_1"]')
      .first()
      .find('[id="startDate"]')
      .should('exist')
      .focus()
      .type(myCurrentDate, { force: true });
    // End date
    cy.get('[class="DateInput DateInput_1"]')
      .last()
      .find('[id="endDate"]')
      .should('exist')
      .focus()
      .type(myEndDate, { force: true });

    //cy.get('[name="stalls[1].entireEvent"]').click()
    cy.get('[value="nightly"]')
      .last()
      .click();
    cy.get('[name="stalls[1].price"]').type('150');
    cy.contains('NEXT: ADD RV SPOTS').click();
    // ****************************************
    //                RV
    // ****************************************
    //Enable RV Toggle
    const rvToggle = cy.get('[class="MuiSwitch-root"]');
    rvToggle.click();
    //Add Lot
    cy.get('[id="mui-component-select-rvs[0].rvLotId"]').click();
    cy.get('[class="MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]')
      .contains('Rv Lot #1')
      .click();
    cy.get('[class="action "]').click();
    //cy.get('[class="rv-item "]')
    //.contains('RV1')
    //.click()
    cy.contains('RV1').click();
    cy.contains('RV1').click();
    cy.contains('RV1').click();
    cy.contains('RV28').click();
    //cy.contains('TEST').click()
    cy.get('[name="rvs[0].price"]').type('75');
    //ADD ANOTHER RV LOT
    cy.contains(' ADD ANOTHER RV LOT').click();
    cy.get('[id="mui-component-select-rvs[1].rvLotId"]').click();
    cy.get('[class="MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"]')
      .contains('Second RV Lot')
      .click();
    cy.get('[class="action "]')
      .last()
      .click();
    cy.contains('RV31').click();
    cy.contains('RV31').click();
    cy.contains('RV31').click();
    cy.contains('RV32').click();
    cy.get('[name="rvs[1].price"]').type('115');
    cy.contains('REVIEW & SAVE').click();
    // ****************************************
    //              EDIT
    // ****************************************
    cy.get('[class="MuiButton-label"]')
      .contains('Edit')
      //.eq(1)
      .click();
    cy.wait(1000); //Waits 1 second then clicks through each tab
    cy.contains('STALLS').click();
    cy.wait(500);
    cy.contains('RV SPOTS').click();
    cy.wait(500);
    cy.contains('REVIEW & SAVE').click();

    // ***************************************
    //            SAVE
    // ***************************************
    //cy.get('[class="MuiButton-label"]')
    //  .eq(3)
    //  .click()

    // ***************************************
    //    SEARCH FOR NEWLY-CREATED EVENT
    // ***************************************
    //cy.contains('SHOW FILTERS').click()
    //cy.get('[id="NAME"]').type('Automation Test Event ')
    //.type(userData.randomNumber)
    //cy.get('[data-testid="filters-apply-btn"]').click()
  });
  //End of file
});
