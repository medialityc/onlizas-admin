import { PaginatedResponse } from "./common";

export type ILocation = {
  id: number;
  name: string;
  country_code: string;
  state: string;
  district: string;
  address_raw: string;
  latitude: number;
  longitude: number;
  place_id?: string;
  type?: string;
  status: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type GetAllLocations = PaginatedResponse<ILocation>;

export type LocationFilter = {
  status?: string;
  type?: string;
  country_code?: string;
  state?: string;
  district?: string;
};
