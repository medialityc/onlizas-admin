"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { ApiResponse, ApiStatusResponse } from "@/types/fetch/api";
import { GetPlatformAccounts, PlatformAccount } from "@/types/finance";
import { PlatformAccountCreateInput } from "@/sections/finance/schemas/platform-account";
import { nextAuthFetch } from "../utils/next-auth-fetch";

export async function getPlatformAccounts(): Promise<
  ApiResponse<GetPlatformAccounts>
> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.platformAccounts.list,
    method: "GET",
    useAuth: true,
    next: { tags: ["platform-accounts"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetPlatformAccounts>(res);
}

export async function createPlatformAccount(
  data: PlatformAccountCreateInput
): Promise<ApiResponse<{ status: number }>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.platformAccounts.list,
    method: "POST",
    useAuth: true,
    data: JSON.stringify({
      ...data,
      purpose: Number(data.purpose),
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<{ status: number }>(res);
}

export async function getPlatformAccountById(
  id: string | number
): Promise<ApiResponse<PlatformAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.platformAccounts.detail(id),
    method: "GET",
    useAuth: true,
    next: { tags: ["platform-accounts"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PlatformAccount>(res);
}

export async function updatePlatformAccount(
  id: string | number,
  data: PlatformAccountCreateInput
): Promise<ApiResponse<PlatformAccount>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.platformAccounts.update(id),
    method: "PUT",
    useAuth: true,
    data: JSON.stringify({
      ...data,
      purpose: Number(data.purpose),
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<PlatformAccount>(res);
}

export async function toggleStatusPlatformAccount(
  id: string | number
): Promise<ApiResponse<ApiStatusResponse>> {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.platformAccounts.toggleStatus(id),
    method: "PUT",
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ApiStatusResponse>(res);
}
