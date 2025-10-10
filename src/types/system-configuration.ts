export type CreateSystemConfigurationDto = {
  configurationType: string;
  additionalSettings: string;
  countryId: number|string;
};

export type SystemConfiguration = {
  id: number|string;
  countryCode: string;
  configurationType: string;
  additionalSettings: string;
  countryId: number|string;
  countryName: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type UpdateSystemConfiguration = {
  updateData: {
    countryCode: string;
    configurationType: string;
    additionalSettings: string;
    countryId: number|string;
    active: boolean;
  };
};
