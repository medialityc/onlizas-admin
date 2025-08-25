"use server";

export interface UpdateProviderPersonalInfoRequest {
  name: string;
  isBlocked: boolean;
  isVerified: boolean;
  photoObjectCode?: string;
  apiRole: number;
  attributesJson?: string;
  inaccessible: boolean;
  isActive: boolean;
  photoFile?: File;
  removePhoto: boolean;
  contents?: File[];
  namesFiles?: string[];
  benefactorGuid?: string;
  emails: Array<{
    address: string;
    isVerified: boolean;
    isActive: boolean;
  }>;
  phones: Array<{
    number: string;
    countryId: number;
    isVerified: boolean;
    isActive: boolean;
  }>;
  roleGuids?: string[];
  businessIds?: number[];
  beneficiaryGuids?: string[];
}
