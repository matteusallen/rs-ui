import { GroupFormType, CreateGroupType, GroupSidePanelType } from './types';

export const mapFormToCreateGroupInput = (form: GroupFormType): CreateGroupType => {
  return {
    name: form.name,
    contactName: form.contactName,
    email: form.email,
    phone: form.phone,
    groupLeaderId: form.groupLeaderId ? `${form.groupLeaderId}` : null
  };
};

export const mapFormToUpdateGroupInput = (form: GroupFormType, id: string | number | undefined): GroupSidePanelType => {
  return {
    id: id || 0,
    name: form.name,
    contactName: form.contactName,
    email: form.email,
    phone: form.phone,
    groupLeaderId: form.groupLeaderId ? `${form.groupLeaderId}` : null
  };
};
