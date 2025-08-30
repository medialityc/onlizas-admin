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
import { GetAllUsersResponse } from "../types/users";
import { WAREHOUSE_TYPE_ENUM } from "@/sections/warehouses/constants/warehouse-type";
import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";
import { PaginatedResponse } from "@/types/common";
import { InventoryProductItem } from "@/types/inventory";

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

/*
 * todos los almacenes por type
 */
export async function getAllWarehousesByType(
  params: IQueryable & WarehouseFilter,
  type: WAREHOUSE_TYPE_ENUM
): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouses.listByType(type)
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses", type] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllWarehouses>(res);
}

/*
 * inventarios de un almacén
 */
export async function getAllWarehouseInventories(
  warehouseId: string | number,
  params?: IQueryable
): Promise<ApiResponse<PaginatedResponse<InventoryProviderFormData>>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouses.inventoryList(warehouseId)
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses-inventories"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PaginatedResponse<InventoryProviderFormData>>(
    res
  );
}

/*
 * variantes de un almacén
 */
export async function getAllWarehouseProductVariants(
  warehouseId: string | number,
  params?: IQueryable
): Promise<ApiResponse<InventoryProductItem[]>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouses.variantList(warehouseId)
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses-product-variants"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<InventoryProductItem[]>(res);
}

/*
 * lista de proveedores asociados
 */
export async function getAllSupplierWarehouses(
  params: IQueryable
): Promise<ApiResponse<GetAllUsersResponse>> {
  const url = new QueryParamsURLFactory(
    { ...params, role: "ONL_SUPPLIER" },
    backendRoutes.warehouses.listSupplier
  ).build();
  console.log(url);

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["associate-supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllUsersResponse>(res);
}

export async function getWarehouseById(
  id: number,
  type: string
): Promise<ApiResponse<WarehouseFormData>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouses.edit(id, type),
    method: "GET",
    useAuth: true,
    next: { tags: ["warehouses", String(id), type] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<WarehouseFormData>(res);
}

export async function createWarehouse(
  data: WarehouseFormData
): Promise<ApiResponse<Warehouse>> {
  const res = await nextAuthFetch({
    url: `${backendRoutes.warehouses.create}/${data?.type ?? WAREHOUSE_TYPE_ENUM.physical}`,
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
