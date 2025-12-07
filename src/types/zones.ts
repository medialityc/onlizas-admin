import { PaginatedResponse } from "./common";

export type District = {
  id: string;
  name: string;
};

export type GetDistricts = PaginatedResponse<District>;

export type Zone = {
  id: string;
  name: string;
  deliveryAmount: number;
  districtsIds: string[];
  userId: string;
  userName: string;
  active: boolean;
  createdDatetime: string;
  updatedDatetime: string;
};

export type GetZones = PaginatedResponse<Zone>;

export type CreateZonePayload = {
  name: string;
  deliveryAmount: number;
  districtsIds: string[];
};

export type UpdateZonePayload = CreateZonePayload;
