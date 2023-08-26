import gql from 'graphql-tag';

export const EVENT_BY_ID = gql`
  query GetEventById($eventId: ID) {
    event(id: $eventId) {
      id
      description
      name
      checkInTime
      checkOutTime
      startDate
      endDate
      openDate
      closeDate
      createdAt
      stallFlip
      rvFlip
      stallQuestions {
        id
        question
        questionType
        answerOptions
        required
        minLength
        maxLength
      }
      stallProducts {
        id
        nightly
        startDate
        endDate
        booked
        name
        description
        price
        stalls {
          id
        }
        soldOut
        minNights
      }
      rvQuestions {
        id
        question
        answerOptions
        questionType
        required
        listOrder
        minLength
        maxLength
      }
      rvProducts {
        id
        startDate
        endDate
        nightly
        price
        booked
        assignedSpots
        rvLot {
          id
          name
        }
        rvSpots {
          id
          name
        }
        minNights
      }
      orders {
        id
      }
      addOnProducts {
        id
        price
        booked
        disabled
        addOn {
          id
          name
          unitName
        }
      }
      venueAgreement {
        id
        name
        description
        url
      }
      venueMap {
        id
        name
      }
      isGroupCodeRequired
    }
  }
`;
