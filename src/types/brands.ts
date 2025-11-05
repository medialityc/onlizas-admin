import { PaginatedResponse } from "./common";

export interface Brand {
  id: string;
  name: string;
  productsCount: number;
}

export type GetAllBrandsResponse = PaginatedResponse<Brand>;

export interface CreateBrandRequest {
  name: string;
}
export interface CreateBrandResponse {
  status: string;
}

export interface UpdateBrandRequest {
  name?: string;
}
export interface UpdateBrandResponse {
  message: string;
}

export type GetBrandByIdResponse = Brand;
