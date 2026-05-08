"use server";

import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";
import { backendRoutes } from "@/lib/endpoint";
import { QueryParamsURLFactory } from "@/lib/request";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  Claim,
  ClaimStatus,
  ClaimType,
  GetAllClaims,
  ResolveClaimPayload,
} from "@/types/claims";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { updateTag } from "next/cache";

function normalizeStatus(status: any): ClaimStatus {
  const numericStatus = typeof status === "string" ? Number(status) : status;
  const map: Record<number, ClaimStatus> = {
    0: ClaimStatus.PENDING,
    1: ClaimStatus.UNDER_REVIEW,
    2: ClaimStatus.RESOLVED_FAVOR_CLIENT,
    3: ClaimStatus.RESOLVED_FAVOR_SUPPLIER,
    4: ClaimStatus.CANCELLED,
  };
  return map[numericStatus] ?? ClaimStatus.PENDING;
}

function normalizeType(type: any): ClaimType {
  const numericType = typeof type === "string" ? Number(type) : type;
  const map: Record<number, ClaimType> = {
    0: ClaimType.DEFECTIVE_PRODUCT,
    1: ClaimType.WRONG_PRODUCT,
    2: ClaimType.NOT_RECEIVED,
    3: ClaimType.INCOMPLETE_ORDER,
    99: ClaimType.OTHER,
  };
  return map[numericType] ?? ClaimType.OTHER;
}

function normalizeClaims(items: any[]): Claim[] {
  return items.map((item) => ({
    ...item,
    status: normalizeStatus(item.status),
    type: normalizeType(item.type),
  }));
}

function mapPaginatedResponse(response: any): GetAllClaims {
  const page = response.page ?? 0;
  const pageSize = response.pageSize ?? 0;
  const totalCount = response.totalCount ?? 0;
  const data = response.items || response.data || [];

  return {
    data,
    totalCount,
    page,
    pageSize,
    hasNext: totalCount > (page + 1) * pageSize,
    hasPrevious: page > 0,
  };
}

export async function getAllClaims(
  params: IQueryable,
): Promise<ApiResponse<GetAllClaims>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.claims.list,
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["claims"] },
  });

  if (!res.ok) return handleApiServerError(res);

  const response = await buildApiResponseAsync<GetAllClaims>(res);

  if (response.data) {
    const mapped = mapPaginatedResponse(response.data);
    mapped.data = normalizeClaims(mapped.data);
    response.data = mapped;
  }

  return response;
}

export async function resolveClaim(
  id: string | number,
  data: ResolveClaimPayload,
): Promise<ApiResponse<Claim>> {
  const res = await nextAuthFetch({
    url: backendRoutes.claims.resolve(id),
    method: "PUT",
    data,
    useAuth: true,
  });
  if (!res.ok) return handleApiServerError(res);
  updateTag("claims");
  return buildApiResponseAsync<Claim>(res);
}
