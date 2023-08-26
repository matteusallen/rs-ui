//@flow
import moment from 'moment';

import type { EventFormType } from './FormTypes';

export const emptyStallCard = {
  dateRange: { startDate: null, endDate: null },
  entireEvent: false,
  name: '',
  price: '',
  pricing: '',
  stallsForThisRate: []
};

export const emptyRvCard = {
  price: '',
  pricing: '',
  rvLotId: '',
  spots: [],
  dateRange: { startDate: null, endDate: null }
};

export const emptyQuestionCard = {
  id: 1,
  question: '',
  answerOptions: [{ id: 1, text: null }],
  questionType: 'singleSelection',
  required: false,
  listOrder: 0
};

const getAddOns = addOnProducts =>
  addOnProducts.map(addonProduct => ({
    addOnProductId: addonProduct.id,
    id: addonProduct.addOn.id,
    price: addonProduct.price,
    name: addonProduct.addOn.name,
    unitName: addonProduct.addOn.unitName,
    booked: addonProduct.booked,
    disabled: addonProduct.disabled
  }));

export const initialValues: EventFormType = event => ({
  hasStalls: !!event?.stallProducts?.length || false,
  hasRvs: !!event?.rvProducts?.length || false,
  step: 'details',
  eventDates: { startDate: event?.startDate || null, endDate: event?.endDate || null },
  bookingWindow: {
    startDate: event?.openDate ? moment(event.openDate).format('MM/DD/YYYY') : null,
    endDate: event?.closeDate ? moment(event.closeDate).format('MM/DD/YYYY') : null
  },
  stallQuestions: mapProductQuestions(event, 'stallQuestions'),
  rvQuestions: mapProductQuestions(event, 'rvQuestions'),
  openTime: event?.openDate ? moment(event.openDate).format('HH:mm') : '00:00',
  closeTime: event?.closeDate ? moment(event.closeDate).format('HH:mm') : '23:59',
  checkInTime: event?.checkInTime || '15:00',
  checkOutTime: event?.checkOutTime || '12:00',
  eventDescription: event?.description || '',
  stalls: mapStalls(event),
  eventName: event?.name || '',
  addOns: event?.addOnProducts?.length ? getAddOns(event.addOnProducts) : [],
  rvs: mapRVs(event),
  stallFlip: getFlipValue(event?.stallFlip),
  rvFlip: getFlipValue(event?.rvFlip),
  venueAgreement: event?.venueAgreement?.id || '',
  venueMap: event?.venueMap?.id || null,
  validSections: event?.validSections || null,
  isLoading: false,
  agreements: event?.agreements || [],
  allowDefferedEnabled: event?.isGroupCodeRequired === true || event?.isGroupCodeRequired === false || false,
  renterGroupCodeMode: event?.isGroupCodeRequired === true ? 'secured' : event?.isGroupCodeRequired === false ? 'unsecured' : '',
  hasOrders: event?.orders.length || 0
});

const mapProductQuestions = (event, productQuestions) => {
  return event && event[productQuestions] ? mapAnswers(event[productQuestions]) : [];
};

const mapAnswers = questions => {
  const mappedAnswers = questions.map(question => {
    const answerOptions = question.answerOptions.map((answer, index) => ({ id: index + 1, text: answer }));
    return { ...question, answerOptions };
  });

  return mappedAnswers;
};

const mapStalls = event =>
  event?.stallProducts.map(stallProduct => {
    (stallProduct.dateRange = {
      startDate: stallProduct.startDate,
      endDate: stallProduct.endDate
    }),
      (stallProduct.entireEvent = isEntireEvent(event, stallProduct)),
      (stallProduct.pricing = stallProduct.nightly ? 'nightly' : 'flat'),
      (stallProduct.stallsForThisRate = stallProduct.stalls.map(stall => stall.id));
    return stallProduct;
  });

const mapRVs = event => {
  return event?.rvProducts ? mapRVLotsInfo(event.rvProducts, event) : [];
};

const mapRVLotsInfo = (rvProducts, event) => {
  return rvProducts.map(rvProduct => {
    rvProduct.rvLotId = rvProduct.rvLot.id;
    rvProduct.dateRange = { startDate: rvProduct.startDate, endDate: rvProduct.endDate };
    rvProduct.entireEvent = isEntireEvent(event, rvProduct);
    rvProduct.pricing = rvProduct.nightly ? 'nightly' : 'flat';
    rvProduct.spots = rvProduct.rvSpots.map(rvSpot => rvSpot.id);
    return rvProduct;
  });
};

const isEntireEvent = (event, product) => {
  const hasEventStartDate = event.startDate === product.startDate;
  const hasEventEndDate = event.endDate === product.endDate;
  return hasEventStartDate && hasEventEndDate;
};

const getFlipValue = flipValue => {
  return typeof flipValue === 'boolean' ? flipValue : true;
};
