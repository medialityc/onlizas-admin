"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreateBrandRequest,
  CreateBrandResponse,
  GetAllBrandsResponse,
  Brand,
  UpdateBrandRequest,
  UpdateBrandResponse,
} from "@/types/brands";
import { revalidateTag } from "next/cache";
import { nextAuthFetch } from "./utils/next-auth-fetch";

export async function getAllBrands(
  params: IQueryable
): Promise<ApiResponse<GetAllBrandsResponse>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.brands.getAll
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["brands"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllBrandsResponse>(res);
}

export async function createBrand(
  data: CreateBrandRequest
): Promise<ApiResponse<CreateBrandResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.brands.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("brands", "max");
  return buildApiResponseAsync<CreateBrandResponse>(res);
}

export async function getBrandById(
  id: string | number
): Promise<ApiResponse<Brand>> {
  const res = await nextAuthFetch({
    url: backendRoutes.brands.getById(id),
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Brand>(res);
}

export async function updateBrand(
  id: string | number,
  data: UpdateBrandRequest
): Promise<ApiResponse<UpdateBrandResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.brands.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("brands", "max");
  return buildApiResponseAsync<UpdateBrandResponse>(res);
}

export async function deleteBrand(
  id: string | number
): Promise<ApiResponse<{ status: string }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.brands.delete(id),
    method: "DELETE",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("brands", "max");
  return buildApiResponseAsync<{ status: string }>(res);
}
