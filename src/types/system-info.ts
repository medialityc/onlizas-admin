export interface Address {
  id: string;
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string | null;
}

export interface CreateUpdateAddress {
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  isActive: boolean;
}

export interface SocialNetwork {
  id: string;
  platform: string;
  url: string;
  username?: string | null;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string | null;
}

export interface CreateUpdateSocialNetwork {
  platform: string;
  url: string;
  username?: string | null;
  isActive: boolean;
}

export interface SystemNumber {
  id: string;
  phoneNumber: string;
  label?: string | null;
  countryCode?: string | null;
  extension?: string | null;
  isWhatsApp: boolean;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string | null;
}

export interface CreateUpdateSystemNumber {
  phoneNumber: string;
  label?: string | null;
  countryCode?: string | null;
  extension?: string | null;
  isWhatsApp: boolean;
  isActive: boolean;
}

export interface SystemEmail {
  id: string;
  email: string;
  label?: string | null;
  isActive: boolean;
  createdDatetime: string;
  updatedDatetime: string | null;
}

export interface CreateUpdateSystemEmail {
  email: string;
  label?: string | null;
  isActive: boolean;
}
