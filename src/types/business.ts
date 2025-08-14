import { PaginatedResponse } from "./common";


export interface Business {
  id: number;
  code: string;
  name: string;
  description: string;
  locationId: string; // Reference to location
  initialHbl: string; // Initial HBL code
  address: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  fixedRate: number;
  invoiceText: string; // Only shown/edited in form
  users: number[]; // Associated user IDs
  parentBusiness: {
    id: number;
    name: string;
  }; // Parent business ID
  childBusinessIds: number[]; // Child business IDs
  photos: string[]; // Image URLs (details)
}

/**
 * Structure for GET /businesses response
 */
export type GetAllBusiness = PaginatedResponse<Business>;

/**
 * Required data to create a Business
 */
export type CreateBusiness = {
  name: string;
  code: string;
  description: string;
  locationId: string;
  initialHbl: string;
  address: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  fixedRate: number;
  invoiceText: string;
  users: number[];
  parentBusinessId?: number;
  childBusinessIds: number[];
  photos: string[]; // Files to upload
};
export type Photo = { fileName: string; content: File };

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
  photos?: Photo[]; // File or existing URL
};

/**
 * Fields used in details view (only name, HBL and photos)
 */
export type BusinessDetails = Pick<
  Business,
  "id" | "name" | "initialHbl" | "photos"
>;
