"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { backendRoutes } from "@/lib/endpoint";
import { PaginatedResponse } from "@/types/common";

export type InventoryProductItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  discountedPrice: number;
  discountType: number;
  discountValue: number;
  limitPurchaseLimit: number;
  warranty?: {
    isWarranty: boolean;
    warrantyTime: number;
    warrantyPrice: number;
  };
  isPrime: boolean;
  quantity: number;
  inventoryId: number;
  storeId: number;
  storeName: string;
  details: string[];
  images?: string[];
};

// Tipos para Currency
export type InventoryProvider = {
  id: number;
  isActive: boolean;
  parentProductId: number;
  parentProductName: string;
  storeId: number;
  storeName: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  totalPrice: number;
  totalQuantity: number;

  products: InventoryProductItem[];
};

export type GetAllInventoryProvider = {
  data: InventoryProvider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetAllInventoryProviderResponse =
  PaginatedResponse<InventoryProvider>;

const INVENTORY_TAG_KEY = "inventory-provider";

export async function createInventoryProvider(
  data: any
): Promise<ApiResponse<InventoryProvider>> {
  const res = await nextAuthFetch({
    url: backendRoutes.inventoryProvider.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<InventoryProvider>(res);
}

export async function getAllInventoryProvider(
  params: IQueryable
): Promise<ApiResponse<GetAllInventoryProvider>> {
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

  return buildApiResponseAsync<GetAllInventoryProvider>(res);
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
  revalidateTag(INVENTORY_TAG_KEY);

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllInventoryByUserProvider(
  supplierId: number,
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
