import React, { useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Modal, Card, Button, Checkbox } from '@material-ui/core';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import cliTruncate from 'cli-truncate';
import { UserContextType } from '../../../../store/UserContextType';
import { UserContext } from '../../../../store/UserContext';
import { EVENTS_BY_GROUP_ID } from '../../../../queries/Admin/GetEventsByGroupId';
import { restAPI } from '../../../../lib/api';
import { SnackbarContext, SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import './GroupBillModal.scss';

interface GroupBillModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onCancel: () => void;
  name: string;
  continueLabel: string;
  groupId: number;
}

type EventType = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

const GroupBillModal: React.FC<GroupBillModalProps> = ({ isOpen, handleClose, onCancel, name, continueLabel, groupId }) => {
  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const { user } = useContext<UserContextType>(UserContext);
  const { data, loading, error } = useQuery(EVENTS_BY_GROUP_ID, {
    variables: { groupId },
    fetchPolicy: 'network-only'
  });
  const [groupsForBill, setGroupsForBill] = useState<number[]>([]);

  if (loading || error) {
    return <div style={{ marginTop: '200px' }}>{loading ? <IndeterminateLoading className="groups-loading" /> : 'Error retrieving group'}</div>;
  }

  const handleSubmit = async () => {
    try {
      await restAPI({
        path: 'admin/download/group-bill',
        method: 'POST',
        body: {
          groupId,
          eventIds: groupsForBill,
          userId: user.id,
          reportType: 'group-bill'
        },
        header: {
          responseType: 'blob'
        },
        isDownload: true,
        fileName: 'Group_Bill_Reports.xlsx'
      });
      showSnackbar('Report successfully downloaded and a copy will be emailed to your registered email address', { duration: 5000, error: false });
      setGroupsForBill([]);
      handleClose();
    } catch (err) {
      showSnackbar(`Unable to download report: ${err}`, {
        duration: 5000,
        error: true
      });
    }
  };

  const handleCheckboxChange = (id: number) => {
    if (!groupsForBill.includes(id)) setGroupsForBill([...groupsForBill, id]);
    else setGroupsForBill(groupsForBill.filter(group => group !== id));
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        handleClose();
        setGroupsForBill([]);
      }}
      disableAutoFocus={true}
      disableRestoreFocus={true}>
      <Card className="group-bill-modal-card" data-testid="group-bill-modal">
        <h4>{`EXPORT ${cliTruncate(name, 18)} BILL`}</h4>
        <div className="group-table">
          {data.groupEvents.map((event: EventType) => {
            return (
              <div className="group-table-row" key={`group-bill-${event.id}`}>
                <Checkbox value={event.id} onChange={e => handleCheckboxChange(Number(e.target.value))} color="primary" />
                <div className="event-info">
                  <p>{cliTruncate(event.name, 40)}</p>
                  <p>
                    {event.startDate} - {event.endDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="buttons-wrapper">
          <span>
            <Button
              variant="contained"
              data-testid="group-bill-modal-cancel"
              onClick={() => {
                onCancel();
                setGroupsForBill([]);
              }}>
              CANCEL
            </Button>
            <Button variant="contained" data-testid="group-bill-modal-continue" disabled={!groupsForBill.length} onClick={handleSubmit}>
              {continueLabel}
            </Button>
          </span>
        </div>
      </Card>
    </Modal>
  );
};

export default GroupBillModal;
