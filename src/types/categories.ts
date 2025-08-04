import { PaginatedResponse } from "./common";

export type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  department: {
    id: number;
    name: string;
  };
  totalProducts: number;
  activeProducts: number;
  productsWithStock: number;
};

export type CreateCategory = {
  name: string;
  departmentId: number;
  description: string;
  image: string;
  isActive: boolean;
};

export type UpdateCategory = CreateCategory;

export type GetAllCategories = PaginatedResponse<Category>;
