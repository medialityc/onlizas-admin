"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";
import { backendRoutes } from "@/lib/endpoint";
import {
  CreateEasyInventory,
  GetAllInventoryProviderResponse,
  InventoryProvider,
} from "@/types/inventory";
import { GetAllProductVariant } from "@/types/products";
import { fetchUserMe } from "./users";

const INVENTORY_TAG_KEY = "inventory-provider";

export async function createInventoryProvider(
  data: CreateEasyInventory
): Promise<ApiResponse<InventoryProvider>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}

export async function updateInventoryProvider(
  parentProductId: number | string,
  data: FormData
): Promise<ApiResponse<InventoryProvider>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.updateById(parentProductId),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}

export async function getAllInventoryProvider(
  params: IQueryable
): Promise<ApiResponse<GetAllInventoryProviderResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllInventoryProviderResponse>(res);
}

export async function getAllInventoryByUserProvider(
  supplierId: string,
  params: IQueryable
): Promise<ApiResponse<GetAllInventoryProviderResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.listByUserProvider(supplierId)
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY, String(supplierId)] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllInventoryProviderResponse>(res);
}

export async function getAllInventory(
  params: IQueryable
): Promise<ApiResponse<GetAllInventoryProviderResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY, String("admin")] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllInventoryProviderResponse>(res);
}

export async function getInventoryById(
  id: number | string
): Promise<ApiResponse<InventoryProvider>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY, String(id)] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<InventoryProvider>(res);
}

export async function deleteInventoryProvider(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function addVariantToInventory(
  inventoryId: string | number,
  variantData: FormData
): Promise<ApiResponse<InventoryProvider>> {
  // Debug: Obtener y mostrar ID del proveedor autenticado
  const userRes = await fetchUserMe();
  const currentUser = userRes?.data;
  console.log(
    "DEBUG - ID del proveedor autenticado (addVariantToInventory):",
    currentUser?.id
  );
  console.log(
    "DEBUG - Datos completos del usuario (addVariantToInventory):",
    currentUser
  );

  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.AddVariantToInventory(inventoryId),
    method: "POST",
    data: variantData,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}
export async function editVariantInventory(
  variantId: string | number,
  variantData: FormData
): Promise<ApiResponse<InventoryProvider>> {
  // Debug: Obtener y mostrar ID del proveedor autenticado
  const userRes = await fetchUserMe();
  const currentUser = userRes?.data;
  console.log(
    "DEBUG - ID del proveedor autenticado (editVariantInventory):",
    currentUser?.id
  );
  console.log(
    "DEBUG - Datos completos del usuario (editVariantInventory):",
    currentUser
  );

  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.editVariantInventory(variantId),
    method: "PUT",
    data: variantData,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}

export async function deleteVariantInventory(
  inventoryId: string | number,
  variantId: string | number
): Promise<ApiResponse<InventoryProvider>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.removeVariant(inventoryId, variantId),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}
export async function getAllMyInventoryProvider(
  params: IQueryable
): Promise<ApiResponse<GetAllInventoryProviderResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.listByProvider
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllInventoryProviderResponse>(res);
}

export async function getAllInventoryVariantsByCategories(
  params: IQueryable
): Promise<ApiResponse<GetAllProductVariant>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.variantByCategory
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllProductVariant>(res);
}

export async function getAllInventoryVariantsBySupplier(
  params: IQueryable
): Promise<ApiResponse<GetAllProductVariant>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.inventoryProvider.variantBySupplier
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [INVENTORY_TAG_KEY] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllProductVariant>(res);
}
