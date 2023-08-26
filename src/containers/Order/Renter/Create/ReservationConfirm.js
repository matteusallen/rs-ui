//@flow
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '../../../../components/Button';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingTwo } from '../../../../components/Headings';
import { paragraphReg } from '../../../../styles/Typography';
import colors from '../../../../styles/Colors';
import { displayFlex, BIG_TABLET_WIDTH, doMediaQuery } from '../../../../styles/Mixins';
import type { OrderCheckoutReturnType } from '../../../../mutations/OrderCheckout';
import Summary from './Summary';
import { mapSummaryFromResponse, mapTicketFromResponse, orderItemsGroups } from '../../../../helpers';
import Ticket from './Ticket';
import { ORDER_FOR_PRINT_RECEIPT } from '../../../../queries/Admin/OrderForPrintReceipt';

type ReservationConfirmPropsType = {|
  checkoutResponse?: OrderCheckoutReturnType,
  className?: string,
  titleHeader?: string,
  data?: { order: { canceled: boolean, event: { endDate: string } } },
  isViewDetailsPage?: boolean,
  isViewConfirmationPage?: boolean
|};

type GetSMSTextLabelInputType = {|
  hasRvs: boolean,
  hasStalls: boolean
|};

export const getSMSTextLabel = ({ hasStalls, hasRvs }: GetSMSTextLabelInputType): string => {
  const stalls = `stall`;
  const rvSpots = `RV spot`;
  // prettier-ignore
  let str = 'You may receive a text message with your '
  if (hasStalls && hasRvs) {
    str += `${stalls} and ${rvSpots}`;
  }
  if (hasStalls && !hasRvs) {
    str += stalls;
  }
  if (!hasStalls && hasRvs) {
    str += rvSpots;
  }
  str += ' assignment before your arrival';
  return str;
};

const ReservationConfirmBase = (props: ReservationConfirmPropsType) => {
  const { className = '', checkoutResponse, isViewDetailsPage, data, titleHeader, isViewConfirmationPage } = props;

  const orderForPrintQuery = useQuery(ORDER_FOR_PRINT_RECEIPT, {
    variables: { id: data?.order?.id },
    fetchPolicy: 'network-only'
  });

  if (!checkoutResponse && !data) return null;
  const { rvProduct, stallProduct } = orderItemsGroups(checkoutResponse || data);

  return (
    <CardContainer>
      <CardColLeftContainer className={`${className}__confirmation-container`}>
        <FormCard>
          <HeadingTwo label={titleHeader} />
          {(!!checkoutResponse || (!data?.order.canceled && moment(data?.order.event.endDate).isAfter(moment()))) && (
            <div className={`${className}__confirmation-banner`}>
              <div className={`${className}__confirmation-content-container`}>
                <InfoOutlinedIcon style={{ marginRight: 5 }} />
                <span>
                  {getSMSTextLabel({
                    hasStalls: Boolean(stallProduct.id),
                    hasRvs: Boolean(rvProduct.id)
                  })}
                </span>
              </div>
            </div>
          )}
          {!checkoutResponse && !!data?.order.canceled && (
            <div className={`${className}__confirmation-banner canceled`}>
              <div className={`${className}__confirmation-content-container`}>
                <InfoOutlinedIcon style={{ marginRight: 5 }} />
                <span>This reservation was canceled on {moment(data.order.canceled).format('MMMM DD, YYYY')}</span>
              </div>
            </div>
          )}
          <div>
            <Summary {...mapSummaryFromResponse(data || checkoutResponse)} />
          </div>
        </FormCard>
      </CardColLeftContainer>
      <CardColRightContainer>
        <FormCard className={`${className}__receipt`}>
          <Ticket
            className={className}
            isViewDetailsPage={isViewDetailsPage}
            isViewConfirmationPage={isViewConfirmationPage}
            {...mapTicketFromResponse(data || checkoutResponse)}
            ccInformation={{ useCard: data?.order?.payments[0]?.cardPayment }}
            printData={orderForPrintQuery.data}
          />
        </FormCard>
        {!isViewDetailsPage && (
          <FormCard>
            <ReserveParagraph>Want to make another reservation?</ReserveParagraph>
            <StyledLink to="/events">
              <FormButtonBase primary variant="contained" size="large" type="submit">
                RETURN TO EVENTS
              </FormButtonBase>
            </StyledLink>
          </FormCard>
        )}
      </CardColRightContainer>
    </CardContainer>
  );
};

const FormButtonBase = styled(Button)`
  &&& {
    letter-spacing: 0.7px;
    line-height: normal;
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
const ReservationConfirm = styled(ReservationConfirmBase)`
  &__info {
    margin-bottom: 25px;
    width: inherit;
  }

  &__confirmation-container {
    width: 100% !important;
  }

  &__confirmation-banner {
    background-color: ${colors.border.tertiary};
    border-radius: 3px;
    color: #ffffff;
    font-family: 'IBMPlexSans-Regular';
    font-size: 14px;
    line-height: 25px;
    margin-top: 20px;
    margin-bottom: 25px;
    text-align: left;
    padding: 15px 0 13px 20px;

    &.canceled {
      background-color: ${colors.error.primary};
    }
  }

  &__confirmation-content-container {
    display: flex;
  }

  &__heading1 {
    text-align: left;
    padding-left: 25px;
  }

  &__receipt {
    min-width: none;
    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
      min-width: 375px;
    }
  }

  &__receipt-border {
    border-top: 1px solid ${colors.border.primary};
    border-bottom: 1px solid ${colors.border.primary};
    padding: 10px 0;
    margin: 10px 0;
  }

  &__ticket-line {
    width: 100%;
    ${displayFlex}
    justify-content: space-between;
    p {
      margin: 0;
      font-family: 'IBMPlexSans-Regular';
      font-size: 16px;
    }
  }

  &__total {
    width: 100%;
    ${displayFlex}
    justify-content: space-between;
    margin-top: 0;
    font-family: 'IBMPlexSans-Bold';
    font-size: 16px;
  }
`;

const CardContainer = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  ${doMediaQuery(
    'BIG_TABLET_WIDTH',
    `
    flex-direction: row;
    align-items: center;
  `
  )}
  ${doMediaQuery(
    'DESKTOP_WIDTH',
    `
   margin: 0 50px;
   width: unset;
  `
  )}
`;

const CardColLeftContainer = styled.div`
  margin-right: 0;
  width: 100%;
  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    margin-right: 10px;
    width: auto;
  }
`;

const CardColRightContainer = styled.div`
  margin-left: 0;
  width: 100%;
  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    margin-left: 10px;
    width: auto;
    align-self: baseline;
  }
`;

const ParagraphBase = styled.p`
  &&& {
    ${paragraphReg}
    margin: 5px 0 0 0;
    overflow-wrap: break-word;
  }
`;

const ReserveParagraph = styled(ParagraphBase)`
  &&& {
    text-align: center;
    padding-bottom: 25px;
  }
`;

export default compose(withRouter)(ReservationConfirm);
