"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { backendRoutes } from "@/lib/endpoint";

// Tipos para Currency
export type Currency = {
  id: number;
  name: string;
  codIso: string;
  rate: number;
  default: boolean;
  isActive: boolean;
};

export type CreateCurrency = {
  name: string;
  codIso: string;
  symbol: string;
  rate: number;
};

export type UpdateCurrency = {
  name: string;
  symbol: string;
  rate: number;
};

export type GetAllCurrencies = {
  data: Currency[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function createCurrency(
  data: CreateCurrency
): Promise<ApiResponse<Currency>> {
  const res = await nextAuthFetch({
    url: backendRoutes.currencies.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("currencies");

  return buildApiResponseAsync<Currency>(res);
}

export async function deleteCurrency(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.currencies.delete(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("currencies");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllCurrencies(
  params: IQueryable
): Promise<ApiResponse<GetAllCurrencies>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.currencies.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["currencies"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllCurrencies>(res);
}

export async function updateCurrency(
  id: string | number,
  data: UpdateCurrency
): Promise<ApiResponse<Currency>> {
  const res = await nextAuthFetch({
    url: backendRoutes.currencies.update(id),
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("currencies");

  return buildApiResponseAsync<Currency>(res);
}

export async function setAsDefaultCurrency(
  id: string | number
): Promise<ApiResponse<Currency>> {
  const res = await nextAuthFetch({
    url: backendRoutes.currencies.setAsDefault(id),
    method: "PATCH",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("currencies");

  return buildApiResponseAsync<Currency>(res);
}
