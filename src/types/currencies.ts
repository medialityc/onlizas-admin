export type Currency = {
  id: number;
  name: string;
  codIso: string;
  rate: number;
  default: boolean;
  isActive: boolean;
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
