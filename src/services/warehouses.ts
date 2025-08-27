"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  GetAllWarehouses,
  Warehouse,
  WarehouseFilter,
} from "@/types/warehouses";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";

export async function getAllWarehouses(
  params: IQueryable & WarehouseFilter
): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouses.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllWarehouses>(res);
}

export async function getWarehouseById(
  id: number
): Promise<ApiResponse<WarehouseFormData>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.edit(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses", String(id)] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<WarehouseFormData>(res);
}

export async function createWarehouse(
  data: WarehouseFormData
): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("warehouses");
  return buildApiResponseAsync<Warehouse>(res);
}

export async function updateWarehouse(
  id: number,
  data: WarehouseFormData,
  audit: { reason?: string } = {}
): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.update(id),
    method: "PUT",
    data: { ...data, audit },
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("warehouses");
  return buildApiResponseAsync<Warehouse>(res);
}

export async function deleteWarehouse(
  id: number,
  audit: { reason?: string } = {}
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.delete(id),
    method: "DELETE",
    data: audit,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("warehouses");
  return buildApiResponseAsync<{ success: boolean }>(res);
}

export async function deactivateWarehouse(
  id: number,
  audit: { reason?: string } = {}
): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.update(id),
    method: "PUT",
    data: { status: "inactive", audit },
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag("warehouses");
  return buildApiResponseAsync<Warehouse>(res);
}

export async function getAllWarehousesBySupplier(
  supplierId: number,
  params: IQueryable
): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.warehouses.listBySupplier(supplierId)
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["warehouses-supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllWarehouses>(res);
}

export async function getAllWarehousesPhysical(
  params: IQueryable
): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.warehouses.listPhysical
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["warehouses-physical"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllWarehouses>(res);
}
