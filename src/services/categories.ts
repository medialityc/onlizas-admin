"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";
import {
  Category,
  GetAllAduanaCategories,
  GetAllCategories,
} from "@/types/categories";

export async function createCategory(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("categories");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateCategory(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Category>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag("categories");

  return buildApiResponseAsync<Category>(res);
}

export async function toggleStatusCategory(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.toggleStatus(id),
    method: "PUT",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllCategories(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}

export async function getCategoryById(
  id: string | number
): Promise<ApiResponse<Category>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.detail(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["categories"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Category>(res);
}
export async function getAduanaCategories(): Promise<
  ApiResponse<GetAllAduanaCategories>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.aduanaCategories,
    method: "GET",
    useAuth: true,
    next: { tags: ["aduana-categories"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllAduanaCategories>(res);
}
// Para autocomplete infinito en promociones
export async function getCategoriesForPromotion(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["categories-promotion"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}

// Me supplier

export async function getAllMeApprovedCategories(
  params: IQueryable
): Promise<ApiResponse<GetAllCategories>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.categories.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["supplier-approved-categories"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCategories>(res);
}
