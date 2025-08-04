// Common types for pagination and filtering

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortingParams {
  sortBy?: string;
  isDescending?: boolean;
}

export interface SearchParams {
  search?: string;
}

export interface PaginatedRequest
  extends PaginationParams,
    SortingParams,
    SearchParams {}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number; 
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Attributes {
  [key: string]: string;
}
