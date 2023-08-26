//@flow
import gql from 'graphql-tag';

export const ORDER_FOR_EDIT = gql`
  query orderForEdit($id: ID) {
    order(id: $id) {
      id
      isVisited
      isEditable
      groupOrderLast4
      successorOrder {
        id
      }
      fee
      group {
        id
        name
      }
      platformFee
      canceled
      event {
        id
        closeDate
        endDate
        openDate
        name
        rvProducts {
          id
          endDate
          name
          description
          price
          nightly
          minNights
          rvLot {
            id
            description
            name
            power
            sewer
            water
          }
          startDate
        }
        stallProducts {
          id
          endDate
          name
          description
          nightly
          price
          startDate
          minNights
        }
        startDate
        venue {
          id
          stripeAccountType
          buildings {
            id
            name
          }
        }
        addOnProducts {
          id
          price
          disabled
          booked
          addOn {
            id
            name
            description
            unitName
          }
        }
      }
      notes
      adminNotes
      orderItems {
        id
        addOnProduct {
          id
          price
          addOn {
            id
            name
            unitName
          }
        }
        reservation {
          id
          endDate
          rvProduct {
            id
            name
            description
            price
            nightly
            minNights
            rvLot {
              id
              description
              name
              power
              sewer
              water
            }
          }
          rvSpots {
            id
            name
          }
          stallProduct {
            id
            name
            description
            nightly
            price
            minNights
          }
          stalls {
            id
            building {
              id
              name
            }
            name
            description
            status
          }
          startDate
          status {
            id
            name
          }
        }
        quantity
      }
      payments {
        id
        admin {
          id
        }
        amount
        cardBrand
        cardPayment
        createdAt
        last4
        notes
        serviceFee
        stripeFee
        ssChargeId
        ssRefundId
        success
      }
      groupPayments {
        amount
        isRefund
      }
      total
      user {
        id
        email
        firstName
        fullName
        lastName
        phone
      }
      stallQuestionAnswers {
        id
        questionId
        question
        answerOptions
        answer
        questionType
        required
        minLength
        maxLength
      }
      rvQuestionAnswers {
        id
        questionId
        question
        answerOptions
        answer
        questionType
        required
        minLength
        maxLength
      }
    }
  }
`;
