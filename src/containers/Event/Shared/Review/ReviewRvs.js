//@flow
import React from 'react';
import moment from 'moment';

import { EventFormType } from '../Form';

import { EventCard } from '../Cards/EventCard';

type ReviewRvsPropType = {|
  formikValues: EventFormType
|};

const ReviewRvs = ({ formikValues, initialValues }: ReviewRvsPropType) => {
  const { rvs, rvQuestions, rvFlip } = formikValues;

  const initialObj = {};
  initialValues?.forEach(rv => {
    initialObj[rv.id] = rv;
  });

  const highlightReservableDates = ({ initialStart, initialEnd, updatedStart, updatedEnd }) => {
    if (!initialValues || !initialStart || !initialEnd || !updatedStart || !updatedEnd) {
      return '';
    }
    const startDateWasUpdated = initialStart !== updatedStart;
    const endDateWasUpdated = initialEnd !== updatedEnd;
    return startDateWasUpdated || endDateWasUpdated ? 'highlighted' : '';
  };

  return (
    <EventCard title="RV Spots" flip={rvFlip} product="RV" testId="review-rvs">
      <div className="info-row">
        {rvs.length > 0 &&
          rvs.map(rv => {
            const numSpots = rv.spots.length;
            const initialRvObj = initialObj[rv.id];
            const eDates = initialRvObj
              ? {
                  initialStart: initialRvObj.startDate,
                  updatedStart: rv.dateRange.startDate,
                  initialEnd: initialRvObj.endDate,
                  updatedEnd: rv.dateRange.endDate
                }
              : {
                  initialStart: '-',
                  updatedStart: rv.dateRange.startDate,
                  initialEnd: '-',
                  updatedEnd: rv.dateRange.endDate
                };

            return (
              <div className="info-item" key={rv.rvLot.id}>
                <h3>
                  <span
                    className={`info ${
                      !initialRvObj || (initialRvObj && initialRvObj.rvLot.name !== rv.rvLot.name) ? `${!initialValues ? '' : 'highlighted'}` : ''
                    }`}>
                    {rv.rvLot.name}
                  </span>
                </h3>
                <div
                  className={`info ${
                    !initialRvObj || (initialRvObj && initialRvObj.minNights !== rv.minNights) ? `${!initialValues ? '' : 'highlighted'}` : ''
                  }`}>
                  Min nights: {rv.minNights}
                </div>
                <div className="info">
                  <span className={`info ${highlightReservableDates(eDates)}`}>
                    {moment(rv.dateRange.startDate).format('MM/DD/YY')} – {moment(rv.dateRange.endDate).format('MM/DD/YY')}
                  </span>
                </div>
                <div className="info">
                  <span
                    className={`info ${!initialRvObj || (initialRvObj && initialRvObj.price !== rv.price) ? `${!initialValues ? '' : 'highlighted'}` : ''}`}>
                    {rv.pricing === 'nightly' ? 'Nightly' : 'Flat'} Rate – ${rv.price}
                  </span>
                </div>
                <div className="info">
                  <span
                    className={`info ${
                      !initialRvObj || (initialRvObj && initialRvObj.rvSpots && initialRvObj.rvSpots.length !== numSpots)
                        ? `${!initialValues ? '' : 'highlighted'}`
                        : ''
                    }`}>
                    {numSpots} {numSpots === 1 ? 'spot' : 'spots'}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      <div className="info-questions">
        {!!rvQuestions.length && (
          <>
            <h3>Custom Questions</h3>
            {rvQuestions.map(question => {
              return (
                <div className="info-question-bloc info" key={question.id}>
                  <p className="info-question">{question.question}</p>
                  <ul className="info-answers">
                    {question.questionType !== 'openText' &&
                      question.answerOptions.map(option => {
                        return <li key={option.id}>{option.text}</li>;
                      })}
                  </ul>
                </div>
              );
            })}
          </>
        )}
      </div>
    </EventCard>
  );
};

export default ReviewRvs;
