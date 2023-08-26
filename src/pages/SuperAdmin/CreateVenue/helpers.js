import * as Yup from 'yup';

const moment = require('moment-timezone');
export const timeZones = moment.tz.names().reduce((prev, curr) => {
  if (curr.indexOf('US') === 0) prev.push({ value: curr, label: curr });
  return prev;
}, []);

export const validateAmount = feeAmount => () => {
  if (!feeAmount) {
    return 'THIS FIELD IS REQUIRED';
  }
  if (isNaN(Number(feeAmount))) {
    return 'INVALID NUMBER';
  }
  if (Number(feeAmount) < 0) {
    return 'NUMBER CANNOT BE NEGATIVE';
  }
};

export const mapCreateVenueFieldValues = formValues => {
  const {
    name,
    description,
    phone,
    address1,
    address2,
    city,
    state,
    zipCode,
    timeZone,
    stripeAccount,
    stripeAccountType,
    stripeFeeType,
    feeAmount,
    feeCap
  } = formValues;

  return {
    name,
    description,
    phone,
    city,
    stripeAccount,
    state,
    stripeAccountType,
    timeZone,
    feeCap: Number(feeCap),
    zip: zipCode,
    street: address1,
    street2: address2,
    platformFee: stripeFeeType === 'Platform Fee' ? Number(feeAmount) : 0,
    percentageFee: stripeFeeType.indexOf('Percentage Fee') > -1 ? Number(feeAmount) : 0,
    feePerProduct: stripeFeeType === 'Fee Per Product' ? Number(feeAmount) : 0
  };
};

export const initialValues = {
  name: '',
  description: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
  timeZone: '',
  stripeAccount: '',
  stripeAccountType: '',
  stripeFeeType: '',
  feeAmount: '',
  feeCap: ''
};

export const CreateVenueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Venue name is required'),
  feeAmount: Yup.string().nullable(),
  feeCap: Yup.string().nullable(),
  address1: Yup.string().required('Address is required'),
  address2: Yup.string().nullable(),
  city: Yup.string().required('City is required'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'Venue Description must be at least 3 characters')
    .max(255, 'Venue Description must be less than 256 characters'),
  zipCode: Yup.string()
    .min(5, 'Zip code must be 5 digits')
    .max(5, 'Zip code must be 5 digits')
    .required('Zip is required'),
  state: Yup.string().required('State is required'),
  phone: Yup.string()
    .length(10, 'Enter a valid phone number')
    .required('Phone is required'),
  stripeAccount: Yup.string().required('Stripe account is required'),
  stripeAccountType: Yup.string().required('Stripe account type is required'),
  stripeFeeType: Yup.string().required('Stripe fee type is required')
});
