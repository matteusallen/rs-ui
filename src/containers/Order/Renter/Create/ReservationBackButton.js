//@flow
import React from 'react';
import { useFormikContext } from 'formik';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import { HeadingOne } from '../../../../components/Headings';
import useReservationFlowRoutes from './useReservationFlowRoutes';

import type { ReservationFormShapeType } from './index';

const ReservationBackButton = () => {
  const { goToStalls, isCheckoutUrl, isStallsUrl, isRvsUrl, goToEvents, goBack, prev } = useReservationFlowRoutes();
  const { values } = useFormikContext<ReservationFormShapeType>();
  const { stallProductId } = values;

  return (
    <>
      {isCheckoutUrl && (
        <div className={'card-headline-wrapper'}>
          <a role="button" tabIndex="0" onClick={() => goBack()} onKeyDown={() => goBack()}>
            &lt;
            {prev === 'rvs' ? 'BACK TO RVS' : 'BACK TO DETAILS'}
          </a>
          <HeadingOne label={`Checkout`} />
        </div>
      )}

      {isRvsUrl && (
        <div className={'card-headline-wrapper'}>
          <a role="button" tabIndex="0" onClick={stallProductId ? goToStalls : goToEvents} onKeyDown={stallProductId ? goToStalls : goToEvents}>
            <div className={`to-events-content`}>
              <NavigateBeforeIcon />
              <span>{stallProductId ? 'Back to stall details' : 'Back to all events'}</span>
            </div>
          </a>
        </div>
      )}

      {isStallsUrl && (
        <a className={`to-events-link`} onClick={goToEvents} onKeyPress={goToEvents} role={'button'} tabIndex={'0'}>
          <div className={`to-events-content`}>
            <NavigateBeforeIcon />
            <span>Back to all events</span>
          </div>
        </a>
      )}
    </>
  );
};

export default ReservationBackButton;
