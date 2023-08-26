import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import styled from 'styled-components';
import { HeadingFive } from 'Components/Headings';
import { GET_DEFERRABLE_GROUPS } from 'src/queries/Admin/GetDeferrableGroups';
import { FormSelect } from 'Components/Select';
import colors from '../../../../styles/Colors';
import { sortArrayOfObj } from 'src/utils/arrayHelpers.js';
import { UserContext } from '../../../../store/UserContext';
import { GROUP_LEADER } from '../../../../constants/userRoles';
import { GROUP_LEADER_GROUPS } from '../../../../queries/GroupLeader/GroupsTable';

const GroupSelectBase = ({ onChange, selectedGroup, className }) => {
  const { user } = useContext(UserContext);

  const { data, loading, error } = useQuery(+user.role.id === GROUP_LEADER ? GROUP_LEADER_GROUPS : GET_DEFERRABLE_GROUPS, {
    fetchPolicy: 'network-only',
    variables: {
      groupLeaderId: user.id,
      allowDeferred: true
    }
  });

  if (loading || error) {
    return <div>{loading ? <IndeterminateLoading className="groups-loading" /> : 'Error retrieving groups'}</div>;
  }

  const groups = data.groups.map(group => ({ value: group.id, label: group.name }));

  const groupListForSelect = {
    cb: e => onChange(e),
    options: sortArrayOfObj(groups, 'label'),
    selectedOption: selectedGroup,
    label: 'GROUP NAME',
    type: 'select',
    value: ''
  };

  return (
    <>
      <HeadingFive style={{ marginTop: '100px' }} label="Group" className="group-header" />
      <div className={`${className}__payment-details-group`}>
        <FormSelect id="group-select" className="group-select" {...groupListForSelect} />
      </div>
    </>
  );
};

export const GroupSelect = styled(GroupSelectBase)`
  &__payment-details-group {
    color: rgb(0, 0, 0);
    font-size: 0.9375rem;
    line-height: 24px;
    margin: 20px 0;
    padding: 13px 0 0;
    background-color: ${colors.background.primary} !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    &::placeholder {
      color: ${colors.text.secondary};
    }
    &--disabled {
      opacity: 0.5;
    }

    &&& {
      label[class^='MuiInputLabel-formControl'],
      label[class*='MuiInputLabel-formControl'] {
        top: -13px;
      }
      svg[class^='MuiSelect-icon'],
      svg[class*='MuiSelect-icon'] {
        top: -2px;
      }
    }
    &&& {
      label[class^='MuiFormLabel-filled'],
      label[class*='MuiFormLabel-filled'] {
        top: -12px;
      }
      div[class^='MuiSelect-selectMenu'],
      div[class*='MuiSelect-selectMenu'] {
        margin-bottom: 15px;
      }
    }
  }
`;
