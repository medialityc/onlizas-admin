"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  GetAllClosures,
  ClosuresSummary,
  ClosureStatement,
  ClosureAccountsResponse,
} from "@/types/finance";
import { nextAuthFetch } from "../utils/next-auth-fetch";
import { PaginatedResponse } from "@/types/common";

export async function getAllClosures(
  params: IQueryable,
): Promise<ApiResponse<GetAllClosures>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.finance.closures.list,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closures"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllClosures>(res);
}

export async function getMyClosures(
  params: IQueryable,
): Promise<ApiResponse<GetAllClosures>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    `${process.env.NEXT_PUBLIC_API_URL}closures/supplier`,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closures", "supplier"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<GetAllClosures>(res);
}

export type SuppliersWithPendingResponse = {
  userId: string;
  userName: string;
  email: string;
  accounts: [
    {
      accountId: string;
      description: string;
      totalAmount: number;
      createdDate: string;
      dueDate: string;
      subOrdersCount: number;
      orderIds: string[];
    },
  ];
  totalPendingAccounts: number;
  totalPendingAmount: number;
  oldestDueDate: string;
  newestDueDate: string;
};

export async function getSuppliersWithPendingAccounts(
  params: IQueryable,
  fromDate?: string,
  toDate?: string,
): Promise<ApiResponse<PaginatedResponse<SuppliersWithPendingResponse>>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.finance.approval.suppliersWithPending,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["suppliers-with-pending-accounts"] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

export async function createPartialClosure(data: {
  periodStartDate: string;
  periodEndDate: string;
  notes?: string;
  suppliers: Array<{ supplierId: string; amountToPay: number }>;
}) {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.closures.partialCreate,
    method: "POST",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<{ status: number }>(res);
}

// Alternative payload: suppliers mapped by accountId (as requested)
export async function createPartialClosureByAccounts(data: {
  periodStartDate: string;
  periodEndDate: string;
  notes?: string;
  suppliers: Array<{ supplierId: string; accountId: string }>;
}) {
  const res = await nextAuthFetch({
    url: backendRoutes.finance.closures.partialCreate,
    method: "POST",
    useAuth: true,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<{ status: number }>(res);
}

export async function getClosureAccounts(
  closureId: string,
): Promise<ApiResponse<ClosureAccountsResponse>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}closures/${closureId}/accounts`;
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closure-accounts", closureId] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

export async function getClosureStatement(
  closureId: string,
): Promise<ApiResponse<ClosureStatement>> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}closures/${closureId}/statement`;
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closure-statement", closureId] },
  });
  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync(res);
}

export async function getClosuresSummary(params?: {
  startDate?: string;
  endDate?: string;
  closureType?: number;
}): Promise<ApiResponse<ClosuresSummary>> {
  const url = new QueryParamsURLFactory(
    { ...(params || {}) },
    backendRoutes.finance.closures.summary,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["closures-summary"] },
  });

  if (!res.ok) return handleApiServerError(res);
  return buildApiResponseAsync<ClosuresSummary>(res);
}
