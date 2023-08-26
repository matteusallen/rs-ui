import React, { useState, useEffect, useContext } from 'react';
import EditGroupModal from './CreateAndEditGroupModal';
import Button from '@material-ui/core/Button';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import { useQuery } from '@apollo/react-hooks';
import { ClosePanelButton } from '../ViewOrderSidePanel/ClosePanelButton';
import { formatPhoneNumber } from '../../../../helpers/formatPhoneNumber';
import { useMutation } from '@apollo/react-hooks';
import DELETE_GROUP from '../../../../mutations/DeleteGroup';
import { SnackbarContext } from '../../../../store/SnackbarContext';
import { SnackbarContextActionsType } from '../../../../store/SnackbarContext';
import { GROUP_BY_ID } from '../../../../queries/Admin/GetGroupById';
import { REFRESH_CODE_BY_ID } from '../../../../queries/Admin/RefreshCode';
import { GROUPS_TABLE } from '../../../../queries/Admin/GroupsTable';
import { GroupSidePanelInterface } from './types';
import WarningModal from '../../../../components/WarningModal/WarningModal';
import GroupBillModal from './GroupBillModal';
import { HeadingFour } from 'Components/Headings';
import './GroupsTableSidePanel.scss';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';
import ErrorIcon from '@material-ui/icons/Error';
import { CancelButtonAlt as RefreshCodeButton } from '../../../../components/Button/CancelLink';
import { UserContext } from '../../../../store/UserContext';
import USER_ROLES from '../../../../constants/userRoles';

const GroupsTableSidePanel: React.FC<GroupSidePanelInterface> = ({ onClose, id }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isGroupBillModalOpen, setIsGroupBillModalOpen] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [codeHasBenRefreshed, setCodeHasBenRefreshed] = useState(false);

  const { showSnackbar } = useContext<SnackbarContextActionsType>(SnackbarContext);
  const { user } = useContext(UserContext);

  const isGroupLeader = user.role.name === USER_ROLES.GROUP_LEADER;

  const { data: groupData, loading: fetchLoading, error: fetchError, refetch } = useQuery(GROUP_BY_ID, {
    variables: { id },
    fetchPolicy: 'network-only'
  });

  const [refreshCode] = useMutation(REFRESH_CODE_BY_ID, {
    variables: { id }
  });

  const [deleteGroup, { data, loading, error }] = useMutation(DELETE_GROUP, {
    variables: { id },
    refetchQueries: [
      {
        query: GROUPS_TABLE
      }
    ]
  });

  useEffect(() => {
    if (data) {
      showSnackbar('Group deleted successfully', {
        error: false,
        duration: 5000
      });
      onClose();
    } else if (error) {
      showSnackbar(error.message || 'Unable to delete group', { error: true, duration: 5000 });
    }
  }, [data, error]);

  useEffect(() => {
    if (copiedToClipboard) {
      setTimeout(() => {
        setCopiedToClipboard(false);
      }, 3000);
    }
  }, [copiedToClipboard]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(groupData.group.code);
    setCopiedToClipboard(true);
  };

  const handleRefreshCode = async () => {
    setCodeHasBenRefreshed(true);
    const response = await refreshCode();

    if (response.data.refreshCode) {
      refetch();
      setTimeout(() => {
        setCodeHasBenRefreshed(false);
      }, 3000);
    }
  };

  if (fetchLoading || fetchError || loading) {
    return <div style={{ marginTop: '200px' }}>{fetchLoading || loading ? <IndeterminateLoading className="groups-loading" /> : 'Error retrieving group'}</div>;
  }

  const { name, phone, contactName, email, orders, allowDeferred, code } = groupData.group;

  const canDeleteGroup = useValidateAction('groups', actions.DELETE_GROUP);
  const canEditGroup = useValidateAction('groups', actions.UPDATE_GROUP);
  const canRefreshCode = useValidateAction('groups', actions.REFRESH_CODE);

  return (
    <>
      <div className="group-side-panel">
        <div>
          <div className="header">
            <HeadingFour label={name} /> <ClosePanelButton onClose={onClose} />
          </div>
          {!orders.length && canDeleteGroup && (
            <Button className="delete-group-button" onClick={() => setIsWarningModalOpen(true)}>
              Delete Group
            </Button>
          )}
          <p className="deferred-state">
            DEFERRED PAYMENT IS TURNED <b>{allowDeferred ? 'ON' : 'OFF'}</b>
          </p>

          {allowDeferred && (
            <div className="code-container">
              <p onClick={handleCopyCode} data-testid="group-code-copy-code">
                PRIVATE GROUP CODE: {code}
              </p>
              {isGroupLeader && (
                <div className="info-tooltip" data-testid="group-code-info-tooltip">
                  <ErrorIcon />
                  Share only with renters in your group.
                </div>
              )}
              {canRefreshCode && (
                <RefreshCodeButton secondary onClick={handleRefreshCode} disabled={codeHasBenRefreshed} data-testid="group-code-code-generation-btn">
                  {codeHasBenRefreshed ? 'CODE REFRESHED' : 'REFRESH CODE'}
                </RefreshCodeButton>
              )}
              <div className={`copy-tooltip ${copiedToClipboard && 'open'}`} data-testid="group-code-copied-tooltip">
                Copied to clipboard!
              </div>
            </div>
          )}
        </div>
        {contactName && (
          <>
            <div className="group-side-divider">
              <h4 className="contact-name">Group Contact</h4>
              <div className={'line'} />
            </div>
            <div className="contact-information">
              <h4>{contactName}</h4>
              <p>{formatPhoneNumber(phone)}</p>
              <p>{email}</p>
            </div>
          </>
        )}
        <div className="export-edit-buttons-container">
          <Button className="group-export-bill" disabled={!orders.length} onClick={() => setIsGroupBillModalOpen(true)}>
            EXPORT GROUP BILL
          </Button>
          {canEditGroup && (
            <Button className="group-edit" onClick={() => setIsEditModalOpen(true)}>
              EDIT GROUP
            </Button>
          )}
        </div>
      </div>
      <WarningModal
        header="ARE YOU SURE?"
        onContinue={() => deleteGroup()}
        handleClose={() => setIsWarningModalOpen(false)}
        onCancel={() => setIsWarningModalOpen(false)}
        text={`Are you sure you would like to delete the group ${name}?`}
        continueLabel="Continue"
        isOpen={isWarningModalOpen}
        hideWarningIcon={false}
      />
      <GroupBillModal
        groupId={Number(id)}
        name={name}
        handleClose={() => setIsGroupBillModalOpen(false)}
        onCancel={() => setIsGroupBillModalOpen(false)}
        continueLabel="Export"
        isOpen={isGroupBillModalOpen}
      />
      <EditGroupModal
        group={groupData.group}
        isEdit={true}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsWarningModalOpen(false);
          setIsEditModalOpen(false);
        }}
      />
    </>
  );
};

export default GroupsTableSidePanel;
