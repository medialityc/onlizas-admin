import { PaginatedResponse } from "./common";

export type Department = {
  id: number;
  name: string;
  description: string;
  image: string;
  active: boolean;
  categoriesCount: number;
  canDelete: boolean;
  canEdit: boolean;
};

export type CreateDepartment = {
  name: string;
  description: string;
  image: File | string;
  active: boolean;
};

export type GetAllDepartments = PaginatedResponse<Department>;

export type DepartmentLogs = {
  id: number;
  timestamp: string;
  description: string;
  departmentId: number;
  departmentName: string;
  userId: number;
  userName: string;
};

export type GetAllDepartmentsLogs = PaginatedResponse<DepartmentLogs>;
