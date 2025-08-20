"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { Category, GetAllCategories } from "@/types/categories";

export async function createCategory(
  data: FormData
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) throw await handleApiServerError(res);

  revalidateTag("categories");
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

  if (!res.ok) throw await handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<Category>(res);
}

export async function deleteCategory(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.categories.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

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
