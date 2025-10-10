export type Country = {
  id: number;
  name: string;
  code: string;
  phoneNumberCode: number;
  region: string;
  active: boolean;
};

export type BaseCountry = {
  id: string;
  name: string;
  code: string;
  phoneNumberCode: number;
};
