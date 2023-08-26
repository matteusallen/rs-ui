//@flow
import React from 'react';
import styled from 'styled-components';
import { SectionToggle } from './SectionToggle';
import { useFormikContext } from 'formik';
import { EventCard } from './EventCard';
import { Checkbox, Tooltip, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { HeadingTwo } from 'Components/Headings';
import type { EventFormType } from '../Form';
import { emptyQuestionCard } from '../Form';
import colors from '../../../../styles/Colors';
import '../Cards/ProductSelectionToggle.scss';

type ProductSelectionTogglePropType = {|
  className: string,
  header: string,
  scope: 'hasStalls' | 'hasRvs',
  product: 'stalls' | 'rvs'
|};

export const ProductSelectionToggleBase = ({ className, header, scope, product }: ProductSelectionTogglePropType) => {
  const { values, setFieldValue } = useFormikContext<EventFormType>();
  const questionType = product === 'stalls' ? 'stallQuestions' : 'rvQuestions';
  const emptyAnswerName = product === 'stalls' ? 'hasEmptyStallAnswer' : 'hasEmptyRvAnswer';
  const flipType = product === 'stalls' ? 'stallFlip' : 'rvFlip';
  const flipValue = product === 'stalls' ? values.stallFlip : values.rvFlip;

  const handleCustomQuestionChange = () => {
    if (values[questionType].length) {
      setFieldValue(emptyAnswerName, false);
      setFieldValue(questionType, []);
    } else {
      setFieldValue(questionType, [emptyQuestionCard]);
    }
  };

  return (
    <EventCard testId={`${product}-select-toggle`}>
      <div className={`${className} product-select-toggle`}>
        <div className="main header-container">
          <HeadingTwo label={header} />
          <div className="header-container">
            <p>Make {product === 'stalls' ? product : 'RV spots'} available for this event</p>
            <SectionToggle scope={scope} product={product} />
          </div>
        </div>
        {values[scope] && (
          <div className="questions-toggle-container">
            <div className="question-bloc">
              <Checkbox type="checkbox" checked={!flipValue} onChange={() => setFieldValue(flipType, !flipValue)} data-testid="flip-checkbox" />
              <p>Disable {product === 'stalls' ? 'Stall' : 'RV'} Flip</p>
              <BlueTooltip placement="top" arrow title={`${product === 'stalls' ? 'Stalls' : 'RV spots'} can only be sold once during an event`}>
                <InfoIcon fontSize="medium" />
              </BlueTooltip>
            </div>
            <div className="question-bloc">
              <Checkbox
                data-testid="custom-questions-checkbox"
                type="checkbox"
                checked={values[questionType].length}
                onChange={handleCustomQuestionChange}
                disabled={!values[scope]}
              />
              <p>Custom Questions</p>
              <BlueTooltip placement="top" arrow title="Ask your renters a custom question(s)">
                <InfoIcon data-testid="info-icon" fontSize="medium" />
              </BlueTooltip>
            </div>
          </div>
        )}
      </div>
    </EventCard>
  );
};

const BlueTooltip = withStyles({
  tooltip: {
    color: colors.white,
    backgroundColor: colors.border.tertiary,
    fontSize: '16px'
  },
  arrow: {
    color: colors.border.tertiary
  }
})(Tooltip);

export const ProductSelectionToggle = styled(ProductSelectionToggleBase)`
  & {
    .available-label {
      font-family: IBMPlexSans-Bold, Roboto, Helvetica, Arial, sans-serif;
    }
  }
`;
