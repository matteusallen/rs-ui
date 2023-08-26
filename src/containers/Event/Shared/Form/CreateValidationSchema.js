//@flow
import * as Yup from 'yup';

export const CreateValidationSchema = Yup.object().shape({
  bookingWindow: Yup.object().shape({
    startDate: Yup.string().length(10),
    endDate: Yup.string().length(10)
  }),
  eventDates: Yup.object().shape({
    startDate: Yup.string().length(10),
    endDate: Yup.string().length(10)
  }),
  eventDescription: Yup.string()
    .nullable()
    .min(3, 'Event Description must be at least 3 characters')
    .max(255, 'Event Description must be less than 256 characters'),
  eventName: Yup.string()
    .required('Event Name is required')
    .min(3, 'Event Name must be at least 3 characters'),
  stallQuestions: Yup.array().when('hasStalls', {
    is: hasStalls => hasStalls,
    then: Yup.array().of(
      Yup.object().shape({
        question: Yup.string()
          .required('Question is required')
          .min(7, 'Question must be at least 7 characters')
          .max(255, 'Max character limit is 255')
          .matches(/^.*[a-zA-Z0-9]+.*$/, 'Question cannot be blank')
      })
    )
  }),
  stalls: Yup.array().when('hasStalls', {
    is: hasStalls => hasStalls,
    then: Yup.array().of(
      Yup.object().shape({
        dateRange: Yup.object().shape({
          startDate: Yup.string().length(10),
          endDate: Yup.string().length(10)
        }),
        entireEvent: Yup.boolean().required(),
        name: Yup.string().required('Name is required'),
        price: Yup.number().required('Valid price required'),
        pricing: Yup.string(),
        stallsForThisRate: Yup.array()
          .of(Yup.string())
          .min(1)
      })
    )
  }),
  step: Yup.string().required('step is not defined'),
  checkInTime: Yup.string()
    .required('Check in time is required')
    .matches(/\d|\d{2}:[0-5][0-9]/i, 'Invalid time format. H:MMpm'),
  checkOutTime: Yup.string()
    .required('Check out time is required')
    .matches(/\d|\d{2}:[0-5][0-9]/i, 'Invalid time format. H:MMpm'),
  addOns: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required('Please select an addon'),
      name: Yup.string().required('addOn name is required'),
      price: Yup.number().required('Price is required')
    })
  ),
  venueAgreement: Yup.string().required('Invalid venue agreement'),
  rvQuestions: Yup.array().when('hasRvs', {
    is: hasRvs => hasRvs,
    then: Yup.array().of(
      Yup.object().shape({
        question: Yup.string()
          .required('Question is required')
          .min(7, 'Question must be at least 7 characters')
          .max(255, 'Max character limit is 255')
          .matches(/^.*[a-zA-Z0-9]+.*$/, 'Question cannot be blank')
      })
    )
  }),
  rvs: Yup.array().when('hasRvs', {
    is: hasRvs => hasRvs,
    then: Yup.array().of(
      Yup.object().shape({
        price: Yup.number().required('Price is required'),
        rvLotId: Yup.string().required('Please select one Lot'),
        spots: Yup.array()
          .of(Yup.string())
          .min(1)
      })
    )
  }),
  // at least 1 (stalls or rvs)
  hasRvs: Yup.boolean().when('hasStalls', {
    is: hasStalls => !hasStalls,
    then: Yup.boolean().oneOf([true])
  })
});
