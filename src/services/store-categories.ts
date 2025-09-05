"use server";

import { IQueryable } from "@/types/fetch/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { revalidateTag } from "next/cache";
import { PaginatedResponse } from "@/types/common";
import { 
  StoreCategory, 
  GetStoreCategories, 
  UpdateStoreCategoriesOrderRequest 
} from "@/types/store-categories";

export async function getStoreCategories(
  storeId: number
): Promise<ApiResponse<GetStoreCategories>> {
  const url = backendRoutes.storeCategories.list(storeId);
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["store-categories", `store-categories-${storeId}`] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetStoreCategories>(res);
}

// Para autocomplete infinito - adaptador que simula paginación
export async function getStoreCategoriesForSelect(
  storeId: number,
  params?: IQueryable
): Promise<ApiResponse<PaginatedResponse<StoreCategory>>> {
  const res = await getStoreCategories(storeId);
  if (res?.error) return res as any;

  const allCategories = res.data || [];
  const search = params?.search?.toLowerCase() || "";

  // Filtrar por búsqueda si existe
  const filtered = search
    ? allCategories.filter((cat) => cat.categoryName.toLowerCase().includes(search))
    : allCategories;

  // Return all filtered results as a single page (no real backend pagination)
  const paginatedResponse: PaginatedResponse<StoreCategory> = {
    data: filtered,
    totalCount: filtered.length,
    page: 1,
    pageSize: filtered.length,
    hasNext: false,
    hasPrevious: false,
  };

  return {
    data: paginatedResponse,
    error: false,
    status: 200,
    message: "Success",
  };
}

export async function toggleStoreCategoryStatus(
  storeCategoryId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storeCategories.toggle,
    method: "PATCH",
    data: JSON.stringify({ storeCategoryId }),
    contentType: "application/json",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("store-categories");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function updateStoreCategoriesOrder(
  storeId: number,
  orders: UpdateStoreCategoriesOrderRequest
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.storeCategories.order,
    method: "PUT",
    data: JSON.stringify({ storeId, orders }),
    contentType: "application/json",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("store-categories");
  revalidateTag(`store-categories-${storeId}`);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
