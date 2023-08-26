// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
/* global API_GATEWAY_TOKEN */
declare var API_GATEWAY_TOKEN: string;

import React, { useState, useEffect, useContext } from 'react';
import { Modal, Card, Button, Checkbox } from '@material-ui/core';
import { useQuery, useLazyQuery } from 'react-apollo';
import { USERS_FOR_TRANSACTION_REPORT_SELECTION } from '../../../queries/Admin/UsersForTransactionReportSelection';
import { VENUE_EVENTS_FOR_REPORTS, FUZZY_VENUE_EVENTS_FOR_REPORTS } from '../../../queries/Admin/VenueEventsForReports';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import DateRangePickerCreateReservation from 'Components/DatePicker/DateRangePickerCreateReservation';
import moment from 'moment';
import { FormSelect } from 'Components/Select';
import SelectTypeahead from 'Components/Typeahead/SelectFormTypeahead';
import Auth from 'Lib/auth';
import { Report } from 'Constants/reportType';
import { SnackbarContextActionsType, SnackbarContext } from 'Store/SnackbarContext';
import { UserContext } from 'Store/UserContext';
import { UserContextType } from 'Store/UserContextType';
import download from 'downloadjs';
import './css/ReportModal.scss';
import { HeadingThree } from 'Components/Headings';

const PENDING_MESSAGE = 'too large';

interface ReportModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onCancel: () => void;
  header: string;
  reportType: string;
}

type AdminType = {
  id: number | string;
  fullName: string;
};

type AdminListType = {
  value: string;
  label: string;
};

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
  venueId: string | number;
  userId: string | number;
  reportType: string;
  start?: Date | null;
  end?: Date | null;
  eventIds?: number[] | string[];
  adminIds?: number[] | string[];
};

