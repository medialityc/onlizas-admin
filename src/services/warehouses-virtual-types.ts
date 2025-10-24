"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { WarehouseFilter } from "@/types/warehouses";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { GetAllWarehousesVirtualType, CanDeleteWarehouseVirtualTypeResponse, WarehouseVirtualTypeDetails } from "@/sections/warehouse-virtual-type/interfaces/warehouse-virtual-type.interface";
import { WarehouseVirtualTypeFormData } from "@/sections/warehouse-virtual-type/schemas/warehouse-virtual-type-schema";

const WAREHOUSE_VIRTUAL_TYPE_TAG = "warehouse-virtual-types";

export async function getAllWarehousesVirtualType(
  params: IQueryable & WarehouseFilter
): Promise<ApiResponse<GetAllWarehousesVirtualType>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouseVirtualTypes.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [WAREHOUSE_VIRTUAL_TYPE_TAG] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllWarehousesVirtualType>(res);
}

export async function getWarehouseVirtualTypeById(
  typeId: string
): Promise<ApiResponse<WarehouseVirtualTypeDetails>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.getById(typeId),
    method: "GET",
    useAuth: true,
    next: { tags: [WAREHOUSE_VIRTUAL_TYPE_TAG] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<WarehouseVirtualTypeDetails>(res);
}

export async function createWarehouseVirtualType(
  data: WarehouseVirtualTypeFormData
): Promise<ApiResponse<WarehouseVirtualTypeFormData>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(WAREHOUSE_VIRTUAL_TYPE_TAG);
  return buildApiResponseAsync<WarehouseVirtualTypeFormData>(res);
}

export async function updateWarehouseVirtualType(
  typeId: string,
  data: WarehouseVirtualTypeFormData
): Promise<ApiResponse<WarehouseVirtualTypeFormData>> {
  // Solo enviar los campos que espera el backend
  const updatePayload = {
    name: data.name,
    defaultRules: data.defaultRules,
    active: data.active,
  };
  
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.update(typeId),
    method: "PUT",
    data: updatePayload,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(WAREHOUSE_VIRTUAL_TYPE_TAG);
  return buildApiResponseAsync<WarehouseVirtualTypeFormData>(res);
}

export async function toggleStatusWarehouseVirtualType(
  typeId: string
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.toggleStatus(typeId),
    method: "PATCH",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(WAREHOUSE_VIRTUAL_TYPE_TAG);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function canDeleteWarehouseVirtualType(
  typeId: string
): Promise<ApiResponse<CanDeleteWarehouseVirtualTypeResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.canDelete(typeId),
    method: "GET",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<CanDeleteWarehouseVirtualTypeResponse>(res);
}

export async function deleteWarehouseVirtualType(
  typeId: string
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouseVirtualTypes.delete(typeId),
    method: "DELETE",
    useAuth: true,
    data:JSON.stringify({typeId}),
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(WAREHOUSE_VIRTUAL_TYPE_TAG);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
