import { PaginatedResponse } from "./common";

export type Currency = {
  id: number | string;
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
  id: number | string;
  timestamp: string;
  description: string;
  currencyId: number | string;
  currencyName: string;
  userId: number | string;
  userName: string;
  codIso: string;
  symbol: string;
};

export type GetAllCurrenciesLogs = PaginatedResponse<CurrenciesLogs>;
