import { Attributes, PaginatedResponse } from "./common";
import { IRole } from "./roles";

// User-related types and interfaces

export interface Email {
  address: string;
  isVerified: boolean;
}
export interface Phone {
  countryId: number;
  number: string;
  isVerified: boolean;
}

export interface Business {
  id: number;
  name: string;
  code: string;
}

export interface Beneficiary {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Benefactor {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  otherStreets: string;
  annotations: string;
  number: string;
  city: string;
  name: string;
  latitude: number;
  zipcode: string;
  longitude: number;
  state: string;
  country: string;
  countryId: number;
  mainStreet: string;
}

// # Attributes interface

// # Documents Interface
export interface IDocument {
  id: number;
  name: string;
  description: string;
  objectCode: string;
}

// User types
export interface IUser {
  id: number;
  name: string;
  hasPassword: boolean;
  hasEmail: boolean;
  hasPhoneNumber: boolean;
  emails: Email[];
  phones: Phone[];
  isBlocked: boolean;
  isVerified: boolean;
  isActive: boolean;
  photoUrl: string;
  apiRole: string;
  roles: IRole[];
  addresses: Address[];
  businesses: Business[];
  beneficiaries: IUser[];
  benefactor?: IUser;
  attributes: Attributes;
}

export type UserAttributeLog = {
  changedAt: string;
  changedBy: string;
  attributesJson: string;
};
// Response types
export type GetAllUsersResponse = PaginatedResponse<IUser>;

export type UpdateUserResponse = { message: string };

export type UpdateUserAttributesResponse = { success: boolean };

export type UserAttributeLogResponse = UserAttributeLog[];


export type Document = {
    id: number;
    name: string;
    description: string;
    objectCode: string;
};


// ORDER USER TYPES
export type OrderUser = {
    id: number;
    name: string;
    isVerified: boolean;
    isBlocked: boolean;
    email: string;
    phone: string;
    birthDate?: string;
    documents: Document[];
    address: Address | null;
};


export type PotentialOrderUser = {
  userExists: boolean;
  id: number;
  name: string;
  documentId: string;
  email: string | null;
  phone: string | null;
  documents: Document[];
  addresses: Address[];
};



export const IDENTITY_DOCUMENT_NAME = 'CI';
export const LICENSE_DOCUMENT_NAME = 'Licencia';
export const PASSPORT_DOCUMENT_NAME = 'Pasaporte';