import { PaginatedResponse } from "./common";

export type Currency = {
  id: number;
  name: string;
  codIso: string;
  rate: number;
  default: boolean;
  active: boolean;
};

export type CreateCurrency = {
  name: string;
  codIso: string;
  symbol: string;
  rate: number;
};

export type UpdateCurrency = {
  name: string;
  symbol: string;
  rate: number;
};

export type CurrenciesLogs = {
  id: number;
  timestamp: string;
  description: string;
  currencyId: number;
  currencyName: string;
  userId: number;
  userName: string;
  codIso: string;
  symbol: string;
};

export type GetAllCurrenciesLogs = PaginatedResponse<CurrenciesLogs>;
