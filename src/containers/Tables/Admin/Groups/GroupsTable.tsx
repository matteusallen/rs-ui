import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Header from './GroupsTableHeader';
import { UserContext } from '../../../../store/UserContext';
import './GroupsTable.scss';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import { GROUPS_TABLE } from '../../../../queries/Admin/GroupsTable';
import { GROUP_LEADER_GROUPS } from '../../../../queries/GroupLeader/GroupsTable';
import { GroupType } from './types';
import CreateGroupModal from './CreateAndEditGroupModal';
import ContextSnackbar from '../../../../components/Snackbar';
import GroupsTableSidePanel from './GroupsTableSidePanel';
import upperFirst from '../../../../utils/upperFirst';
import { sortArrayOfObj } from '../../../../utils/arrayHelpers';
import { GROUP_LEADER } from '../../../../constants/userRoles';

const GroupsTable: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | number>(0);
  const [groups, setGroups] = useState<GroupType[]>([]);

  const { user } = useContext(UserContext);

  const { data, loading, error } = useQuery(+user.role.id === GROUP_LEADER ? GROUP_LEADER_GROUPS : GROUPS_TABLE, {
    fetchPolicy: 'network-only',
    variables: {
      groupLeaderId: user.id
    }
  });

  useEffect(() => {
    if (data) {
      const sortedGroups = sortArrayOfObj(data.groups, 'name');
      setGroups(sortedGroups);
    }
  }, [data]);

  const toggleModal = (): void => {
    setCreateModalOpen(!createModalOpen);
  };

  if (loading || error) {
    return <div style={{ marginTop: '200px' }}>{loading ? <IndeterminateLoading className="groups-loading" /> : 'Error retrieving groups'}</div>;
  }

  return (
    <>
      <ContextSnackbar />
      <Header handleClick={toggleModal} />
      <div className="groups-bottom-border" />
      <div className="groups-table-container">
        {groups.map((group: GroupType) => {
          return (
            <div className="groups-table-row" data-testid="groups-table-row" key={`group-row-${group.id}`} onClick={() => setSelectedGroupId(group.id)}>
              <div className="group-name">{upperFirst(group.name)}</div>
              <div className="group-contact">{upperFirst(group.contactName)}</div>
            </div>
          );
        })}
      </div>
      {!!selectedGroupId && <GroupsTableSidePanel onClose={() => setSelectedGroupId(0)} id={selectedGroupId} />}
      <CreateGroupModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </>
  );
};

export default GroupsTable;
