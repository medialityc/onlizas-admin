import { PaginatedResponse } from "./common";

export enum CategorySuggestionState {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface CategorySuggestion {
  id: string;
  name: string;
  description?: string;
  state: CategorySuggestionState;
  suggestedByUserId: string;
  suggestedByUserName?: string;
  departmentId?: string;
  departmentName?: string;
  approvalProcessId?: string;
  approvalProcessName?: string;
  adminNotes?: string;
  reviewedByUserId?: string;
  reviewedByUserName?: string;
  reviewedAt?: string;
  createdDatetime: string;
}

export interface CreateCategorySuggestionPayload {
  name: string;
  description?: string;
  departmentId?: string;
}

export interface ReviewCategorySuggestionPayload {
  approved: boolean;
  adminNotes?: string;
}

export interface CategorySuggestionQueryParams {
  search?: string;
  state?: CategorySuggestionState;
  supplierId?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export type GetAllCategorySuggestions = PaginatedResponse<CategorySuggestion>;
