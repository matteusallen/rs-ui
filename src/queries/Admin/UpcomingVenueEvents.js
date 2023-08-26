import gql from 'graphql-tag';

export const UPCOMING_VENUE_EVENTS = gql`
  query UpcomingVenueEvents($id: ID, $orderBy: [String], $filterBy: EventFilterInput) {
    venue(id: $id) {
      events(orderBy: $orderBy, filterBy: $filterBy) {
        id
        name
        startDate
        endDate
        checkInTime
        checkOutTime
        openDate
        closeDate
        stallProducts {
          id
          description
          endDate
          name
          nightly
          price
          startDate
          minNights
        }
        addOnProducts {
          id
          price
          disabled
          addOn {
            id
            name
            description
            unitName
          }
        }
        rvProducts {
          id
          name
          description
          startDate
          endDate
          nightly
          price
          minNights
          rvLot {
            id
            name
            description
            sewer
            water
            power
          }
        }
        stallQuestions {
          id
          question
          questionType
          answerOptions
          required
          minLength
          maxLength
        }
        rvQuestions {
          id
          question
          questionType
          answerOptions
          required
          minLength
          maxLength
        }
        venue {
          id
          name
          street
          street2
          city
          state
          zip
          description
          buildings {
            id
            name
          }
        }
      }
    }
  }
`;
