export type GroupType = {
  id: number | string;
  name: string;
  contactName: string;
};

export type CreateGroupInputType = {
  input: {
    name: string;
    contactName: string;
    email: string;
    phone: string;
  };
};

export type CreateGroupType = {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  groupLeaderId: string | null;
};

export type GroupSidePanelType = {
  id: number | string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  hasOrders?: boolean;
  groupLeaderId: string | null;
};

export type GroupFormType = {
  id?: string | number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  isSubmitting?: boolean;
  groupLeaderId: string | null;
};

export interface CreateGroupModalInterface {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  group?: GroupSidePanelType;
}

export interface CreateGroupFormInterface {
  isLoading: boolean;
  onClose: () => void;
}

export interface GroupSidePanelInterface {
  onClose: () => void;
  id: string | number;
}
