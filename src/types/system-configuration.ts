export type CreateSystemConfigurationDto = {
  configurationType: string;
  additionalSettings: string;
  countryId: number;
};

export type SystemConfiguration = {
  id: number;
  countryCode: string;
  configurationType: string;
  additionalSettings: string;
  countryId: number;
  countryName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type UpdateSystemConfiguration = {
  updateData: {
    countryCode: string;
    configurationType: string;
    additionalSettings: string;
    countryId: number;
    isActive: boolean;
  };
};
