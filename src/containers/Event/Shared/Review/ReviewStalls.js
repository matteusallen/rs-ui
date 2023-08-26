//@flow
import React from 'react';
import moment from 'moment';

import { EventCard } from '../Cards/EventCard';
import { EventFormType } from '../Form';

type ReviewStallsPropType = {|
  formikValues: EventFormType
|};

const ReviewStalls = ({ formikValues, initialValues }: ReviewStallsPropType) => {
  const { stalls, stallQuestions, stallFlip } = formikValues;

  const initialObj = {};
  initialValues?.forEach(stall => {
    initialObj[stall.id] = stall;
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
    <EventCard title="Stalls" flip={stallFlip} product="Stall" testId="review-stalls">
      <div className="info-row">
        {stalls.length &&
          stalls.map(stall => {
            const numStalls = stall.stallsForThisRate.length;

            const initialStallobj = initialObj[stall.id];
            const eDates = initialStallobj
              ? {
                  initialStart: initialStallobj.startDate,
                  updatedStart: stall.dateRange.startDate,
                  initialEnd: initialStallobj.endDate,
                  updatedEnd: stall.dateRange.endDate
                }
              : {
                  initialStart: '-',
                  updatedStart: stall.dateRange.startDate,
                  initialEnd: '-',
                  updatedEnd: stall.dateRange.endDate
                };

            return (
              <div className="info-item" key={stall.name}>
                <h3>
                  <span
                    className={`info ${
                      !initialStallobj || (initialStallobj && initialStallobj.name !== stall.name) ? `${!initialValues ? '' : 'highlighted'}` : ''
                    }`}>
                    {stall.name}
                  </span>
                </h3>
                <div
                  className={`info ${
                    !initialStallobj || (initialStallobj && initialStallobj.minNights !== stall.minNights) ? `${!initialValues ? '' : 'highlighted'}` : ''
                  }`}>
                  Min nights: {stall.minNights}
                </div>
                <div className="info">
                  <span className={`info ${highlightReservableDates(eDates)}`}>
                    {moment(stall.dateRange.startDate).format('MM/DD/YY')} – {moment(stall.dateRange.endDate).format('MM/DD/YY')}
                  </span>
                </div>
                <div className="info">
                  <span
                    className={`info ${
                      !initialStallobj || (initialStallobj && initialStallobj.price !== stall.price) ? `${!initialValues ? '' : 'highlighted'}` : ''
                    }`}>
                    {stall.pricing === 'nightly' ? 'Nightly' : 'Flat'} Rate – ${stall.price}
                  </span>
                </div>
                <div className="info">
                  <span
                    className={`info ${
                      !initialStallobj || (initialStallobj && initialStallobj.stalls && initialStallobj.stalls.length !== numStalls)
                        ? `${!initialValues ? '' : 'highlighted'}`
                        : ''
                    }`}>
                    {numStalls} {`stall${numStalls > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      <div className="info-questions">
        {!!stallQuestions.length && (
          <>
            <h3>Custom Questions</h3>
            {stallQuestions.map(question => {
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

export default ReviewStalls;
