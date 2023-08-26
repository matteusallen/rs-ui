//@flow
import React from 'react';
import styled from 'styled-components';
import { Form } from 'formik';

import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex, doMediaQuery, isMobile } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import Sticky from '../../../../components/Sticky';

function ReservationFlowLayout({
  className = '',
  children,
  rightColumn,
  backButton
}: {
  backButton: React$Node,
  children?: React$Node,
  className?: string,
  rightColumn: React$Node
}): React$Element<'section'> {
  return (
    <section className={`${className} form-section`}>
      {backButton}
      <Form className={'form-container'}>
        <div className={`form-column-left`}>{children}</div>
        {isMobile() ? (
          <div className={`form-column-right`}>{rightColumn}</div>
        ) : (
          <Sticky>
            <div className={`form-column-right`}>{rightColumn}</div>
          </Sticky>
        )}
      </Form>
    </section>
  );
}

const ReservationFlowLayoutStyled = styled(ReservationFlowLayout)`
  &.form-section {
    min-width: 320px;

    @media (min-width: 1024px) {
      min-width: 1190px;
    }

    .card-headline-wrapper {
      ${displayFlex}
      flex-direction: column;
      justify-content: flex-start;
      align-items: baseline;
      margin-bottom: 0;

      a {
        font-family: 'IBMPlexSans-Regular';
        letter-spacing: 1.05px;
        color: ${colors.text.link};
        cursor: pointer;
      }
    }
    .form-container {
      ${displayFlex}
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      p {
        ${paragraphReg}
      }
      h5 {
        margin: 12px 0 20px;
      }
    }
    .form-column-left {
      ${displayFlex}
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 792px;
      margin-right: 0px;
    }

    .form-column-right {
      ${displayFlex}
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 792px;
      margin-left: 0px;
      align-self: center;
    }

    .to-events-content {
      align-items: center;
      color: ${colors.secondary};
      display: flex;
      font-family: 'IBMPlexSans-Regular';
      font-size: 15px;
      letter-spacing: 1.05px;
      line-height: 17px;
      height: 24px;
      text-align: left;
      text-transform: uppercase;
      margin-bottom: 15px;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin-top: 50px;
      `
      )}
    }

    .to-events-link {
      text-decoration: none;
    }
    .to-events-link:hover {
      cursor: pointer;
    }
    ${doMediaQuery(
      'BIG_TABLET_WIDTH',
      `
      .form-column-right {
        flex-direction: column;
        justify-content: center;
        align-self: baseline;
        width: 385px;
        margin-left: 10px;
      }
      .form-column-left {
        margin-right: 10px;
      }

      .form-container {
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
      }
    `
    )}
  }
`;

export default ReservationFlowLayoutStyled;
