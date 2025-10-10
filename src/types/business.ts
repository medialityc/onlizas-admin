import { PaginatedResponse } from "./common";

export interface Business {
  id: number;
  code: string;
  name: string;
  description: string;
  locationId: number; // Reference to location
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
  locationId: number;
  hblInitial: string;
  address: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  fixedRate: number;
  invoiceText: string;
  /* users: number[]; */
  parentId?: number;
  //childBusinessIds: number[];
  photoObjectCodes: string[]; // Files to upload
};

/**
 * Allowed data to update a Business
 */
export type UpdateBusiness = {
  name?: string;
  description?: string;
  locationId?: string;
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
  id: number;
  timestamp: string;
  description: string;
  businessGuid: string;
  businessName: string;
  businessCode: string;
  userId: number;
  userName: string;
  ownerId: number;
  ownerName: string;
  locationId: number;
  locationName: string;
};

export type BusinessProviderResponse = {
  id: number;
  guid: string;
  name: string;
  code: string;
  description: string;
  isPrimary: boolean;
  ownerId: number;
  ownerName: string;
  locationId: number;
  parentId?: number | null;
  childrenCount: number;
  usersCount: number;
  subSystemsCount: number;
  active: boolean;
  address: string;
  email: string;
  phone: string;
};
export type GetAllBusinessLogs = PaginatedResponse<BusinessLogs>;
