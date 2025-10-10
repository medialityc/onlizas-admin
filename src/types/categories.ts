import { PaginatedResponse } from "./common";

export type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
  active: boolean;
  department: {
    id: number;
    name: string;
  };
  totalProducts: number;
  activeProducts: number;
  productsWithStock: number;
  features?: Feature[];
};
export type AduanaCategory = {
  guid: string;
  name: string;
};
export type Feature = {
  featureName: string;
  featureDescription: string;
  suggestions: string[];
  isPrimary: boolean;
  isRequired: boolean;
};

export type CreateCategory = {
  name: string;
  departmentId: number;
  description: string;
  image: string;
  active: boolean;
  features: Feature[];
};

export type UpdateCategory = CreateCategory;

export type GetAllCategories = PaginatedResponse<Category>;
export type GetAllAduanaCategories = PaginatedResponse<AduanaCategory>;
export type CategoryLogs = {
  id: number;
  timestamp: string;
  description: string;
  categoryId: number;
  categoryName: string;
  userId: number;
  userName: string;
};

export type GetAllCategoriesLogs = PaginatedResponse<CategoryLogs>;
