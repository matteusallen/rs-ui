import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/react-hooks';
import { UserContext } from 'Store/UserContext';
import { EVENTS_LIST_BY_USER_ORDERS } from '../../queries/Renter/EventsByUserOrders';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import ScrollToButton from 'Components/ScrollToButton';
import Typeahead from 'Components/Typeahead/Typeahead';
import { HeadingOne } from 'Components/Headings';
import { CardListContainer } from '../../containers/RenterEvents/RentableEventStyles';
import Footer from '../../containers/Footer';
import EventCardList from './ReservationsEventCardList';
import './RenterReservations.scss';

const separateOrders = orderList => {
  const currentOrders = [];
  const pastOrders = [];
  const canceledOrders = [];

  orderList.forEach(order => {
    if (order?.canceled) canceledOrders.push(order);
    else if (moment(order.event.endDate).isBefore(moment())) pastOrders.push(order);
    else currentOrders.push(order);
  });

  return [
    currentOrders.sort((a, b) => (!!a && !!b ? a.event.startDate.localeCompare(b.event.startDate, 'en', { numeric: true }) : 0)),
    pastOrders,
    canceledOrders
  ];
};

const RenterReservations = () => {
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const matchesTabletDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));

  let [getOrdersAndEvents, { data, error, loading }] = useLazyQuery(EVENTS_LIST_BY_USER_ORDERS, {
    variables: { id: user.id },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!data) getOrdersAndEvents();
    else {
      const orders = data.user.payload.orders.filter(
        order => order.event.name.toLowerCase().includes(searchText?.toLowerCase()) || order.event.venue.city.toLowerCase().includes(searchText?.toLowerCase())
      );
      setOrders(orders);
    }
  }, [data, searchText]);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setIsScrollButtonVisible(true);
    } else if (scrolled <= 300) {
      setIsScrollButtonVisible(false);
    }
  };

  window.addEventListener('scroll', toggleVisible);

  if (loading || error) {
    return <div className="renter-reservation-loader">{loading ? <IndeterminateLoading /> : 'Error retrieving orders'}</div>;
  }
  if (!data) return null;
  const [currentOrders, pastOrders, canceledOrders] = separateOrders(orders);
  const typeaheadOptions = orders.map(order =>
    order.event.name?.toLowerCase().includes(searchText?.toLowerCase()) ? order.event.name : order.event.venue.city
  );

  return (
    <>
      <CardListContainer className="reservations-card-list-container">
        <div className="reservations-header">
          {matchesTabletDesktop && <HeadingOne label="Reservations" />}
          <Typeahead
            searchText={searchText}
            setSearchText={setSearchText}
            options={typeaheadOptions}
            onChange={val => setSearchText(val)}
            placeholder="FIND YOUR RESERVATION"
          />
        </div>
        {!data.user.payload.orders.length && (
          <div className="no-results-container">
            <p className="no-reservations">No reservations found</p>
          </div>
        )}
        {!!data.user.payload.orders.length && !orders.length && (
          <div className="no-results-container">
            <p className="no-reservations">
              No results for <b>"{searchText}"</b>
            </p>
            <p className="no-reservations">You may want to try using different keywords or checking for typos</p>
          </div>
        )}
        <div className="reservations-table-container">
          {!!currentOrders.length && <EventCardList orders={currentOrders} />}
          {!!pastOrders.length && <EventCardList header="PAST" orders={pastOrders} />}
          {!!canceledOrders.length && <EventCardList primary header="CANCELED" orders={canceledOrders} />}
        </div>
        {isScrollButtonVisible && (
          <ScrollToButton
            style={{
              position: 'fixed',
              bottom: 12,
              margin: '0 auto',
              left: `${matchesMobile ? '43%' : '50%'}`,
              right: `${matchesMobile ? '' : '50%'}`,
              zIndex: 1
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        )}
      </CardListContainer>
      <Footer />
    </>
  );
};

export default RenterReservations;
