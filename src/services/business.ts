"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { Business, GetAllBusiness } from "@/types/business";

export async function getAllBusiness(
  params: IQueryable
): Promise<ApiResponse<GetAllBusiness>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.business.getAll
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["business"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllBusiness>(res);
}

export async function createBusiness(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  console.log("Creating business with data:");
  const res = await nextAuthFetch({
    url: backendRoutes.business.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateBusinessData(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Business>> {
  const res = await nextAuthFetch({
    url: backendRoutes.business.update(id),
    method: "PUT",
    data,
    useAuth: true,
    contentType: "multipart/form-data",
    // No establecer Content-Type manualmente para FormData
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<Business>(res);
}

export async function deleteBusiness(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.business.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("business");

  return buildApiResponseAsync(res);
}

export async function getAllUserBusiness(
  id: string | number,
  params: IQueryable
): Promise<ApiResponse<GetAllBusiness>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.business.getByUser(id)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["business"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllBusiness>(res);
}
export async function getUserBusiness(
  params: IQueryable
): Promise<ApiResponse<GetAllBusiness>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.business.forUser
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["business"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllBusiness>(res);
}
