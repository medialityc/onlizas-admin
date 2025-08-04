import { PaginatedResponse } from "./common";

export type Department = {
  id: number;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  categoriesCount: number;
  canDelete: boolean;
  canEdit: boolean;
};

export type CreateDepartment = {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
};

export type GetAllDepartments = PaginatedResponse<Department>;
