import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { FormikField, FormikPhoneField, FormikMoneyField } from '../../../components/Fields';
import { FormSelect } from '../../../components/Select';
import { useMutation } from '@apollo/react-hooks';
import Button from '../../../components/Button';
import ContextSnackbar from '../../../components/Snackbar';
import { VENUES } from '../../../queries/SuperAdmin';
import { SnackbarContext } from '../../../store/SnackbarContext';
import states from '../../../containers/Tables/Admin/Groups/stateList';
import { CREATE_VENUE } from '../../../mutations/CreateVenue';
import { subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import { validateAmount, timeZones, initialValues, CreateVenueSchema, mapCreateVenueFieldValues } from './helpers';
import { HeadingFive } from 'Components/Headings';
import './CreateVenue.scss';

const CreateVenueForm: React.FC<any> = () => {
  const [selectedState, setSelectedState] = useState('');
  const [stateTouched, setStateTouched] = useState(false);
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [timeZoneTouched, setTimeZoneTouched] = useState(false);
  const [selectedStripeAccountType, setSelectedStripeAccountType] = useState('');
  const [stripeAccountTypeTouched, setStripeAccountTypeTouched] = useState(false);
  const [selectedStripeFeeType, setSelectedStripeFeeType] = useState('');
  const [stripeFeeTypeTouched, setStripeFeeTypeTouched] = useState(false);
  const { showSnackbar } = useContext(SnackbarContext);
  const [createVenue, { data, loading, error }] = useMutation(CREATE_VENUE);
  const history = useHistory();

  useEffect(() => {
    if (data) {
      showSnackbar('Venue created successfully', {
        error: false,
        duration: 5000
      });
      history.push(SUB_ROUTES.SUPER_ADMIN.VENUES);
    } else if (error) {
      showSnackbar(error?.message?.replace('GraphQL error: ', '') || `Unable to create venue`, { error: true, duration: 5000 });
    }
  }, [data, error]);

  return (
    <div className="create-venue-container">
      <ContextSnackbar />
      <Formik
        initialValues={initialValues}
        onSubmit={async values =>
          await createVenue({
            variables: { input: mapCreateVenueFieldValues(values) },
            refetchQueries: [
              {
                query: VENUES
              }
            ]
          })
        }
        validationSchema={CreateVenueSchema}>
        {({ values, setFieldValue, isValid, dirty, isSubmitting }) => {
          return (
            <Form>
              <HeadingFive label="VENUE INFORMATION" />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field autoComplete="none" label="VENUE NAME" type="text" name="name" variant="filled" component={FormikField} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field autoComplete="none" component={FormikField} label="FACILITY DESCRIPTION" name="description" variant="filled" rows={'4'} multiline />
                </Grid>
              </Grid>
              <HeadingFive label="CONTACT INFORMATION" />
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Field autoComplete="none" label="ADDRESS1" type="text" name="address1" variant="filled" component={FormikField} />
                  <Field autoComplete="none" label="ADDRESS2" type="text" name="address2" variant="filled" component={FormikField} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field autoComplete="none" label="CITY" type="text" name="city" variant="filled" component={FormikField} />
                </Grid>
                <Grid item xs={3}>
                  <Field name="state" autoComplete="none">
                    {({ field, meta }: any) => (
                      <FormSelect
                        {...field}
                        {...meta}
                        onBlur={() => setStateTouched(true)}
                        error={stateTouched && !values.state ? 'State is required' : ''}
                        selectedOption={selectedState || values.state?.toUpperCase()}
                        label="STATE"
                        cb={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('state', e.target.value);
                          setSelectedState(e.target.value);
                        }}
                        className="state-select"
                        options={states}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={3}>
                  <Field
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.length < 6) setFieldValue('zipCode', e.target.value.replace(/[^0-9,']/g, ''));
                    }}
                    autoComplete="none"
                    label="ZIP"
                    type="text"
                    name="zipCode"
                    variant="filled"
                    component={FormikField}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field name="phone" autoComplete="none">
                    {({ field, meta }: any) => (
                      <FormikPhoneField
                        {...field}
                        {...meta}
                        autoComplete="none"
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && !!meta.error && meta.error}
                        touched={`${meta.touched}`}
                        label="PHONE NUMBER"
                        variant="filled"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('phone', e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field name="timeZone" autoComplete="none">
                    {({ field, meta }: any) => (
                      <FormSelect
                        {...field}
                        {...meta}
                        onBlur={() => setTimeZoneTouched(true)}
                        error={timeZoneTouched && !values.timeZone ? 'Time zone is required' : ''}
                        selectedOption={selectedTimeZone || values.timeZone}
                        label="TIME-ZONE"
                        cb={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('timeZone', e.target.value);
                          setSelectedTimeZone(e.target.value);
                        }}
                        className="state-select"
                        options={timeZones}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
              <HeadingFive label="PAYMENT INFORMATION" />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field autoComplete="none" label="STRIPE ACCOUNT" type="text" name="stripeAccount" variant="filled" component={FormikField} />
                </Grid>
                <Grid item xs={6}>
                  <Field name="stripeAccountType" autoComplete="none">
                    {({ field, meta }: any) => (
                      <FormSelect
                        {...field}
                        {...meta}
                        onBlur={() => setStripeAccountTypeTouched(true)}
                        error={stripeAccountTypeTouched && !values.stripeAccountType ? 'Stripe account type is required' : ''}
                        selectedOption={selectedStripeAccountType || values.stripeAccountType}
                        label="STRIPE-ACCOUNT-TYPE"
                        cb={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('stripeAccountType', e.target.value);
                          setSelectedStripeAccountType(e.target.value);
                        }}
                        className="state-select"
                        options={[
                          { label: 'express', value: 'express' },
                          { label: 'standard', value: 'standard' }
                        ]}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Field name="feeType" autoComplete="none">
                    {({ field, meta }: any) => (
                      <FormSelect
                        {...field}
                        {...meta}
                        onBlur={() => setStripeFeeTypeTouched(true)}
                        error={stripeFeeTypeTouched && !values.stripeFeeType ? 'Stripe fee type is required' : ''}
                        selectedOption={selectedStripeFeeType || values.stripeFeeType}
                        label="STRIPE-FEE-TYPE"
                        cb={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('stripeFeeType', e.target.value);
                          setFieldValue('feeCap', 0);
                          setSelectedStripeFeeType(e.target.value);
                        }}
                        className="state-select"
                        options={[
                          { label: 'Platform Fee', value: 'Platform Fee' },
                          { label: 'Percentage Fee', value: 'Percentage Fee' },
                          { label: 'Percentage Fee + Cap', value: 'Percentage Fee + Cap' },
                          { label: 'Fee Per Product', value: 'Fee Per Product' }
                        ]}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  {selectedStripeFeeType.indexOf('Percent') === -1 ? (
                    <Field
                      data-testid="fee-amount-field"
                      name="feeAmount"
                      validate={validateAmount(values.feeAmount)}
                      render={({ field, meta }) => (
                        <FormikMoneyField
                          {...field}
                          {...meta}
                          data-testid="fee-amount-money-field"
                          error={meta.touched && meta.error}
                          helperText={meta.touched && !!meta.error && meta.error}
                          label="FEE-AMOUNT"
                          autoComplete="refundAmount"
                          variant="filled"
                          onChange={e => {
                            setFieldValue(
                              'feeAmount',
                              e.target.value
                                .replace(/\$/g, '')
                                .replace(/\s/g, '')
                                .replace(/,/g, '')
                            );
                          }}
                          className="fee-amount"
                        />
                      )}
                    />
                  ) : (
                    <Field
                      data-testid="fee-amount-field"
                      name="feeAmount"
                      validate={validateAmount(values.feeAmount)}
                      render={({ field, meta }) => (
                        <FormikMoneyField
                          {...field}
                          {...meta}
                          data-testid="fee-amount-percent-field"
                          error={meta.touched && meta.error}
                          helperText={meta.touched && !!meta.error && meta.error}
                          label="FEE-PERCENT"
                          autoComplete="refundAmount"
                          type="percent"
                          variant="filled"
                          onChange={e => {
                            setFieldValue(
                              'feeAmount',
                              e.target.value
                                .replace(/%/g, '')
                                .replace(/\s/g, '')
                                .replace(/,/g, '')
                            );
                          }}
                          className="fee-amount"
                        />
                      )}
                    />
                  )}
                </Grid>
              </Grid>
              {selectedStripeFeeType === 'Percentage Fee + Cap' && (
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      data-testid="fee-cap-field"
                      name="feeCap"
                      validate={validateAmount(values.feeCap)}
                      render={({ field, meta }) => (
                        <FormikMoneyField
                          {...field}
                          {...meta}
                          data-testid="fee-Cap-money-field"
                          error={meta.touched && meta.error}
                          helperText={meta.touched && !!meta.error && meta.error}
                          label="FEE-CAP"
                          autoComplete="feeCap"
                          variant="filled"
                          onChange={e => {
                            setFieldValue(
                              'feeCap',
                              e.target.value
                                .replace(/\$/g, '')
                                .replace(/\s/g, '')
                                .replace(/,/g, '')
                            );
                          }}
                          className="fee-amount"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              )}

              <div className="flex-button-wrapper">
                <Button
                  className="form-button"
                  primary
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={isSubmitting || !dirty || !isValid || loading}
                  data-testid="create-group-save">
                  SAVE
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateVenueForm;
