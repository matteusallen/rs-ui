import gql from 'graphql-tag';

export const EDIT_EVENT = gql`
  mutation editEvent($input: EventUpsertInput) {
    editEvent(input: $input) {
      event {
        id
      }
      success
      error
    }
  }
`;

export interface EditEventInputType {
  checkInTime: string;
  checkOutTime: string;
  closeDate: string;
  description: string;
  endDate: string;
  id?: string;
  name: string;
  openDate: string;
  startDate: string;
  venueAgreementDocumentId: string;
  venueMapDocumentId?: string | null;
}

export interface EditEventReturnType {
  error: string;
  event: { id: string };
  success: boolean;
}
