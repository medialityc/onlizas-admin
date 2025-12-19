"use server";

import { ApiResponse } from "@/types/fetch/api";
import {
  Region,
  RegionFormData,
  GetAllRegions,
  AddCurrenciesPayload,
  AddPaymentGatewaysPayload,
  UpdatePaymentPriorityPayload,
  AddShippingMethodsPayload,
} from "@/types/regions";
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import {
  buildApiResponseAsync,
  handleApiServerError,
  getErrorMessage,
} from "@/lib/api";
import { updateTag } from "next/cache";

interface RegionResolution {
  region: Region;
  primaryCurrency: string;
  enabledPaymentGateways: Array<{
    gatewayId: number | string;
    priority: number | string;
    isFallback: boolean;
  }>;
  enabledShippingMethods: Array<{
    methodId: number | string;
    metadata: Record<string, any>;
  }>;
}

// CRUD operations using real backend API calls
export async function getRegions(
  params?: IQueryable
): Promise<ApiResponse<GetAllRegions>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.regions.get
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["regions"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllRegions>(res);
}

export async function getRegionById(
  id: number | string
): Promise<ApiResponse<Region | null>> {
  const baseUrl = backendRoutes.regions.listById(id);
  const url = `${baseUrl}?include=`;

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
  });

  if (!res.ok) {
    if (res.status === 404) {
      return {
        data: null,
        status: 404,
        error: true,
        message: "Región no encontrada",
      };
    }
    return handleApiServerError(res);
  }

  return buildApiResponseAsync<Region>(res);
}

export async function createRegion(
  data: RegionFormData
): Promise<ApiResponse<Region | null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.create,
    method: "POST",
    data: JSON.stringify(data),
    useAuth: true,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return buildApiResponseAsync<Region>(res);
}

export async function updateRegion(
  id: number | string,
  data: Partial<RegionFormData>
): Promise<ApiResponse<Region | null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.update(id),
    method: "PUT",
    data: JSON.stringify(data),
    useAuth: true,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return buildApiResponseAsync<Region>(res);
}

export async function deleteRegion(
  id: number | string
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.delete(id),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({ id }),
    contentType: "application/json",
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

// Currency management services
export async function removeCurrencyFromRegion(
  regionId: number | string,
  currencyId: number | string
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.currencies.remove(regionId, currencyId),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({ regionId, currencyId }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

export async function addCurrenciesToRegion(
  regionId: number | string,
  payload: AddCurrenciesPayload
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.currencies.add(regionId),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return buildApiResponseAsync<boolean>(res);
}

export async function setPrimaryCurrency(
  regionId: number | string,
  currencyId: number | string
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.currencies.setPrimary(regionId, currencyId),
    method: "PUT",
    data: JSON.stringify({ regionId, currencyId }),
    useAuth: true,
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

// Payment gateway management services
export async function removePaymentGatewayFromRegion(
  regionId: number | string,
  gatewayId: number | string
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.payments.remove(regionId, gatewayId),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({ regionId, gatewayId }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

export async function addPaymentGatewaysToRegion(
  regionId: number | string,
  payload: AddPaymentGatewaysPayload
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.payments.add(regionId),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return buildApiResponseAsync<boolean>(res);
}

export async function updatePaymentGatewayPriority(
  regionId: number | string,
  gatewayId: number | string,
  payload: UpdatePaymentPriorityPayload
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.payments.updatePriority(regionId, gatewayId),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

// Shipping methods management services
export async function removeShippingMethodFromRegion(
  regionId: number | string,
  shippingId: number | string
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.shipping.remove(regionId, shippingId),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({ regionId, shippingId }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return { data: true, status: 200, error: false };
}

export async function addShippingMethodsToRegion(
  regionId: number | string,
  payload: AddShippingMethodsPayload
): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.shipping.add(regionId),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    return handleApiServerError(res);
  }

  updateTag("regions");
  return buildApiResponseAsync<boolean>(res);
}
