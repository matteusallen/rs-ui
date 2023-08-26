// @flow
import React, { memo, useEffect } from 'react';
import styled from 'styled-components';
import type { RouteComponentProps } from 'react-router-dom';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { useLazyQuery } from '@apollo/react-hooks';
import colors from '../styles/Colors';
import type { StandardProps } from '@material-ui/core';
import ReservationConfirm from '../containers/Order/Renter/Create/ReservationConfirm';
import { displayFlex, doMediaQuery } from '../styles/Mixins';
import { ORDER_FOR_VIEW_DETAILS } from 'Queries/Renter/OrderForViewDetails';
import { HeadingOne } from '../components/Headings';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import type { OrderCheckoutReturnType } from '../mutations/OrderCheckout';
import BackArrow from '../assets/img/icons/back-arrow.png';
import { PageNotFoundSection } from '../components/PageNotFound/PageNotFoundSection';
import { isErrorCode } from '../utils/graphqlErrorHelper';
import { graphqlErrorCodes } from '../types/enums/graphqlEnums';

type RenterConfirmationPropsType = {|
  location: { state: OrderCheckoutReturnType }
|};

const RenterConfirmReservation = (props: RenterConfirmationPropsType & RouteComponentProps & StandardProps) => {
  const { className } = props;
  const params = useParams();
  const isViewDetailsPage = props.match.url.indexOf('details/') > 1;
  const isViewConfirmationPage = props.match.url.indexOf('confirmation/') > 1;

  const [getOrder, { data, error, loading }] = useLazyQuery(ORDER_FOR_VIEW_DETAILS, {
    variables: {
      id: params.orderId
    }
  });

  useEffect(() => {
    if ((isViewDetailsPage || params.orderId) && !data) getOrder();
  }, [data]);

  const orderWasNotFound = () => isErrorCode(error, graphqlErrorCodes.BAD_USER_INPUT);

  if (orderWasNotFound()) {
    return <PageNotFoundSection className={className} />;
  }

  if (loading || error) {
    return <div style={{ marginTop: '100px' }}>{loading ? <IndeterminateLoading /> : 'Error retrieving orders'}</div>;
  }

  let titleHeader = 'Reservation Summary';
  if (data && !moment(data.order.createdAt).isSame(data.order.updatedAt)) titleHeader = 'Reservation Updated';

  let message = '';

  if (data?.order.canceled) {
    message = 'Your reservation has been canceled. You will receive a copy of this confirmation via email.';
  } else if (data?.order?.group) {
    message = 'Your reservation is confirmed. You will receive a copy of this confirmation via email.';
  } else {
    message = 'Your reservation is confirmed and has been paid in full. You will receive a copy of this confirmation via email.';
  }

  return (
    <>
      <section className={className}>
        <FlexWrapper>
          <div className={`${className}__Page-Title`}>
            {isViewDetailsPage && (
              <Link to="/reservations" data-testid="back-to-reservations-button" id={`back-button`}>
                <img src={BackArrow} alt={'BACK'} /> BACK TO RESERVATIONS
              </Link>
            )}
            <HeadingOne className={`${className}__Header`} label={isViewDetailsPage ? 'Order Details' : 'Confirmation'} />
            <p className={`${className}__Lead`}>{message}</p>
          </div>
        </FlexWrapper>
        <ReservationConfirm
          isViewDetailsPage={isViewDetailsPage}
          isViewConfirmationPage={isViewConfirmationPage}
          data={data}
          titleHeader={titleHeader}
          checkoutResponse={props.location.state}
        />
      </section>
    </>
  );
};

const RenterConfirmReservationStyled = styled(RenterConfirmReservation)`
  margin: 85px auto 0;
  max-width: 1284px;
  &__Page-Title {
    text-align: left;
    ${doMediaQuery(
      'DESKTOP_WIDTH',
      `
      margin: 0 55px;
    `
    )}
  }
  &__Header {
    &&& {
      margin-top: 10px;
      text-align: left;
      @media screen and (max-width: 1270px) {
        margin-left: 4%;
      }
    }
  }
  #back-button {
      text-align: left;
      font-size: 15px;
      color: ${colors.border.tertiary};
      letter-spacing: 1.05px;
      line-height: 17px;
      margin-bottom: 20px !important;
      cursor: pointer;

      img {
        height: 11px;
        margin-right: 8px;
      }
    }
  }

  &__Lead {
    &&& {
      text-align: left;
      margin-left: 7px;
      @media screen and (max-width: 1270px) {
        margin-left: 4%;
      }
      font-family: 'IBMPlexSans-Regular';
      font-size: 16px;
    }
  }
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export default memo<{}>(RenterConfirmReservationStyled);
