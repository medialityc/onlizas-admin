import { PaginatedResponse } from "./common";

export type ILocation = {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
};

export type GetAllLocations = PaginatedResponse<ILocation>;

export type LocationFilter = {
  isActive?: boolean;
};
