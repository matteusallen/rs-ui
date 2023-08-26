//@flow
import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import moment from 'moment';

import logo from '../../assets/img/open-stalls-white.png';
import logo2 from '../../assets/img/rodeo-logistics-logo-white.png';
import ROUTES, { subRouteCodes } from '../../constants/routes';
import Button from '../../components/Button';
import RentableEventsList from '../../containers/RenterEvents/HomePageEventList';
import AllRentableEventsList from '../../containers/RenterEvents';
import { LandingPageLayout } from './LandingPageLayout';

export const LandingPage = () => {
  const { push } = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LandingPageLayout>
      <div className={'landing-page'}>
        <div className={'header'}>
          <div className={'container'}>
            <div>
              <img src={logo} alt={'Open Stalls'} className={'openstalls'} />
              <img src={logo2} alt={'Rodeo Logistics'} className={'rolo'} />
            </div>
            <div className={'actions'}>
              <Link to={ROUTES.LOGIN}>SIGN IN</Link>
              <Link to={ROUTES.CREATE_ACCOUNT} className={'create-account'}>
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
        <div className={'banner'}>
          <div className={'banner-background'}>
            <div className={'banner-triangle'} />
          </div>
          <div className={'signup'}>
            <div className={'container'}>
              <div className={'title'}>
                Seamless Reservations <br /> for Stalls & RV Spots
              </div>
              <div className={'text'}>
                {`No waiting in line. No wondering whether there'll be availability.
            Reserve and pay in advance so you can rest easy.`}
              </div>
              <div className={'actions'}>
                <Button type={'button'} primary onClick={() => push(ROUTES.CREATE_ACCOUNT)}>
                  SIGN UP NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className={'upcoming-events'}>
          Upcoming Events
          <div className={'rectangle'} />
        </div>
        <div className={'events-list'}>
          {process.env.PIN_HOME_PAGE_EVENTS_LIST ? <RentableEventsList limit={10} noTitle /> : <AllRentableEventsList limit={10} noTitle />}
          <div className={'actions'}>
            <Button secondary onClick={() => push(subRouteCodes.RENTER.EVENTS)}>
              SEE ALL EVENTS
            </Button>
          </div>
        </div>
        <div className={'how-it-works'}>
          <div className={'horse-bg'}>
            <div className={'triangle'} />
          </div>
          <div className={'content'}>
            <div className={'hiw-row title'}>
              <div>How it Works</div>
              <div className={'rectangle-white'} />
            </div>
            <div className={'hiw-row'}>
              <div className={'badge'}>
                <span>1</span>
              </div>
              <div className={'text2'}>Before the event, use Open Stalls to reserve and pay for stalls, RV spots, shavings and other add ons.</div>
            </div>
            <div className={'hiw-row'}>
              <div className={'badge'}>
                <span>2</span>
              </div>
              <div className={'text2'}>Receive your stall and spot assignments by text message before the event.</div>
            </div>
            <div className={'hiw-row'}>
              <div className={'badge'}>
                <span>3</span>
              </div>
              <div className={'text2'}>
                When you arrive, you can go directly to your stall with add ons already delivered and unload your horse. No waiting in line or wondering whether
                there will be stalls left.
              </div>
            </div>
          </div>
        </div>
        <div className={'venues'}>
          <div className={'forvenues'}>
            <div>For Venues</div>
            <div className={'rectangle'} />
          </div>
          <div className={'content'}>
            <div className={'venue-row'}>
              <div className={'title'}>Event Management</div>
              <div className={'text2'}>
                Create and manage events that are tailor-fit for your needs, with customizable rate types, booking windows and the ability to choose which
                stalls and RV spots are reservable for an event.
              </div>
            </div>
            <div className={'venue-row'}>
              <div className={'title'}>Digital Reservations</div>
              <div className={'text2'}>
                Manage online reservations booked by renters, create reservations for walk-up and call-in customers, and keep track of check ins and check outs.
                Capacity management ensures stalls and spots are never double booked.
              </div>
            </div>
            <div className={'venue-row'}>
              <div className={'title'}>Reporting</div>
              <div className={'text2'}>
                {`Various insightful reports help ensure you stay on the top of
              financials and are able to keep track of what's been booked at
              each event to optimize your future events.`}
              </div>
            </div>
          </div>
        </div>
        <div className={'learn-more'}>
          <div className={'title'}>Interested in using Open Stalls at your venue?</div>
          <div className={'actions'}>
            <a href={'https://www.rodeologistics.co/features/openstalls/'} rel={'noopener noreferrer'} target={'_blank'}>
              LEARN MORE
            </a>
          </div>
        </div>
        <div className={'copy-right'}>&copy; {moment().format('YYYY')} Rodeo Logistics</div>
      </div>
    </LandingPageLayout>
  );
};
