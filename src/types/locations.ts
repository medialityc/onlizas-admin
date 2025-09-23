import { PaginatedResponse } from "./common";

// Enums para Location
export enum LocationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE", 
  DELETE = "DELETE"
}

export enum LocationType {
  WAREHOUSE = 0,
  STORE = 1,
  DISTRIBUTION_CENTER = 2,
  PICKUP_POINT = 3,
  OFFICE = 4,
  OTHER = 5
}

export type ILocation = {
  id: number;
  globalId: string;
  name: string;
  countryCode: string;
  state: string;
  district: string;
  addressRaw: string;
  addressNormalized: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  geohash: string;
  placeId?: string;
  type: number; // LocationType enum value
  status: string | number; // Can be string enum or number
  partialAddress: boolean;
  hasManualCorrection: boolean;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isActive: boolean;
};

export type GetAllLocations = PaginatedResponse<ILocation>;

export type LocationFilter = {
  status?: string;
  type?: string;
  countryCode?: string;
  state?: string;
  district?: string;
};

export type LocationLogs = {
  id: number;
  timestamp: string;
  description: string;
  locationId: number;
  locationName: string;
  locationAddress: string;
  locationType?: string;
  locationStatus: string;
  changedById: number;
  changedByName: string;
};

export type GetAllLocationLogsResponse = PaginatedResponse<LocationLogs>;

// Tipos para crear y actualizar ubicaciones
export type CreateLocationData = {
  name: string;
  countryCode: string;
  state: string;
  district: string;
  addressRaw: string;
  addressNormalized: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  placeId: string;
  type: number;
  tags: string[];
};

export type UpdateLocationData = Partial<CreateLocationData>;

