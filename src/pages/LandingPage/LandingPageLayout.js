import styled from 'styled-components';

import { displayFlex, doMediaQuery } from '../../styles/Mixins';
import colors from '../../styles/Colors';
import BackgroundImage from '../../assets/img/horse-in-stall.jpeg';
import HorseInStallImage from '../../assets/img/horse-in-stall-v2-flipped.jpg';

export const LandingPageLayout = styled.div`
  & {
    font-family: "IBMPlexSans-Regular";
    font-size: 16px;
    letter-spacing: 0.7px;
    line-height: 25px;

    .landing-page {
      ${displayFlex}
      flex-flow: column nowrap;

      .header {
        width: 100%;
        background: ${colors.text.primary};


        .container {
          width: 100%;
          max-width: 1200px;
          ${displayFlex}
          flex-flow: row nowrap;
          justify-content: space-between;
          margin: 10px auto;
        }

        img.openstalls {
          height: 32px;
          margin: 12px 20px 12px 25px;
        }

        img.rolo {
          display: none;
          ${doMediaQuery('BIG_TABLET_WIDTH', 'display: unset;')}
          width: 212px;
          margin: 12px 25px;
        }

        .actions {
          ${displayFlex}
          flex-direction: row;

          a {
            color: ${colors.white};
            font-family: 'IBMPlexSans-Regular';
            font-size: 16px;
            letter-spacing: 0.7px;
            line-height: 25px;
            margin: 17px 25px 0 0;
          }

          .create-account {
            display: none;
            font-family: 'IBMPlexSans-Bold';
            ${doMediaQuery('BIG_TABLET_WIDTH', 'display: unset;')}
          }
        }
      }

      .banner {
        ${displayFlex};
        flex-direction: column;
        background: ${colors.button.secondary.active};
        ${doMediaQuery(
          'BIG_TABLET_WIDTH',
          `
        flex-direction: row;
        `
        )}
      }

      .banner-background {
        background: no-repeat center/100% url(${BackgroundImage});
        height: 212px;
        ${displayFlex}
        ${doMediaQuery(
          'BIG_TABLET_WIDTH',
          `
        width: 50vw;
        order: 2;
        `
        )}

        .banner-triangle {
          width: 0;
          height: 0;
          border-bottom: 120px solid ${colors.button.secondary.active};
          border-right: 100vw solid transparent;
          display: block;
          align-self: flex-end;
          margin: 0;
          position: relative;
          top: 1px;
          ${doMediaQuery(
            'BIG_TABLET_WIDTH',
            `
            border-bottom: 340px solid ${colors.button.secondary.active};
            border-right: 25vw solid transparent;
            top: 0;
            left: -1px;
          `
          )}
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          border-bottom: 400px solid ${colors.button.secondary.active};
          `
          )}
        }

        ${doMediaQuery(
          'BIG_TABLET_WIDTH',
          `
          background: no-repeat center/100% url(${BackgroundImage});
          height: 340px;
        `
        )}

        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
        height: 400px;
        `
        )}
      }

      .signup {
        ${doMediaQuery(
          'BIG_TABLET_WIDTH',
          `
        width: 50vw;
        order: 1;
        `
        )}
        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
        ${displayFlex}
        flex-direction: row;
        justify-content: flex-end;
        `
        )}
        .container {
          width: 100%;
          max-width: 600px;
          ${displayFlex}
          flex-flow: column nowrap;
          text-align: left;
          margin: 0 auto;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          margin: 0;
          `
          )}
        }

        .title {
          max-width: 95%;
          width: 80%;
          color: ${colors.white};
          font-family: "IBMPlexSans-SemiBold";
          font-size: 25px;
          letter-spacing: 1.1px;
          line-height: 29px;
          margin: 0 25px;

          ${doMediaQuery(
            'BIG_TABLET_WIDTH',
            `
            width: 50vw;
            font-size: 41px;
            letter-spacing: 1.24px;
            line-height: 50px;
            margin-top: 70px;
          `
          )}

          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          margin-top: 100px;
          margin-left: 0;
          `
          )}
        }

        div {
          color: ${colors.text.primary};
          font-family: 'IBMPlexSans-Regular';
          font-size: 16px;
          letter-spacing: 0;
          line-height: 22px;
          margin: 10px 10px;
        }

        .text {
          width: 80%;
          margin: 10px 25px;
          color: ${colors.white};
          ${doMediaQuery(
            'BIG_TABLET_WIDTH',
            `
            width: 520px;
            font-family: "IBMPlexSans-Regular";
            font-size: 20px;
            letter-spacing: 0;
            line-height: 25px;
          `
          )}
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          width: 100%;
          margin-left: 0;
          `
          )}
        }

        .actions {
          ${displayFlex}
          flex-flow: row nowrap;
          margin: 20px 25px 30px;
          ${doMediaQuery(
            'BIG_TABLET_WIDTH',
            `
          margin: 20px 25px 0;
          `
          )}
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          margin-left: 0;
          `
          )}

          button {
            height: 45px;
          }
        }
      }

      .events-list {
        ${displayFlex}
        flex-direction: column;

        .actions {
          margin: 25px 0;
          button.MuiButtonBase-root{
            height: 45px;
          }
        }
      }

      .upcoming-events {
        width: -webkit-fill-available;
        max-width: 1200px;
        padding: 25px 20px
        color: ${colors.text.primary};
        font-family: 'IBMPlexSans-SemiBold';
        font-size: 25px;
        letter-spacing: 1.1px;
        line-height: 25px;
        text-align: left;
        margin: 0 auto;

        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
        font-size: 30px;
        letter-spacing: 0.91px;
        line-height: 50px;
        padding: 40px 0 5px;
        `
        )}
      }

      .rectangle {
        margin-top: 8px;
        height: 5px;
        width: 90px;
        background-color: ${colors.text.primary};
      }

      .how-it-works {
        background: ${colors.button.secondary.active};
        color: ${colors.white};
        font-family: "IBMPlexSans-Regular";
        font-size: 16px;
        letter-spacing: 0;
        line-height: 25px;

        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
        ${displayFlex}
        flex-flow: row nowrap;
        font-size: 20px;
        `
        )}

        .content {
          ${displayFlex}
          flex-flow: column nowrap;
          padding: 25px 0;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
            width: 50%;
            max-width: 600px;
            margin: 70px 0;
          `
          )}
        }

        .hiw-row {
          margin 12px 25px;
          ${displayFlex}
          flex-flow: row nowrap;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          margin 20px 25px;
          `
          )}
        }

        .hiw-row.title {
          color: ${colors.white};
          font-family: "IBMPlexSans-SemiBold";
          font-size: 25px;
          letter-spacing: 1.1px;
          line-height: 25px;
          ${displayFlex}
          flex-flow: column nowrap;
          text-align: left;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          font-size: 30px;
          `
          )}
        }

        .rectangle-white {
          height: 5px;
          width: 90px;
          background-color: ${colors.white};
          display: inline-block;
          margin-top: 8px;
        }

        .badge {
          span {
            background: ${colors.white};
            color: ${colors.button.secondary.active};
            border-radius: 50%;
            width: 25px;
            height: 25px;
            display: inline-block;
            font-weight: bold;
            font-family: 'IBMPlexSans-Bold';
          }
        }
        .text2 {
          text-align: left;
          margin-left: 10px;
        }
      }

      .horse-bg {
        background: no-repeat center/160% url(${HorseInStallImage});
        height: 343px;
        width: 100%;
        transform: scaleX(-1);
        ${displayFlex}
        flex-direction: row-reverse;
        ${doMediaQuery(
          'BIG_TABLET_WIDTH',
          `
        background: no-repeat center/150% url(${HorseInStallImage});
        background-position-x: 10px;
        `
        )}
        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
        width: 50%;
        margin: 0;
        height: 600px;
        flex-direction: row;
        background: no-repeat center/150% url(${HorseInStallImage});
        background-position-x: 10px;
        `
        )}

        .triangle {
          width: 0;
          height: 0;
          border-bottom: 80px solid ${colors.button.secondary.active};
          border-left: 100vw solid transparent;
          display: block;
          align-self: flex-end;
          position: relative;
          top: 1px;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
            align-self: unset;
            border-bottom: unset;
            border-left: unset;
            border-top: 600px solid ${colors.button.secondary.active};
            border-right: 350px solid transparent;
            justify-content: flex-end;
            right: 1px;
          `
          )}
        }
      }

      .venues {
        color: ${colors.text.primary};
        font-family: "IBMPlexSans-Regular";
        font-size: 16px;
        letter-spacing: 0;
        line-height: 25px;
        text-align: left;
        ${displayFlex}
        flex-flow: column nowrap;

        ${doMediaQuery(
          'DESKTOP_WIDTH',
          `
          flex-flow: row wrap;
          justify-content: space-evenly;
        `
        )}

        .content {
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          width: 100%;
          max-width: 1200px;
          ${displayFlex}
          flex-flow: row nowrap;
          justify-content: space-between;
          margin-bottom: 50px;
          `
          )}
        }

        .venue-row {
          margin: 30px 25px;

          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          max-width: 350px;
          margin: 15px 0;
          `
          )}

          .title {
            color: ${colors.text.primary};
            font-family: "IBMPlexSans-SemiBold";
            font-size: 22px;
            letter-spacing: 0.97px;
            line-height: 25px;
            margin-bottom: 15px;
          }
        }

        .forvenues {
          color: ${colors.text.primary};
          font-family: "IBMPlexSans-SemiBold";
          font-size: 25px;
          letter-spacing: 1.1px;
          line-height: 25px;
          text-align: center;
          margin: 25px 0 10px;
          ${displayFlex}
          flex-direction: column;
          align-items: center;
          justify-content: center;
          ${doMediaQuery(
            'DESKTOP_WIDTH',
            `
          width: 100vw;
          font-size: 30px;
          margin: 60px 0 50px;
          `
          )}
        }
      }

      .learn-more {
        background-color: ${colors.button.secondary.active};

        .title {
          color: ${colors.white};
          font-family: "IBMPlexSans-SemiBold";
          font-size: 25px;
          letter-spacing: 1.1px;
          line-height: 33px;
          text-align: center;
          margin: 25px;
        }

        .actions {
          margin: 25px;

          a {
            color: ${colors.white};
            font-family: "IBMPlexSans-Regular";
            font-size: 16px;
            letter-spacing: 0.7px;
            line-height: 25px;
            text-align: center;
            border-radius: 3px;
            background-color: ${colors.primary};
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.16), 0 2px 5px 0 rgba(0,0,0,0.26);
            padding: 14px 25px;
          }
        }
      }

      .copy-right {
        background-color: ${colors.text.primary};
        color: ${colors.white};
        padding 15px 0;
        text-align: center;
      }
    }

    .events-list .disabled-button {
      width: -webkit-fill-available;
      height: 26px;
      ${doMediaQuery('BIG_TABLET_WIDTH', 'width: unset;')}

    }

    .events-list .book-link button.MuiButtonBase-root {
      height: 45px;
    }
  }
`;
