import { IQueryable, SearchParams } from "@/types/fetch/request";

export class QueryParamsURLFactory {
  private query: IQueryable;

  private baseUrl?: string;

  constructor(query: IQueryable, baseUrl?: string) {
    this.query = query;
    this.baseUrl = baseUrl;
  }

  build(): string {
    const queryParams = new URLSearchParams();
    const { pagination, search, ...rest } = this.query;

    // Add pagination
    if (pagination) {
      const { pageSize, page } = pagination;
      queryParams.append("pageSize", pageSize.toString());
      queryParams.append("page", page.toString());
    }

    // Add search
    if (search) queryParams.append("search", search);

    if (rest) {
      Object.keys(rest).forEach(key => {
      if (["create", "edit", "view"].includes(key)) return;
      if (Array.isArray(rest[key])) {
        rest[key].forEach(value => {
        queryParams.append(key, value.toString());
        });
      } else {
        queryParams.append(key, String(rest[key]));
      }
      });
    }

    // Generate complete URL if baseUrl is provided
    if (this.baseUrl) {
      const url = new URL(this.baseUrl);
      url.search = queryParams.toString();
      return url.toString();
    }

    return queryParams.toString();
  }
}

export const buildQueryParams = (
  params?: SearchParams & Record<string, unknown>
): IQueryable => {
  const { page, pageSize, search, ...restParams } = params || {
    search: "",
    page: 1,
    pageSize: 10,
  };

  const query: IQueryable = {
    pagination: {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? +pageSize : 10,
    },

    search,
    ...restParams, // Include additional key-value pairs in the query
  };
  return query;
};
