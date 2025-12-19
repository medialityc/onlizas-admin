"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { GetSupplierAccounts, SupplierAccount } from "@/types/finance";
import { SupplierAccountInput } from "@/sections/finance/schemas/supplier-account";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { updateTag } from "next/cache";

export async function getSupplierAccounts(
  supplierId: string | number
): Promise<ApiResponse<GetSupplierAccounts>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.list(supplierId),
    method: "GET",
    useAuth: true,
    next: { tags: ["supplier-accounts"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetSupplierAccounts>(res);
}

export async function createSupplierAccount(
  supplierId: string | number,
  data: SupplierAccountInput
): Promise<ApiResponse<SupplierAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.create(supplierId),
    method: "POST",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("supplier-accounts");
  return buildApiResponseAsync<SupplierAccount>(res);
}

export async function getSupplierAccountById(
  id: string | number
): Promise<ApiResponse<SupplierAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.detail(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["supplier-accounts"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<SupplierAccount>(res);
}

export async function updateSupplierAccount(
  id: string | number,
  data: SupplierAccountInput
): Promise<ApiResponse<SupplierAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.update(id),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("supplier-accounts");
  return buildApiResponseAsync<SupplierAccount>(res);
}

export async function deleteSupplierAccount(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.delete(id),
    method: "DELETE",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("supplier-accounts");
  return buildApiResponseAsync<ApiStatusResponse>(res);
}

export async function setSupplierAccountPrimary(
  id: string | number
): Promise<ApiResponse<SupplierAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.supplierAccounts.setPrimary(id),
    method: "PUT",
    useAuth: true,
  });

  if (!res.ok) return handleApiServerError(res);

  updateTag("supplier-accounts");
  return buildApiResponseAsync<SupplierAccount>(res);
}
