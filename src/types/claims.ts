export enum ClaimStatus {
  PENDING = 0,
  UNDER_REVIEW = 1,
  RESOLVED_FAVOR_CLIENT = 2,
  RESOLVED_FAVOR_SUPPLIER = 3,
  CANCELLED = 4,
}

export enum ClaimType {
  DEFECTIVE_PRODUCT = 0,
  WRONG_PRODUCT = 1,
  NOT_RECEIVED = 2,
  INCOMPLETE_ORDER = 3,
  OTHER = 99,
}

export interface Claim {
  id: string;
  subOrderId: string;
  customerId: string;
  supplierId: string;
  type: ClaimType;
  status: ClaimStatus;
  description: string;
  claimedAmount: number;
  resolutionNotes: string;
  resolvedAt: string | null;
  refundAccountId: string;
  createdAt: string;
}

export interface GetAllClaims {
  data: Claim[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ResolveClaimPayload {
  claimId: string;
  favorClient: boolean;
  resolutionNotes?: string;
}
