export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

// User types
export interface Email {
  address: string;
  isVerified: boolean;
}
export interface Phone {
  countryId: number;
  number: string;
  isVerified: boolean;
}

// User types
export interface User {
  name: string;
  emails: Email[];
  phones: Phone[];
  photoUrl: string;
}

export type SessionData = {
  user: User | null;
  tokens: Tokens | null;
  shouldClear?: boolean;
};

export type Credentials = {
  email?: string;
  phoneNumberCountryId?: number;
  phoneNumber?: string;
  password: string;
};
