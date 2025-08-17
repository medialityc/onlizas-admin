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
