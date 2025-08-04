export type IPagination = {
  page: number;
  pageSize: number;
};

export type IQueryable = {
  search?: string;
  sortBy?: string;
  isDescending?: boolean;
  pagination?: IPagination;
} & Record<string, unknown>;

export type SearchParams = {
  search?: string;
  sortBy?: string;
  isDescending?: boolean;
  page?: number;
  pageSize?: number;
};
