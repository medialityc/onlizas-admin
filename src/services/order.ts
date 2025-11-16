"use server";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { IQueryable } from "@/types/fetch/request";
import { GetAllOrders } from "@/types/order";

import { nextAuthFetch } from "./utils/next-auth-fetch";
import { ApiResponse } from "@/types/fetch/api";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

export async function getAllOrders(
  params: IQueryable
): Promise<ApiResponse<GetAllOrders>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.orders.list
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["locations"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllOrders>(res);
}

export async function getSupplierOrders(
  params: IQueryable
): Promise<ApiResponse<GetAllOrders>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.orders.supplierList
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["orders", "supplier-orders"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllOrders>(res);
}
