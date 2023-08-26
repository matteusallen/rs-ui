//@flow
import React, { useEffect } from 'react';
import './BasicInformation.scss';
import { useFormikContext, Field } from 'formik';
import { FormControlLabel, FormControl, RadioGroup } from '@material-ui/core';
import RadioThemed from '../Radio';
import Switch from '@material-ui/core/Switch';
import { FormikField } from '../../../../components/Fields';
import type { EventFormType } from '../Form';
import { EventCard } from '../Cards/EventCard';
import { VenueAgreement } from '../VenueAgreement';
import { VenueMap } from '../VenueMap/VenueMapContainer';
import { HeadingFour } from 'Components/Headings';
import { BlueTooltip } from 'src/containers/Order/Admin/Edit/orderHistoryHelpers';
import InfoIcon from '@material-ui/icons/Info';

export const BasicInformation = () => {
  const {
    setFieldValue,
    values: { renterGroupCodeMode, allowDefferedEnabled }
  } = useFormikContext<EventFormType>();

  useEffect(() => {
    if (!allowDefferedEnabled) {
      setFieldValue('renterGroupCodeMode', '');
    }
  }, [allowDefferedEnabled]);

  const groupCodeChangeHandler = event => {
    const { value } = event.target;
    setFieldValue('renterGroupCodeMode', value);
  };

  return (
    <EventCard title={'Basic Information'} testId="basic-information">
      <div className={'card-row'}>
        <div className={'card-col'}>
          <HeadingFour label="Event Name" />
          <Field component={FormikField} label="Event Name" name="eventName" type="text" variant="filled" />
        </div>
        <div className={'card-col right-col'}>
          <HeadingFour label="Check In and Check Out" />
          <div className={'card-inner-row'}>
            <div className={'card-span'}>
              <div className={'time-picker'}>
                <Field component={FormikField} label="Check In Time" type="time" name="checkInTime" variant="filled" />
              </div>
            </div>

            <div className={'card-span'}>
              <div className={'time-picker'}>
                <Field component={FormikField} label="Check Out Time" type="time" name="checkOutTime" variant="filled" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={'card-row separator'}>
        <div className={'card-col description'}>
          <div className={'optional-text'}>
            <HeadingFour label="Event Description" />
            <div>Optional</div>
          </div>
          <Field component={FormikField} label="Event Description" name="eventDescription" type="text" variant="filled" rows={'4'} multiline />
        </div>
        <div className="file-uploads">
          <div className={'card-col venue-agreement right-col'}>
            <HeadingFour label="Venue Agreement" />
            <VenueAgreement />
          </div>
          <div className={'card-col venue-agreement right-col'}>
            <HeadingFour label="Venue Map" />
            <VenueMap />
          </div>
        </div>
      </div>

      <div className={'card-row separator'}>
        <div className="basic-info__deferred">
          <div className="basic-info__deffered--header">
            <HeadingFour label="Allow Renters to Delay their Payment" />
            <div data-testid="deferred-enabled">
              <Switch
                onChange={() => setFieldValue('allowDefferedEnabled', !allowDefferedEnabled)}
                size={'medium'}
                checked={allowDefferedEnabled}
                className="deferred-enable"
                color="primary"
              />
            </div>
            <BlueTooltip
              placement="top"
              arrow
              title={<p style={{ fontSize: '14px', textAlign: 'center', margin: '5px 0' }}>Turning on will add the group to deferred payment options</p>}>
              <InfoIcon fontSize="small" />
            </BlueTooltip>
          </div>
          {allowDefferedEnabled && (
            <>
              <p className="deferred-description">Choose the type of delayed payment you would like to offer.</p>
              <FormControl component="fieldset" className="deferred-fieldset">
                <RadioGroup name="renterGroupCodeMode" value={renterGroupCodeMode} onChange={groupCodeChangeHandler}>
                  <FormControlLabel value="unsecured" control={<RadioThemed />} label="Allow delayed payment with a credit/debit card on file" />
                  <FormControlLabel
                    value="secured"
                    control={<RadioThemed color={'secondary'} />}
                    label={
                      <div className="deferred__access-label--container">
                        <span className="deferred__access-label--label">Allow delayed payment with an access code</span>
                        <BlueTooltip
                          placement="top"
                          arrow
                          title={
                            <p style={{ fontSize: '14px', textAlign: 'center', margin: '5px 0' }}>
                              This feature enables select groups to delay their payment with an access code
                            </p>
                          }>
                          <InfoIcon fontSize="small" />
                        </BlueTooltip>
                      </div>
                    }
                  />
                </RadioGroup>
              </FormControl>
              {renterGroupCodeMode.length > 0 && (
                <div className="deferred-selection-notice">
                  <InfoIcon fontSize="large" style={{ paddingRight: '5px' }} />
                  <span>
                    <strong>Disclaimer</strong>: By selecting this option, you understand that you are accepting liability and responsibility for paying
                    platform fees that occur from payments not collected at the end of the event.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </EventCard>
  );
};
