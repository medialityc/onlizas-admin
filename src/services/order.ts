"use server";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { IQueryable } from "@/types/fetch/request";
import { GetAllOrders, Order } from "@/types/order";

import { nextAuthFetch } from "./utils/next-auth-fetch";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { updateTag } from "next/cache";

export async function getAllOrders(
  params: IQueryable,
): Promise<ApiResponse<GetAllOrders>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.orders.list,
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["orders"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllOrders>(res);
}

export async function getOrdersByStore(
  storeId: string,
  params: IQueryable,
): Promise<ApiResponse<GetAllOrders>> {
  const url = new QueryParamsURLFactory(
    { ...params.pagination },
    backendRoutes.orders.supplierList(storeId),
  ).build();
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["orders", "store-orders"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllOrders>(res);
}

export async function getOrderById(
  id: string | number,
): Promise<ApiResponse<Order>> {
  const res = await nextAuthFetch({
    url: backendRoutes.orders.getById(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["orders"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<Order>(res);
}

export type UpdateSubOrderStatusPayload = {
  orderCode: string;
  parcelCodes: string[];
  state: number;
  description: string;
};

export async function updateSubOrderStatus(
  data: UpdateSubOrderStatusPayload,
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch<UpdateSubOrderStatusPayload>({
    url: backendRoutes.orders.updateSubOrderStatus,
    method: "PATCH",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  updateTag("orders");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
