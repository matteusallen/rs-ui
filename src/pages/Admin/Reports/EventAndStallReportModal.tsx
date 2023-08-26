// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
/* global API_GATEWAY_TOKEN */
declare var API_GATEWAY_TOKEN: string;
import React, { useState, useEffect, useContext } from 'react';
import { Modal, Card, Button, Checkbox } from '@material-ui/core';
import { useQuery, useLazyQuery } from 'react-apollo';
import { VENUE_EVENTS_FOR_REPORTS, FUZZY_VENUE_EVENTS_FOR_REPORTS } from '../../../queries/Admin/VenueEventsForReports';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import moment from 'moment';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import download from 'downloadjs';
import SelectTypeahead from 'Components/Typeahead/SelectFormTypeahead';
import Auth from 'Lib/auth';
import { SnackbarContextActionsType, SnackbarContext } from 'Store/SnackbarContext';
import { UserContext } from 'Store/UserContext';
import { UserContextType } from 'Store/UserContextType';
import './css/ReportModal.scss';
import { HeadingThree } from 'Components/Headings';
import { Report } from 'Constants/reportType';

const PENDING_MESSAGE = 'too large';

interface ReportModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onCancel: () => void;
  header: string;
  reportType: string;
}

type EventListType = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  hasOrder?: boolean;
  hasStallRes: boolean;
  hasRVRes: boolean;
};

