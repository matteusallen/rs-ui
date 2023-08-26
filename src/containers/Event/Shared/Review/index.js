//@flow
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

import EditAndSave from './EditAndSave';
import type { EventFormType } from '../Form';
import ReviewDetails from './ReviewDetails';
import ReviewStalls from './ReviewStalls';
import ReviewRvs from './ReviewRvs';
import ReviewAddOns from './ReviewAddOns';
import colors from '../../../../styles/Colors';

type ReviewPropType = {|
  className: string,
  initialValues: EventFormType
|};

const ReviewBase = ({ className, initialValues }: ReviewPropType) => {
  const { values } = useFormikContext<EventFormType>();

  const { eventName, hasStalls, hasRvs, addOns } = values;

  if (!eventName) return '';

  return (
    <div className={className}>
      <div className="title-wrapper">
        <div className="title">REVIEW EVENT DETAILS</div>
        <EditAndSave />
      </div>
      <div className="event-review-content-wrapper">
        <ReviewDetails formikValues={values} initialValues={initialValues} />
        {hasStalls && <ReviewStalls formikValues={values} initialValues={initialValues?.stalls} />}
        {hasRvs && <ReviewRvs formikValues={values} initialValues={initialValues?.rvs} />}
        {addOns.length > 0 && <ReviewAddOns formikValues={values} initialValues={initialValues} />}
      </div>
      <div className="bottom-buttons-wrapper">
        <EditAndSave />
      </div>
    </div>
  );
};

const Review = styled(ReviewBase)`
  &&& {
    .highlighted {
      background-color: #f7e569;
      width: fit-content;
    }
    .title-wrapper {
      display: flex;
      justify-content: space-between;

      .title {
        display: inline-flex;
      }

      .edit-and-save {
        margin-top: 35px;
      }
    }

    .event-review-content-wrapper {
      margin-top: -30px;
    }

    .card-item {
      h2 {
        margin-top: -10px;
      }

      .info-row {
        display: flex;
        margin: 0 0 35px 0;
        padding: 0;
      }

      .info-questions {
        .info-question-bloc {
          .info-question {
            margin: 0;
          }
          .info-answers {
            margin: 5px 0 0;
          }
        }

        .info-question-bloc:not(:last-child) {
          margin-bottom: 35px;
        }
      }

      .info-item {
        display: block;
        width: calc(25% - 55px);
        max-width: 225px;
        margin-right: 55px;
      }

      .info-item.booking-info {
        max-width: 350px;
        width: 100%;
      }

      .info-item-event-description {
        display: block;
        min-width: 50%;
        max-width: calc(90% - 560px);
      }

      h3 {
        display: block;
        font-family: IBMPlexSans-Bold, Roboto, Helvetica, Arial, sans-serif;
        font-size: 18px;
        margin: 0;
      }

      .info {
        display: block;
        font-family: IBMPlexSans-Regular, Roboto, Helvetica, Arial, sans-serif;
        font-size: 16px;
        margin: 5px 0;
      }

      .default-description {
        font-style: italic;
        color: ${colors.text.secondary};
      }

      .capitalize {
        text-transform: capitalize;
      }
    }

    .card-item:first-child {
      margin-top: 0;
    }

    .bottom-buttons-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: -20px;
      margin-bottom: 25px;
    }
  }
`;

export default Review;
