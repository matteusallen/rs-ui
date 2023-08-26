// @flow
import React, { memo } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { subRouteCodes as SUB_ROUTES } from '../../constants/routes';
import { headingOne } from '../../styles/Typography';
import EventsTable from '../../containers/Tables/Admin/EventsTable';
import { displayFlex } from '../../styles/Mixins';
import AddButton from '../../components/Button/AddButton';
import Snackbar from '../../components/Snackbar';
import { withSnackbarContextActions } from '../../store/SnackbarContext';
import type { ShowSnackbarType } from '../../store/SnackbarContext';
import { HeadingOne } from 'Components/Headings';

type AdminEventsPropsType = {|
  className: string,
  history: {|
    push: (input: { pathname: string, search: string }) => void
  |},
  showSnackbar: ShowSnackbarType
|};
const AdminEventsBase = (props: AdminEventsPropsType) => {
  const { className, showSnackbar } = props;

  return (
    <>
      <section className={className}>
        <FlexWrapper>
          <HeadingOne label="EVENTS" />
          <CreateEventLink to={SUB_ROUTES.ADMIN.CREATE_EVENT}>
            <AddButton label={'CREATE EVENT'} />
          </CreateEventLink>
        </FlexWrapper>
        <EventsTable showSnackbar={showSnackbar} onEditClick={row => props.history.push(`events/edit/${row.id}`)} />
        <Snackbar />
      </section>
    </>
  );
};

const AdminEvents = styled(AdminEventsBase)`
  margin: 85px 50px 50px;
  max-width: 1800px;
  min-width: 1130px;
  &__Header {
    ${headingOne}
    text-align: left;
    margin: 0;
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CreateEventLink = styled(Link)`
  text-decoration: none;
`;

export default compose(withRouter, withSnackbarContextActions)(memo(AdminEvents));