type ReportBodyType = {
  userId: string | number;
  reportType: string;
  eventIds?: number[] | string[];
};

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, handleClose, onCancel, header, reportType }) => {
  const API_URL = process.env.REACT_APP_API_URL || '';
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const { user } = useContext<UserContextType>(UserContext);
  const [selectedEvents, setSelectedEvents] = useState<EventListType[]>([]);
  const [selectedEventsMap, setSelectedEventsMap] = useState<any>({});
  const [searchText, setSearchText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [maxLimitExceeded, setMaxLimitExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const stallReport = reportType === Report.STALL;
  const rvReport = reportType === Report.RV;

  const getSubtitleDetail = () => {
    if (stallReport) {
      return 'assignments and add ons';
    }
    if (rvReport) {
      return 'assignments';
    }
    return 'transactions';
  };

  const { data: initialEvents, loading: initialEventsLoading } = useQuery(VENUE_EVENTS_FOR_REPORTS, {
    variables: {
      id: user?.venues && user.venues[0].id,
      limit: 3,
      orderBy: ['createdAt', 'DESC']
    }
  });

  const [searchEvents, { data: events, loading: eventsLoading }] = useLazyQuery(FUZZY_VENUE_EVENTS_FOR_REPORTS, {
    variables: {
      name: searchText?.slice(0, 12)
    }
  });

  useEffect(() => {
    if (searchText?.length > 2) searchEvents();
  }, [searchText]);

  useEffect(() => {
    const selectedEventsObj: any = {};
    selectedEvents.forEach(event => {
      selectedEventsObj[event.id] = true;
    });
    setSelectedEventsMap(selectedEventsObj);
  }, [selectedEvents]);

  const requestReport = () => {
    const builtBody: ReportBodyType = {
      reportType: reportType,
      userId: user.id,
      eventIds: selectedEvents.map(event => event.id)
    };

    const token = Auth.getToken();
    const payload = JSON.parse(JSON.stringify(builtBody));
    setIsLoading(true);
    showSnackbar('Generating report.  Download will begin shortly.', {
      duration: 30000,
      error: false
    });
    fetch(`${API_URL}/admin/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        auth: token ? `Bearer ${token}` : '',
        token: API_GATEWAY_TOKEN
      },
      mode: 'cors',
      body: JSON.stringify(payload)
    })
      .then(async response => {
        if (response.status === 202) {
          // show message for large file download
          const text = await response.text();
          return text;
        } else return response.blob();
      })
      .then(blob => {
        if (typeof blob === 'string' && blob.includes(PENDING_MESSAGE)) {
          showSnackbar(blob, {
            duration: 3200,
            error: false,
            info: true
          });
        } else download(blob, `${builtBody.reportType}.xlsx`);
      })
      .then(() => handleClose())
      .catch(err => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.error(err);
        showSnackbar('Unable to process report', {
          duration: 5000,
          error: true
        });
      });
  };

  if (initialEventsLoading) return <IndeterminateLoading className="admins-loading" />;

  const eventsToPass = searchText?.length > 2 && events ? events.searchEventsWithOrderCheck : initialEvents?.venue.events || [];
  const exactMatch = eventsToPass.find((event: EventListType) => event.name.toLowerCase() === searchText?.toLowerCase());
  const eventOptions = exactMatch ? [exactMatch] : eventsToPass;

  const typeaheadOptions = eventOptions.reduce((acc: any[], event: EventListType) => {
    if (!selectedEventsMap[event.id])
      acc.push({
        id: event.id,
        label: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        hasStallRes: event.hasStallRes,
        hasRVRes: event.hasRVRes
      });
    return acc;
  }, []);

  const handleSelectEvent = (eventId: string) => {
    if (selectedEvents.length > 4) setMaxLimitExceeded(true);
    else {
      const newEvent = eventOptions.find((event: EventListType) => event.id === eventId);
      const newEventsList = [...selectedEvents];
      if (newEvent) newEventsList.push(newEvent);
      setSelectedEvents(newEventsList);
    }
    setSearchText('');
  };

  const handleDeselectEvent = (eventId: string) => {
    const newEvents = selectedEvents.filter(event => event.id !== eventId);
    setSelectedEvents(newEvents);
    if (maxLimitExceeded) setMaxLimitExceeded(false);
  };

  const getEmptyLabel = () => {
    if (eventsLoading) return <IndeterminateLoading className="admins-loading" />;
    if (searchText?.length > 2)
      return (
        <p>
          No results for <b>"{searchText}"</b>
        </p>
      );
    return <p>No more events found</p>;
  };

  return (
    <Modal
      open={isOpen}
      onClick={() => {
        if (isMenuOpen) setIsMenuOpen(false);
      }}
      onClose={() => {
        if (isMenuOpen) setIsMenuOpen(false);
        else {
          setSelectedEvents([]);
          setSelectedEventsMap({});
          setSearchText('');
          handleClose();
        }
      }}
      disableAutoFocus={true}
      disableRestoreFocus={true}>
      <Card className="report-modal" data-testid="report">
        <HeadingThree label={header} />
        <p>Report will show all {getSubtitleDetail()} for the selected event(s)</p>
        <SelectTypeahead
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          emptyLabel={getEmptyLabel()}
          loading={eventsLoading}
          searchText={searchText}
          setSearchText={setSearchText}
          options={eventsLoading ? [] : typeaheadOptions}
          onChange={(val: string) => setSearchText(val)}
          placeholder={'SEARCH EVENTS'}
          handleSelect={handleSelectEvent}
          prodType={stallReport ? 'stall' : rvReport ? 'rv' : ''}
        />
        {maxLimitExceeded && (
          <div className="confirmation-banner">
            <div className="confirmation-content-container">
              <InfoOutlinedIcon style={{ marginRight: 5 }} />
              <span>Export cannot exceed five events</span>
            </div>
          </div>
        )}
        {!!selectedEvents.length && (
          <div className="selected-events-container">
            {selectedEvents.map(event => (
              <div key={event.id} className="selected-event">
                <Checkbox checked={true} onClick={() => handleDeselectEvent(event.id)} />
                <div className="event-name">
                  <span>{event.name}</span>
                  <span>{`${moment(event.startDate).format('MMM D, YYYY')} - ${moment(event.endDate).format('MMM D, YYYY')}`}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedEvents.length > 3 && <div className="gradient-div" />}
        <div className="buttons-wrapper">
          <span>
            <Button
              variant="contained"
              data-testid="report-cancel"
              onClick={() => {
                setSelectedEvents([]);
                setSearchText('');
                onCancel();
              }}>
              GO BACK
            </Button>
            <Button variant="contained" data-testid="report-continue" disabled={!selectedEvents.length || isLoading} onClick={requestReport}>
              EXPORT
            </Button>
          </span>
        </div>
      </Card>
    </Modal>
  );
};

export default ReportModal;
