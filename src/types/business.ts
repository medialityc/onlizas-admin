import { PaginatedResponse } from "./common";

export interface Business {
  id: number|string;
  code: string;
  name: string;
  description: string;
  locationId: number|string; // Reference to location
  hblInitial: string; // Initial HBL code
  address: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  fixedRate: number;
  invoiceText: string; // Only shown/edited in form
  users: number[]; // Associated user IDs
  parentBusiness: { id: number; name: string }; // Parent business ID
  childBusinessIds: number[]; // Child business IDs
  photoObjectCodes: string[]; // Image URLs (details)
  active: boolean; // Active status
}

/**
 * Structure for GET /businesses response
 */
export type GetAllBusiness = PaginatedResponse<Business>;
export type GetAllProviderBusiness =
  PaginatedResponse<BusinessProviderResponse>;

/**
 * Required data to create a Business
 */
export type CreateBusiness = {
  name: string;
  code: string;
  description: string;
  locationId: number|string;
  hblInitial: string;
  address: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  fixedRate: number;
  invoiceText: string;
  /* users: number[]; */
  parentId?: number|string;
  //childBusinessIds: number[];
  photoObjectCodes: string[]; // Files to upload
};

/**
 * Allowed data to update a Business
 */
export type UpdateBusiness = {
  name?: string;
  description?: string;
  locationId?: string|number;
  initialHbl?: string;
  address?: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
  fixedRate?: number;
  invoiceText?: string;
  users?: number[];
  parentBusinessId?: number;
  childBusinessIds?: number[];
  photos?: []; // File or existing URL
};

/**
 * Fields used in details view (only name, HBL and photos)
 */
export type BusinessDetails = Pick<
  Business,
  "id" | "name" | "hblInitial" | "photoObjectCodes"
>;

export type BusinessLogs = {
  id: number|string;
  timestamp: string;
  description: string;
  businessGuid: string;
  businessName: string;
  businessCode: string;
  userId: number|string;
  userName: string;
  ownerId: number|string;
  ownerName: string;
  locationId: number|string;
  locationName: string;
};

export type BusinessProviderResponse = {
  id: number|string;
  guid: string;
  name: string;
  code: string;
  description: string;
  isPrimary: boolean;
  ownerId: number|string;
  ownerName: string;
  locationId: number|string;
  parentId?: number|string;
  childrenCount: number;
  usersCount: number;
  subSystemsCount: number;
  active: boolean;
  address: string;
  email: string;
  phone: string;
};
export type GetAllBusinessLogs = PaginatedResponse<BusinessLogs>;
