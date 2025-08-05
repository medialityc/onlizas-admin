"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";

import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { revalidateTag } from "next/cache";
import { GetAllSuppliers, Supplier } from "@/types/suppliers";

export async function createSupplier(
  data: FormData
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.create,
    method: "POST",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("suppliers");

  return buildApiResponseAsync<Supplier>(res);
}

export async function deleteSuppliers(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("categories");

  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function getAllSuppliers(
  params: IQueryable
): Promise<ApiResponse<GetAllSuppliers>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.suppliers.list
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["suppliers"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllSuppliers>(res);
}

export async function updateSupplier(
  id: string | number,
  data: FormData
): Promise<ApiResponse<Supplier>> {
  const res = await nextAuthFetch({
    url: backendRoutes.suppliers.update(id),
    method: "PUT",
    data,
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);
  revalidateTag("suppliers");

  return buildApiResponseAsync<Supplier>(res);
}
