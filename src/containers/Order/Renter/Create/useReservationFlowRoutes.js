//@flow
import { useEffect, useState } from 'react';
import { useLocation, useHistory, useParams } from 'react-router';

import { subRouteCodes } from '../../../../constants/routes';

type ReservationFlowRoutesReturnType = {|
  checkoutRoutePattern: string,
  confirmationRoutePattern: string,
  goBack: () => void,
  goToCheckout: () => void,
  goToEvents: () => void,
  goToRvs: () => void,
  goToStalls: () => void,
  isCheckoutUrl: boolean,
  isLandingUrl: boolean,
  isRvsUrl: boolean,
  isStallsUrl: boolean,
  landingRoutePattern: string,
  prev: 'stalls' | 'rvs' | null,
  rvsRoutePattern: string,
  stallsRoutePattern: string
|};

export default (): ReservationFlowRoutesReturnType => {
  const { pathname } = useLocation();
  const { push, goBack } = useHistory();
  const { eventId } = useParams();
  const [flowHistory, setFlowHistory] = useState<string[]>([]);

  const [checkoutRoutePattern, rvsRoutePattern, landingRoutePattern, stallsRoutePattern] = subRouteCodes.RENTER.CREATE_ORDER;
  const confirmationRoutePattern = subRouteCodes.CONFIRM_RESERVATION;

  const goToCheckout = () => push(`/reservation/${eventId}/checkout`);
  const goToStalls = () => push(`/reservation/${eventId}/stalls`);
  const goToRvs = () => push(`/reservation/${eventId}/rvs`);
  const goToEvents = () => push('/events');

  const isCheckoutUrl = (path: string) => Boolean(path.match(/^\/reservation\/\d+\/checkout$/));
  const isRvsUrl = (path: string) => Boolean(path.match(/^\/reservation\/\d+\/rvs$/));
  const isStallsUrl = (path: string) => Boolean(path.match(/^\/reservation\/\d+\/stalls$/));
  const isLandingUrl = (path: string) => Boolean(path.match(/^\/reservation\/\d+$/));

  useEffect(() => {
    if (isLandingUrl(pathname) || isCheckoutUrl(pathname)) goToStalls();
  }, []);

  useEffect(() => {
    setFlowHistory([...flowHistory, pathname]);
  }, [pathname]);

  const [, prevUrl = ''] = [...flowHistory].reverse();

  return {
    prev: isRvsUrl(prevUrl) ? 'rvs' : isStallsUrl(prevUrl) ? 'stalls' : null,
    goBack,
    checkoutRoutePattern,
    goToCheckout,
    goToRvs,
    goToStalls,
    goToEvents,
    isCheckoutUrl: isCheckoutUrl(pathname),
    isLandingUrl: isLandingUrl(pathname),
    isRvsUrl: isRvsUrl(pathname),
    isStallsUrl: isStallsUrl(pathname),
    landingRoutePattern,
    rvsRoutePattern,
    stallsRoutePattern,
    confirmationRoutePattern
  };
};
