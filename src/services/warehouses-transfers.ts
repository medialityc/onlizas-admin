"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";

import {
  GetAllWarehouseTransfers,
  WarehouseTransfer,
  WarehouseTransferFilter,
} from "@/types/warehouses-transfers";
import { WarehouseTransferFormData } from "@/sections/warehouses/schemas/warehouse-transfer-schema";

const WAREHOUSE_TRANSFER_TAG = "warehouses-transfers";

export async function getAllTransfers(
  params: IQueryable & WarehouseTransferFilter
): Promise<ApiResponse<GetAllWarehouseTransfers>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.warehouse_transfers.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: [WAREHOUSE_TRANSFER_TAG] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllWarehouseTransfers>(res);
}

export async function getWarehouseTransferById(
  id: number
): Promise<ApiResponse<WarehouseFormData>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouse_transfers.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: [WAREHOUSE_TRANSFER_TAG, String(id)] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<WarehouseFormData>(res);
}

export async function createWarehouseTransfer(
  data: WarehouseTransferFormData
): Promise<ApiResponse<WarehouseTransfer>> {
  const res = await nextAuthFetch({
    url: backendRoutes.warehouse_transfers.create,
    method: "POST",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  revalidateTag(WAREHOUSE_TRANSFER_TAG);
  return buildApiResponseAsync<WarehouseTransfer>(res);
}
