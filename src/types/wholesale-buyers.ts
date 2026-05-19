export type WholesaleBuyerState =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Revoked";

export type WholesaleBuyerDTO = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  businessName: string;
  taxId: string | null;
  phone: string | null;
  phoneCountryCode: string | null;
  requestMessage: string | null;
  state: WholesaleBuyerState;
  rejectionReason: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export type WholesaleBuyerCommandResponse = {
  id: string;
  state: WholesaleBuyerState;
  message: string;
};

export type ListWholesaleBuyersResult = {
  items: WholesaleBuyerDTO[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type ApproveWholesaleBuyerInput = {
  expiresAt?: string | null;
};

export type RejectWholesaleBuyerInput = {
  rejectionReason?: string | null;
};

export type RevokeWholesaleBuyerInput = {
  rejectionReason?: string | null;
};