const TransReportModal: React.FC<ReportModalProps> = ({ isOpen, handleClose, onCancel, header, reportType }) => {
  const API_URL = process.env.REACT_APP_API_URL || '';
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const { user } = useContext<UserContextType>(UserContext);
  const [timeFrameOption, setTimeFrameOption] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<EventListType[]>([]);
  const [selectedEventsMap, setSelectedEventsMap] = useState<any>({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [hasNoRecords, setHasNoRecords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isReconReport = reportType === Report.RECON;
  const isTransactionReport = reportType === Report.TRANSACTION;

  const userVenueId = user?.venues && user.venues[0].id;

  const { data: admins, loading } = useQuery(USERS_FOR_TRANSACTION_REPORT_SELECTION, {
    variables: {
      filterBy: {
        roleId: [1, 4]
      }
    }
  });

  const { data: initialEvents, loading: initialEventsLoading } = useQuery(VENUE_EVENTS_FOR_REPORTS, {
    variables: {
      id: userVenueId,
      limit: 3,
      orderBy: ['createdAt', 'DESC']
    }
  });

  const { data: firstEvent } = useQuery(VENUE_EVENTS_FOR_REPORTS, {
    variables: {
      id: userVenueId,
      limit: 1,
      orderBy: ['createdAt', 'ASC']
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

  const reportByEvent = timeFrameOption === 1;

  const resetModal = () => {
    setSelectedEvents([]);
    setStartDate(null);
    setSearchText('');
    setSelectedAdmin(1);
    setTimeFrameOption(1);
    setHasNoRecords(false);
    handleClose();
  };

  const requestReport = () => {
    const builtBody: ReportBodyType = {
      reportType,
      venueId: userVenueId,
      userId: user.id,
      eventIds: reportByEvent ? selectedEvents.map(event => event.id) : [],
      start: reportByEvent ? null : startDate,
      end: reportByEvent ? null : endDate
    };

    if (isReconReport || isTransactionReport) {
      builtBody.adminIds = selectedAdmin === 1 ? [] : [selectedAdmin];
    }

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
        if (response.status === 204) {
          setHasNoRecords(true);
          throw new Error('No records found');
        } else if (response.status === 202) {
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
        } else download(blob, `${reportType}_report.xlsx`);
      })
      .then(() => resetModal())
      .catch(err => {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.error(err);
        showSnackbar(err.message || 'Unable to process report', {
          duration: 5000,
          error: true
        });
      });
  };

  if (loading || initialEventsLoading) return <IndeterminateLoading className="admins-loading" />;

  const timeFrameOptions = {
    cb: (e: any) => {
      setSelectedEvents([]);
      setStartDate(null);
      setSearchText('');
      setHasNoRecords(false);
      setTimeFrameOption(e.target.value);
    },
    options: [
      { label: 'By event', value: 1, dataTestid: 'report-by-event' },
      { label: 'By date', value: 2, dataTestid: 'report-by-date' }
    ],
    selectedOption: timeFrameOption,
    label: 'TIME FRAME',
    type: 'select'
  };

  const adminsOptionsList: AdminListType[] = admins?.venue.users.map((admin: AdminType) => {
    return { label: admin.fullName, value: admin.id };
  });

  const adminName = adminsOptionsList.find(admin => Number(admin.value) == selectedAdmin);
  // Temporarily removing as line maybe needed in the future for expanding upon Trans Report Modal.
  const adminOptions = {
    cb: (e: any) => {
      setHasNoRecords(false);
      setSelectedAdmin(e.target.value);
    },
    options: [{ label: 'All admins', value: 1 }, ...(adminsOptionsList || [])],
    selectedOption: selectedAdmin,
    label: 'ADMIN',
    type: 'select'
  };

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
    const newEvent = eventOptions.find((event: EventListType) => event.id === eventId);
    const newEventsList = [...selectedEvents];
    if (newEvent) newEventsList.push(newEvent);
    if (isTransactionReport) setSelectedEvents([newEvent]);
    else setSelectedEvents(newEventsList);
    setSearchText('');
    setHasNoRecords(false);
  };

  const handleDeselectEvent = (eventId: string) => {
    const newEvents = selectedEvents.filter(event => event.id !== eventId);
    setSelectedEvents(newEvents);
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

  const getErrorText = () => {
    if (!reportByEvent) return 'No records found for this date range';
    if (reportType === Report.ACCOUNTING) return `No records found within the selected event${selectedEvents.length > 1 ? 's' : ''}`;
    return `No records found for ${adminName?.label} within the selected event${selectedEvents.length > 1 ? 's' : ''}`;
  };

  const firstEventCreatedDate = firstEvent?.venue.events[0]?.createdAt || moment().subtract(1, 'months');
  const maxCalendarDate = moment(startDate)
    .add(1, 'years')
    .isBefore(moment())
    ? moment(startDate).add(1, 'years')
    : moment().endOf('day');

  return (
    <Modal
      open={isOpen}
      onClick={() => {
        if (isMenuOpen) setIsMenuOpen(false);
      }}
      onClose={() => {
        if (isMenuOpen) setIsMenuOpen(false);
        else {
          resetModal();
        }
      }}
      disableAutoFocus={true}
      disableRestoreFocus={true}>
      <Card className="report-modal" data-testid="report">
        <HeadingThree label={header} />
        <p>Select the time frame{`${isReconReport ? ' and admin' : ''}`} for your report</p>
        <FormSelect id="time-frame-select" className="recon-select" {...timeFrameOptions} />
        {isReconReport && <FormSelect id="admin-select" className="recon-select" {...adminOptions} />}
        <p>
          Report will show all {selectedAdmin === 1 ? 'admin' : `${adminName?.label}'s`} transactions for the selected{' '}
          {reportByEvent ? 'event(s)' : 'date range'}
        </p>
        {hasNoRecords && <div className="error-banner">{getErrorText()}</div>}
        {reportByEvent ? (
          <SelectTypeahead
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            emptyLabel={getEmptyLabel()}
            loading={eventsLoading}
            searchText={searchText}
            setSearchText={setSearchText}
            options={typeaheadOptions}
            onChange={(val: string) => setSearchText(val)}
            placeholder={'SEARCH EVENTS'}
            handleSelect={handleSelectEvent}
            prodType=""
          />
        ) : (
          <div className={`date-wrapper`}>
            <div className={`date-input--wrapper`}>
              <DateRangePickerCreateReservation
                minimumNights={0}
                showBackDateWarning={false}
                minDate={firstEventCreatedDate}
                maxDate={maxCalendarDate}
                startTitle="START"
                endTitle="END"
                startLabel="start"
                endLabel="end"
                dateChangeCallback={(e: any) => {
                  setHasNoRecords(false);
                  setStartDate(e.startDate);
                  setEndDate(e.endDate);
                }}
              />
            </div>
          </div>
        )}
        {!!selectedEvents.length && reportByEvent && (
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
        {selectedEvents.length > 1 && <div className="gradient-div" />}
        <div className="buttons-wrapper">
          <span>
            <Button
              variant="contained"
              data-testid="report-cancel"
              onClick={() => {
                resetModal();
                onCancel();
              }}>
              GO BACK
            </Button>
            <Button
              variant="contained"
              data-testid="report-continue"
              disabled={(reportByEvent && !selectedEvents.length) || isLoading || hasNoRecords || (!reportByEvent && (!startDate || !endDate))}
              onClick={requestReport}>
              EXPORT
            </Button>
          </span>
        </div>
      </Card>
    </Modal>
  );
};

export default TransReportModal;
