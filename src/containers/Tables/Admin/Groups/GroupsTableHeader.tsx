import { HeadingOne } from 'Components/Headings';
import React from 'react';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';

import AddButton from '../../../../components/Button/AddButton';

interface GroupsTableHeaderProps {
  handleClick: () => void;
}

const GroupsTableHeader: React.FC<GroupsTableHeaderProps> = ({ handleClick }) => {
  const canCreateGroup = useValidateAction('groups', actions.CREATE_GROUP);

  return (
    <div className={`groups-page-header`}>
      <div className={`groups-header-wrapper`}>
        <HeadingOne label="GROUPS" />
        {canCreateGroup && (
          <div>
            <AddButton className="create-groups-button" label={'CREATE NEW'} onClick={handleClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsTableHeader;
