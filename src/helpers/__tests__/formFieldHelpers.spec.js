//@flow
import moment from 'moment';

import { hasProductsSelectedForPurchase, hasSelectedAddOnProduct, hasSelectedRvProduct, hasSelectedStallProduct } from '../formFieldHelpers';

import type { ProductFormType } from '../../types/FormTypes';

describe('formFieldHelper tests', () => {
  let formValueArgument: ProductFormType = {};

  beforeEach(() => {
    formValueArgument = {
      stalls: {
        quantity: null,
        start: null,
        end: null
      },
      stallProductId: null,
      rv_spot: {
        quantity: null,
        start: null,
        end: null
      },
      rvProductId: null,
      addOns: null,
      addOnsQuantities: []
    };
  });
  describe('hasSelectedStallProduct tests', () => {
    test('Return false before any product is selected by user', () => {
      // act
      // assert
      expect(hasSelectedStallProduct(formValueArgument)).toEqual(false);
    });

    test('Return true if a stall product is selected', () => {
      // assemble
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = moment('10-27-2020');
      formValueArgument.stalls.end = moment('10-28-2020');
      formValueArgument.stallProductId = '10';
      // act
      // assert
      expect(hasSelectedStallProduct(formValueArgument)).toEqual(true);
    });

    test('Return false if a stall product is partially selected', () => {
      // assemble (one prop null)
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = moment('10-27-2020');
      formValueArgument.stalls.end = moment('10-28-2020');
      formValueArgument.stallProductId = null;
      // act
      // assert
      expect(hasSelectedStallProduct(formValueArgument)).toEqual(false);
    });

    test('Returns false if selected RV rate but no selected stall rate', () => {
      // assemble
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = '10-27-2020';
      formValueArgument.stalls.end = '10-28-2020';

      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = '10-27-2020';
      formValueArgument.rv_spot.end = '10-28-2020';
      formValueArgument.rvProductId = '22';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(false);
    });
  });

  describe('hasSelectedRvProduct tests', () => {
    test('Return false before any product is selected by user', () => {
      // act
      // assert
      expect(hasSelectedRvProduct(formValueArgument)).toEqual(false);
    });

    test('Return true if an RV product is selected', () => {
      // assemble
      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = moment('10-27-2020');
      formValueArgument.rv_spot.end = moment('10-28-2020');
      formValueArgument.rvProductId = '10';
      // act
      // assert
      expect(hasSelectedRvProduct(formValueArgument)).toEqual(true);
    });

    test('Return false if an RV product is partially selected', () => {
      // assemble (one prop null)
      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = moment('10-27-2020');
      formValueArgument.rv_spot.end = moment('10-28-2020');
      formValueArgument.rvProductId = null;
      // act
      // assert
      expect(hasSelectedRvProduct(formValueArgument)).toEqual(false);
    });

    test('Returns false if selected stall rate but no selected RV rate', () => {
      // assemble
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = '10-27-2020';
      formValueArgument.stalls.end = '10-28-2020';
      formValueArgument.stallProductId = '22';

      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = '10-27-2020';
      formValueArgument.rv_spot.end = '10-28-2020';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(false);
    });
  });

  describe('hasSelectedAddOnProduct tests', () => {
    test('Return false before any product is selected by user', () => {
      // act
      // assert
      expect(hasSelectedAddOnProduct(formValueArgument)).toEqual(false);
    });

    test('Return true if an add-on product is selected', () => {
      // assemble
      formValueArgument.addOns = {
        product1: 'product1',
        product2: 'product2'
      };
      formValueArgument.addOnsQuantities = ['1', '3'];
      // act
      // assert
      expect(hasSelectedAddOnProduct(formValueArgument)).toEqual(true);
    });

    test('Returns false if addOn is correct, but no selected stall rate', () => {
      // assemble
      formValueArgument.addOns = {
        product1: 'product1',
        product2: 'product2'
      };
      formValueArgument.addOnsQuantities = ['1', '3'];

      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = '10-27-2020';
      formValueArgument.stalls.end = '10-28-2020';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(false);
    });

    test('Returns false if addOn is correct, but no selected RV rate', () => {
      // assemble
      formValueArgument.addOns = {
        product1: 'product1',
        product2: 'product2'
      };
      formValueArgument.addOnsQuantities = ['1', '3'];

      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = '10-27-2020';
      formValueArgument.rv_spot.end = '10-28-2020';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(false);
    });
  });

  describe('hasProductsSelectedForPurchase tests', () => {
    test('Return false before any product is selected by user', () => {
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(false);
    });

    test('Return true if only a stall product is selected', () => {
      // assemble
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = '10-27-2020';
      formValueArgument.stalls.end = '10-28-2020';
      formValueArgument.stallProductId = '10';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(true);
    });

    test('Return true if an add-on and RV product selected', () => {
      // assemble
      formValueArgument.stalls.quantity = '1';
      formValueArgument.stalls.start = '10-27-2020';
      formValueArgument.stalls.end = '10-28-2020';
      formValueArgument.stallProductId = '10';

      formValueArgument.rv_spot.quantity = '1';
      formValueArgument.rv_spot.start = '10-27-2020';
      formValueArgument.rv_spot.end = '10-28-2020';
      formValueArgument.rvProductId = '22';
      // act
      // assert
      expect(hasProductsSelectedForPurchase(formValueArgument)).toEqual(true);
    });
  });
});
