import { PaginatedResponse } from "./common";

export type Closure = {
  id: string;
  createdAt: string; // ISO date of cierre
  type: "TOTAL" | "PARCIAL";
  pendingAccounts: number;
  paidAccounts: number;
  errorAccounts: number;
};

export type GetAllClosures = PaginatedResponse<Closure>;

export type PlatformAccount = {
  id: string;
  name: string;
  accountNumber: string;
  purpose: number;
  purposeName: string;
  bank: string;
  isMainAccount: boolean;
  description: string;
  active: boolean;
};

export type GetPlatformAccounts = {
  data: PlatformAccount[];
};
