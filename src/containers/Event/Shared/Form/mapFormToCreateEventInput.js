//@flow
import type { CreateAddOnProductInputType, CreateEventInputType, CreateRVProductInputType, StallProductInputType } from '../../../../mutations/CreateEvent';
import type { AddOnsFormType, EventFormType, StallProductType } from './FormTypes';
import moment from 'moment';
import { isNullOrWhiteSpace } from '../../../../utils/stringHelpers';

const mapStallProducts = (stalls: StallProductType[]): StallProductInputType[] =>
  stalls.map(stall => ({
    description: '',
    endDate: stall.dateRange.endDate || '',
    name: stall.name,
    nightly: stall.pricing === 'nightly',
    price: Number(stall.price),
    stalls: stall.stallsForThisRate,
    startDate: stall.dateRange.startDate || '',
    minNights: stall.minNights ? +stall.minNights : 1
  }));

const mapRvProducts = ({ rvs }: EventFormType): CreateRVProductInputType[] =>
  rvs.map(rv => {
    return {
      description: '',
      endDate: rv.dateRange?.endDate || '',
      name: rv.rvLot ? rv.rvLot.name : '',
      price: Number(rv.price),
      nightly: rv.pricing === 'nightly',
      rvLotId: rv.rvLotId,
      rvSpots: rv.spots,
      startDate: rv.dateRange?.startDate || '',
      minNights: rv.minNights ? +rv.minNights : 1
    };
  });

const mapAddOnProducts = (addOns: AddOnsFormType[]): CreateAddOnProductInputType[] =>
  addOns.map((addOn = {}) => ({
    addOnId: addOn.id,
    price: Number(addOn.price ? addOn.price : 0),
    disabled: 'disabled' in addOn ? addOn.disabled : false
  }));

export const mapFormToEditEventInput = (form: EventFormType, id: string): CreateEventInputType => {
  return {
    id,
    ...mapFormToCreateEventInput(form)
  };
};

export const mapFormToCreateEventInput = (form: EventFormType): CreateEventInputType => {
  const stallQuestions = form.stallQuestions.map((question, i) => {
    question.listOrder = i;
    delete question.id;
    delete question.__typename;
    question.answerOptions = question.answerOptions.map(answer => answer.text);
    addLengthProps(question);
    return question;
  });

  const rvQuestions = form.rvQuestions.map((question, i) => {
    question.listOrder = i;
    delete question.id;
    delete question.__typename;
    question.answerOptions = question.answerOptions.map(answer => answer.text);
    addLengthProps(question);
    return question;
  });

  return {
    checkInTime: form.checkInTime,
    checkOutTime: form.checkOutTime,
    closeDate: form.bookingWindow.endDate && form.closeTime ? moment(`${form.bookingWindow.endDate} ${form.closeTime}`) : '',
    openDate: form.bookingWindow.startDate && form.openTime ? moment(`${form.bookingWindow.startDate} ${form.openTime}`) : '',
    endDate: form.eventDates.endDate ? form.eventDates.endDate : '',
    name: form.eventName,
    description: form.eventDescription,
    startDate: form.eventDates.startDate ? form.eventDates.startDate : '',
    venueAgreementDocumentId: form.venueAgreement,
    venueMapDocumentId: form.venueMap || null,
    stallProducts: form.hasStalls ? mapStallProducts(form.stalls) : undefined,
    stallQuestions: stallQuestions,
    rvProducts: form.hasRvs ? mapRvProducts(form) : undefined,
    rvQuestions: rvQuestions,
    stallFlip: form.stallFlip,
    rvFlip: form.rvFlip,
    addOnProducts: form.addOns.length ? mapAddOnProducts(form.addOns) : undefined,
    renterGroupCodeMode: form.renterGroupCodeMode
  };
};

const addLengthProps = question => {
  question.minLength = isNullOrWhiteSpace(question.minLength) ? null : Number(question.minLength);
  question.maxLength = isNullOrWhiteSpace(question.maxLength) ? null : Number(question.maxLength);
};
