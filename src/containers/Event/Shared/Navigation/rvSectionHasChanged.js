//@flow
import type { EventFormType, RvFormType } from '../Form';
import type { QuestionType } from '../../../../components/CustomQuestions/CustomQuestionCard';

export const rvSectionHasChanged = (initialValues: EventFormType, values: EventFormType) => {
  const flipIsUpdated = checkIfRvFlipWasUpdated(initialValues, values);
  const QuestionsAreUpdated = checkIfRvQuestionsWereUpdated(initialValues, values);
  const productsAreUpdated = checkIfRvProductsWereUpdated(initialValues, values);

  return flipIsUpdated || QuestionsAreUpdated || productsAreUpdated;
};

const checkIfRvFlipWasUpdated = (initialValues: EventFormType, values: EventFormType) => {
  return initialValues.rvFlip !== values.rvFlip;
};

const checkIfRvQuestionsWereUpdated = (initialValues: EventFormType, values: EventFormType) => {
  if (initialValues.rvQuestions.length !== values.rvQuestions.length) {
    return true;
  }
  for (let [index, initialQuestion] of initialValues.rvQuestions.entries()) {
    const newQuestion = values.rvQuestions[index];
    const questionWasUpdated = checkIfQuestionFieldsWereUpdated(initialQuestion, newQuestion);

    if (questionWasUpdated) {
      return true;
    }
  }
  return false;
};

const checkIfQuestionFieldsWereUpdated = (initialQuestion: QuestionType, newQuestion: QuestionType) => {
  const listOrderIsUpdated = initialQuestion.listOrder !== newQuestion.listOrder;
  const maxLengthIsUpdated = initialQuestion.maxLength !== newQuestion.maxLength;
  const minLengthIsUpdated = initialQuestion.minLength !== newQuestion.minLength;
  const questionIsUpdated = initialQuestion.question !== newQuestion.question;
  const questionTypeIsUpdated = initialQuestion.questionType !== newQuestion.questionType;
  const requiredIsUpdated = initialQuestion.required !== newQuestion.required;
  const answersWereUpdated = checkIfAnswersWereUpdated(initialQuestion, newQuestion);

  return (
    listOrderIsUpdated || maxLengthIsUpdated || minLengthIsUpdated || questionIsUpdated || questionTypeIsUpdated || requiredIsUpdated || answersWereUpdated
  );
};

const checkIfAnswersWereUpdated = (initialQuestion: QuestionType, newQuestion: QuestionType) => {
  if (initialQuestion.answerOptions.length !== newQuestion.answerOptions.length) {
    return true;
  }
  for (let [index, initialAnswer] of initialQuestion.answerOptions.entries()) {
    const newAnswer = newQuestion.answerOptions[index];
    if (initialAnswer.text !== newAnswer.text) {
      return true;
    }
  }
  return false;
};

const checkIfRvProductsWereUpdated = (initialValues: EventFormType, values: EventFormType) => {
  if (initialValues.rvs.length !== values.rvs.length) {
    return true;
  }
  for (let [index, initialRvProduct] of initialValues.rvs.entries()) {
    const newRvProduct = values.rvs[index];
    const rvProductWasUpdated = checkIfRvProductFieldsWereUpdated(initialRvProduct, newRvProduct);

    if (rvProductWasUpdated) {
      return true;
    }
  }
  return false;
};

const checkIfRvProductFieldsWereUpdated = (initialRvProduct: RvFormType, currentRvProduct: RvFormType) => {
  const rvLotIdIsUpdated = initialRvProduct.rvLotId !== currentRvProduct.rvLotId;
  const minNightsIsUpdated = +initialRvProduct.minNights !== +currentRvProduct.minNights;
  const startDateIsUpdated = initialRvProduct.dateRange.startDate !== currentRvProduct.dateRange.startDate;
  const endDateIsUpdated = initialRvProduct.dateRange.endDate !== currentRvProduct.dateRange.endDate;
  const pricingIsUpdated = initialRvProduct.pricing !== currentRvProduct.pricing;
  const priceIsUpdated = +initialRvProduct.price !== +currentRvProduct.price;
  const spotsAreUpdated = checkIfSpotsWereUpdated(initialRvProduct, currentRvProduct);

  return rvLotIdIsUpdated || minNightsIsUpdated || startDateIsUpdated || endDateIsUpdated || pricingIsUpdated || priceIsUpdated || spotsAreUpdated;
};

const checkIfSpotsWereUpdated = (initialRvProduct: RvFormType, currentRvProduct: RvFormType) => {
  if (initialRvProduct.spots.length !== currentRvProduct.spots.length) {
    return true;
  }
  const initialSpots = new Map(initialRvProduct.spots.map(spot => [spot, spot]));
  const currentSpots = new Map(currentRvProduct.spots.map(spot => [spot, spot]));
  const spotsWereRemoved = checkIfSpotsWereRemoved(initialSpots, currentSpots);
  const spotsWereAdded = checkIfSpotsWereAdded(initialSpots, currentSpots);

  return spotsWereRemoved || spotsWereAdded;
};

const checkIfSpotsWereRemoved = (initialSpots, currentSpots) => {
  for (let initialSpot of initialSpots.keys()) {
    if (!currentSpots.has(initialSpot)) {
      return true;
    }
  }
  return false;
};

const checkIfSpotsWereAdded = (initialSpots, currentSpots) => {
  for (let currentSpot of currentSpots.keys()) {
    if (!initialSpots.has(currentSpot)) {
      return true;
    }
  }
  return false;
};
