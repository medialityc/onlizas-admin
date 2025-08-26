"use server";
import { IQueryable } from "@/types/fetch/request";

import { Store, GetAllStores, GetStoreMetrics } from "../types/stores";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { revalidateTag } from "next/cache";
import { PaginatedResponse } from "@/types/common";

export async function getAllStores(
  params: IQueryable
): Promise<ApiResponse<GetAllStores>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.store.listAll
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["stores"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllStores>(res);
}
export async function getAllProviderStores(
  supplierId: string,
  params: IQueryable,
  includeMetics: boolean = true
): Promise<ApiResponse<GetAllStores>> {
  const url = new QueryParamsURLFactory(
    { ...params, includeMetics },
    backendRoutes.store.listByProvider(supplierId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["stores-all-provider"] },
  });
  

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllStores>(res);
}
export async function getProviderStores(
  params: IQueryable,
  includeMetics: boolean = true
): Promise<ApiResponse<GetAllStores>> {
  const url = new QueryParamsURLFactory(
    { ...params, includeMetics },
    backendRoutes.store.listForProvider
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["stores"] },
  });

  if (!res.ok) return handleApiServerError(res);
  

  return buildApiResponseAsync<GetAllStores>(res);
}

export async function getMetricStores(
  params: IQueryable
): Promise<ApiResponse<GetStoreMetrics>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.store.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["stores-metrics"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetStoreMetrics>(res);
}

export async function deleteStore(
  supplierId: number,
  storeId: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.delete(supplierId, storeId),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("stores");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}
export async function getStoreById(
  supplierId: number,
  storeId: number
): Promise<ApiResponse<Store | undefined>> {
  const url = backendRoutes.store.storeById(supplierId, storeId);
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export async function createStore(
  // supplierId: number,
  data: FormData
): Promise<ApiResponse<Store>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) {
    console.log("Error creating store", res);
    return handleApiServerError(res);
  }
  revalidateTag("stores");
  console.log("Store created successfully", res);
  return buildApiResponseAsync<Store>(res);
}
export async function createStoreSupplier(
  supplierId: number,
  data: FormData
): Promise<ApiResponse<Store>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.createSupplier(supplierId),
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) {
    console.log("Error creating store", res);
    return handleApiServerError(res);
  }
  revalidateTag("stores-supplier");
  console.log("Store created successfully", res);
  return buildApiResponseAsync<Store>(res);
}

export async function updateSupplierStore(
  storeId: number,
  data: FormData
): Promise<ApiResponse<Store | undefined>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.updateSupplierStore(storeId),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("stores");
  revalidateTag("store-details");
  return buildApiResponseAsync<Store>(res);
}
export async function updateAdminStore(
  storeId: number,
  data: FormData
): Promise<ApiResponse<Store | undefined>> {
  const res = await nextAuthFetch({
    url: backendRoutes.store.updateAdminStore(storeId),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("stores");
  revalidateTag("store-details");
  return buildApiResponseAsync<Store>(res);
}

export async function getStoreDetails(
  storeId: number
): Promise<ApiResponse<Store | undefined>> {
  const url = backendRoutes.store.details(storeId);
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["store-details"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export async function getStoreSupplierDetails(
  storeId: number
): Promise<ApiResponse<Store | undefined>> {
  const url = backendRoutes.store.storeDetails(storeId);
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Store>(res);
}

export type StoreFollower = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

export async function getStoreFollowers(
  storeId: number,
  params: IQueryable
): Promise<ApiResponse<PaginatedResponse<StoreFollower>>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.store.followers(storeId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PaginatedResponse<StoreFollower>>(res);
}
